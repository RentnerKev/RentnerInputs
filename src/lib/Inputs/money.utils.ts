import type {
    MoneyLocaleInfo,
    MoneyInputParseResult,
} from './Types/money.utils.types.ts'
import { resolveInputIntlLocale } from './messages.ts'
import type { InputLocale } from '../../shared/Inputs/Types/Messages.types.ts'

const moneyLocaleInfoCache = new Map<string, MoneyLocaleInfo>()

const numberFormatCache = new Map<string, Intl.NumberFormat>()

function getNumberFormatter(
    locale: string,
    options: Intl.NumberFormatOptions = {},
) {
    const key = JSON.stringify([locale, options])
    const cached = numberFormatCache.get(key)
    if (cached) return cached
    const formatter = new Intl.NumberFormat(locale, options)
    if (numberFormatCache.size >= 64)
        numberFormatCache.delete(numberFormatCache.keys().next().value!)
    numberFormatCache.set(key, formatter)
    return formatter
}

function normalizeLocalizedDigits(
    value: string,
    digits: MoneyLocaleInfo['digits'],
) {
    let normalized = ''
    let index = 0

    while (index < value.length) {
        const digit = digits.find(([localized]) =>
            value.startsWith(localized, index),
        )
        if (digit) {
            normalized += digit[1]
            index += digit[0].length
            continue
        }

        const codePoint = String.fromCodePoint(value.codePointAt(index) ?? 0)
        normalized += codePoint
        index += codePoint.length
    }

    return normalized
}

function normalizeLocaleGroupingWhitespace(value: string, group?: string) {
    if (!group || !/^\s$/u.test(group)) return value
    return value.replace(
        /[ \u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/gu,
        group,
    )
}

function isDigitSequence(value: string) {
    return /^\d*$/.test(value)
}

function getMoneyLocaleInfo(locale: InputLocale): MoneyLocaleInfo {
    const intlLocale = resolveInputIntlLocale(locale)
    const cachedInfo = moneyLocaleInfoCache.get(intlLocale)
    if (cachedInfo) return cachedInfo

    const digitFormatter = getNumberFormatter(intlLocale, {
        useGrouping: false,
        maximumFractionDigits: 0,
    })
    const digits = Array.from(
        { length: 10 },
        (_, digit) =>
            [digitFormatter.format(digit), String(digit)] as [string, string],
    )
    for (let digit = 0; digit < 10; digit++) {
        digits.push([String(digit), String(digit)])
    }
    digits.sort((left, right) => right[0].length - left[0].length)

    const numberFormatter = getNumberFormatter(intlLocale)
    const parts = numberFormatter.formatToParts(1234.5)
    const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
    const groupingParts = numberFormatter.formatToParts(1234567890123.5)
    const group = groupingParts.find((part) => part.type === 'group')?.value
    const integerGroupSizes = groupingParts
        .filter((part) => part.type === 'integer')
        .map((part) => normalizeLocalizedDigits(part.value, digits).length)
    const primaryGroupSize = integerGroupSizes.at(-1) ?? 3
    const secondaryGroupSize = integerGroupSizes.at(-2) ?? primaryGroupSize

    const info = {
        decimal,
        group,
        primaryGroupSize,
        secondaryGroupSize,
        digits,
        intlLocale,
    }
    if (moneyLocaleInfoCache.size >= 32) {
        const oldestLocale = moneyLocaleInfoCache.keys().next().value
        if (oldestLocale !== undefined) {
            moneyLocaleInfoCache.delete(oldestLocale)
        }
    }
    moneyLocaleInfoCache.set(intlLocale, info)
    return info
}

function parseMoneyInput(
    value: string,
    locale: InputLocale,
): MoneyInputParseResult {
    if (value === '') return { accepted: true, complete: false }

    const info = getMoneyLocaleInfo(locale)
    const normalizedDigits = normalizeLocalizedDigits(
        normalizeLocaleGroupingWhitespace(value, info.group),
        info.digits,
    )
    const fallbackDecimals = ['.', ','].filter(
        (separator) => separator !== info.decimal && separator !== info.group,
    )
    const fallbackDecimalsInValue = fallbackDecimals.filter((separator) =>
        normalizedDigits.includes(separator),
    )
    const hasLocaleDecimal = normalizedDigits.includes(info.decimal)

    if (
        fallbackDecimalsInValue.length > 1 ||
        (hasLocaleDecimal && fallbackDecimalsInValue.length > 0)
    ) {
        return { accepted: false, complete: false }
    }

    const decimal = hasLocaleDecimal ? info.decimal : fallbackDecimalsInValue[0]
    const segments = decimal
        ? normalizedDigits.split(decimal)
        : [normalizedDigits]
    if (segments.length > 2) return { accepted: false, complete: false }

    const [integerPart = '', fractionPart] = segments
    const integerGroups = info.group
        ? integerPart.split(info.group)
        : [integerPart]
    const normalizedGroups = integerGroups.map((part) =>
        normalizeLocalizedDigits(part, info.digits),
    )
    if (
        !isDigitSequence(fractionPart ?? '') ||
        (info.group !== undefined && fractionPart?.includes(info.group))
    ) {
        return { accepted: false, complete: false }
    }

    let completeInteger = false
    let acceptedIntegerPrefix = false

    if (normalizedGroups.length === 1) {
        const integer = normalizedGroups[0]
        completeInteger = isDigitSequence(integer)
        acceptedIntegerPrefix = completeInteger
    } else {
        const first = normalizedGroups[0]
        const last = normalizedGroups.at(-1) ?? ''
        const middle = normalizedGroups.slice(1, -1)
        const validFirst =
            /^\d+$/.test(first) && first.length <= info.secondaryGroupSize
        const validMiddle = middle.every(
            (part) =>
                /^\d+$/.test(part) && part.length === info.secondaryGroupSize,
        )
        const completedLastGroup =
            /^\d+$/.test(last) && last.length === info.primaryGroupSize
        const partialLastGroup =
            /^\d+$/.test(last) && last.length < info.primaryGroupSize
        const trailingGroupSeparator = last === ''
        const validPrefixTail =
            partialLastGroup ||
            (trailingGroupSeparator &&
                (middle.length === 0 ||
                    (middle.at(-1)?.length ?? 0) === info.secondaryGroupSize))

        acceptedIntegerPrefix =
            validFirst && validMiddle && (completedLastGroup || validPrefixTail)
        completeInteger = validFirst && validMiddle && completedLastGroup
    }

    const normalizedInteger = normalizedGroups.join('')
    const hasDigits = /\d/.test(`${normalizedInteger}${fractionPart ?? ''}`)
    const complete = completeInteger && hasDigits
    const accepted =
        acceptedIntegerPrefix &&
        (fractionPart === undefined || isDigitSequence(fractionPart))

    if (!accepted) return { accepted: false, complete: false }
    if (!complete) return { accepted: true, complete: false }

    return {
        accepted: true,
        complete: true,
        parts: {
            integer: normalizedInteger || '0',
            fraction: fractionPart,
        },
    }
}

export function parseMoneyValue(value: string, locale: InputLocale = 'de') {
    const result = parseMoneyInput(value, locale)
    if (!result.complete || !result.parts) return undefined

    const normalized = `${result.parts.integer}${
        result.parts.fraction === undefined ? '' : `.${result.parts.fraction}`
    }`
    const numericValue = Number(normalized)
    return Number.isFinite(numericValue) ? numericValue : undefined
}

export function acceptsMoney(value: string, locale: InputLocale = 'de') {
    return parseMoneyInput(value, locale).accepted
}

export function isCompleteMoneyValue(
    value: string,
    locale: InputLocale = 'de',
) {
    return value === '' || parseMoneyInput(value, locale).complete
}

export function formatMoneyValue(
    value: string,
    currency: string,
    locale: InputLocale = 'de',
) {
    const result = parseMoneyInput(value, locale)
    if (!result.complete || !result.parts) return undefined

    const { integer, fraction: fractionPart } = result.parts
    const { intlLocale, decimal } = getMoneyLocaleInfo(locale)

    const currencyFormatter = getNumberFormatter(intlLocale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
    const currencyParts = currencyFormatter.formatToParts(BigInt(integer))
    const defaultFractionDigits =
        getNumberFormatter(intlLocale, {
            style: 'currency',
            currency,
        }).resolvedOptions().minimumFractionDigits ?? 2
    const fraction = (fractionPart ?? '').padEnd(defaultFractionDigits, '0')

    if (fraction) {
        const digitFormatter = getNumberFormatter(intlLocale, {
            useGrouping: false,
            maximumFractionDigits: 0,
        })
        const localizedFraction = [...fraction]
            .map((digit) => digitFormatter.format(Number(digit)))
            .join('')
        const lastNumberPartIndex = currencyParts.findLastIndex(
            (part) => part.type === 'integer' || part.type === 'group',
        )
        currencyParts.splice(
            lastNumberPartIndex + 1,
            0,
            { type: 'decimal', value: decimal },
            { type: 'fraction', value: localizedFraction },
        )
    }

    return currencyParts.map((part) => part.value).join('')
}
