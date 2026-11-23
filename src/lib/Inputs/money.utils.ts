import type {
    MoneyLocaleInfo,
    MoneyInputParseResult,
} from './Types/money.utils.types.ts'
import { resolveInputIntlLocale } from './messages.ts'
import type { InputLocale } from '../../shared/Inputs/Types/Messages.types.ts'

interface InternalMoneyLocaleInfo extends MoneyLocaleInfo {
    usesAsciiDigits: boolean
    localizedDigits: readonly string[]
    singleUnitDigitMap: Map<string, string> | null
    hasWhitespaceGroup: boolean
    fallbackDecimals: readonly string[]
}

interface CurrencyFormatEntry {
    integerFormatter: Intl.NumberFormat
    defaultFractionDigits: number
}

const moneyLocaleInfoCache = /* @__PURE__ */ new Map<
    string,
    InternalMoneyLocaleInfo
>()
const currencyFormatCache = /* @__PURE__ */ new Map<
    string,
    CurrencyFormatEntry
>()
const WHITESPACE_GROUP_REGEX =
    /[ \u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/gu

function getCurrencyFormatEntry(
    intlLocale: string,
    currency: string,
): CurrencyFormatEntry {
    const key = `${intlLocale}\0${currency}`
    const cached = currencyFormatCache.get(key)
    if (cached) return cached
    const integerFormatter = new Intl.NumberFormat(intlLocale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
    const defaultFractionDigits =
        new Intl.NumberFormat(intlLocale, {
            style: 'currency',
            currency,
        }).resolvedOptions().minimumFractionDigits ?? 2
    const entry: CurrencyFormatEntry = {
        integerFormatter,
        defaultFractionDigits,
    }
    if (currencyFormatCache.size >= 64) {
        currencyFormatCache.delete(currencyFormatCache.keys().next().value!)
    }
    currencyFormatCache.set(key, entry)
    return entry
}

function normalizeLocalizedDigits(
    value: string,
    info: InternalMoneyLocaleInfo,
) {
    if (info.usesAsciiDigits) return value
    if (info.singleUnitDigitMap) {
        const map = info.singleUnitDigitMap
        let normalized = ''
        let changed = false
        for (let i = 0; i < value.length; i += 1) {
            const ch = value[i]!
            const mapped = map.get(ch)
            if (mapped !== undefined) {
                if (!changed) {
                    normalized = value.slice(0, i)
                    changed = true
                }
                normalized += mapped
            } else if (changed) {
                normalized += ch
            }
        }
        return changed ? normalized : value
    }

    const digits = info.digits
    let normalized = ''
    let index = 0

    while (index < value.length) {
        let matched: [string, string] | undefined
        for (let i = 0; i < digits.length; i += 1) {
            if (value.startsWith(digits[i]![0], index)) {
                matched = digits[i]
                break
            }
        }
        if (matched) {
            normalized += matched[1]
            index += matched[0].length
            continue
        }

        const codePoint = String.fromCodePoint(value.codePointAt(index) ?? 0)
        normalized += codePoint
        index += codePoint.length
    }

    return normalized
}

function isDigitSequence(value: string) {
    for (let i = 0; i < value.length; i += 1) {
        const code = value.charCodeAt(i)
        if (code < 48 || code > 57) return false
    }
    return true
}

function isNonEmptyDigitSequence(value: string) {
    return value.length > 0 && isDigitSequence(value)
}

function getMoneyLocaleInfo(locale: InputLocale): InternalMoneyLocaleInfo {
    const intlLocale = resolveInputIntlLocale(locale)
    const cachedInfo = moneyLocaleInfoCache.get(intlLocale)
    if (cachedInfo) return cachedInfo

    const digitFormatter = new Intl.NumberFormat(intlLocale, {
        useGrouping: false,
        maximumFractionDigits: 0,
    })
    const localizedDigits: string[] = []
    const digits: Array<[string, string]> = []
    let usesAsciiDigits = true
    let allSingleUnit = true
    for (let digit = 0; digit < 10; digit += 1) {
        const ascii = String(digit)
        const localized = digitFormatter.format(digit)
        localizedDigits.push(localized)
        digits.push([localized, ascii])
        if (localized !== ascii) usesAsciiDigits = false
        if (localized.length !== 1) allSingleUnit = false
    }
    for (let digit = 0; digit < 10; digit += 1) {
        const ascii = String(digit)
        digits.push([ascii, ascii])
    }
    digits.sort((left, right) => right[0].length - left[0].length)

    let singleUnitDigitMap: Map<string, string> | null = null
    if (!usesAsciiDigits && allSingleUnit) {
        singleUnitDigitMap = new Map<string, string>()
        for (let digit = 0; digit < 10; digit += 1) {
            const localized = localizedDigits[digit]!
            const ascii = String(digit)
            if (localized !== ascii) singleUnitDigitMap.set(localized, ascii)
        }
    }

    const numberFormatter = new Intl.NumberFormat(intlLocale)
    const parts = numberFormatter.formatToParts(1234.5)
    const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
    const groupingParts = numberFormatter.formatToParts(1234567890123.5)
    const group = groupingParts.find((part) => part.type === 'group')?.value
    const hasWhitespaceGroup = Boolean(group && /^\s$/u.test(group))
    const fallbackDecimals: string[] = []
    if (decimal !== '.' && group !== '.') fallbackDecimals.push('.')
    if (decimal !== ',' && group !== ',') fallbackDecimals.push(',')

    const info: InternalMoneyLocaleInfo = {
        decimal,
        group,
        primaryGroupSize: 3,
        secondaryGroupSize: 3,
        digits,
        intlLocale,
        usesAsciiDigits,
        localizedDigits,
        singleUnitDigitMap,
        hasWhitespaceGroup,
        fallbackDecimals,
    }
    const integerGroupSizes: number[] = []
    for (let i = 0; i < groupingParts.length; i += 1) {
        const part = groupingParts[i]!
        if (part.type === 'integer') {
            integerGroupSizes.push(
                normalizeLocalizedDigits(part.value, info).length,
            )
        }
    }
    info.primaryGroupSize = integerGroupSizes.at(-1) ?? 3
    info.secondaryGroupSize = integerGroupSizes.at(-2) ?? info.primaryGroupSize

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
    const whitespaceNormalized = info.hasWhitespaceGroup
        ? value.replace(WHITESPACE_GROUP_REGEX, info.group!)
        : value
    const normalizedDigits = normalizeLocalizedDigits(
        whitespaceNormalized,
        info,
    )

    const hasLocaleDecimal = normalizedDigits.includes(info.decimal)
    let fallbackDecimal: string | undefined
    let fallbackCount = 0
    for (let i = 0; i < info.fallbackDecimals.length; i += 1) {
        const sep = info.fallbackDecimals[i]!
        if (normalizedDigits.includes(sep)) {
            fallbackDecimal = sep
            fallbackCount += 1
        }
    }

    if (fallbackCount > 1 || (hasLocaleDecimal && fallbackCount > 0)) {
        return { accepted: false, complete: false }
    }

    const decimal = hasLocaleDecimal ? info.decimal : fallbackDecimal
    let integerPart: string
    let fractionPart: string | undefined
    if (decimal) {
        const decIdx = normalizedDigits.indexOf(decimal)
        if (decIdx !== -1) {
            if (
                normalizedDigits.indexOf(decimal, decIdx + decimal.length) !==
                -1
            ) {
                return { accepted: false, complete: false }
            }
            integerPart = normalizedDigits.slice(0, decIdx)
            fractionPart = normalizedDigits.slice(decIdx + decimal.length)
        } else {
            integerPart = normalizedDigits
        }
    } else {
        integerPart = normalizedDigits
    }

    if (
        fractionPart !== undefined &&
        (!isDigitSequence(fractionPart) ||
            (info.group !== undefined && fractionPart.includes(info.group)))
    ) {
        return { accepted: false, complete: false }
    }

    const groupSep = info.group
    const normalizedGroups =
        groupSep && integerPart.includes(groupSep)
            ? integerPart.split(groupSep)
            : [integerPart]

    let completeInteger = false
    let acceptedIntegerPrefix = false

    if (normalizedGroups.length === 1) {
        const integer = normalizedGroups[0]!
        completeInteger = isDigitSequence(integer)
        acceptedIntegerPrefix = completeInteger
    } else {
        const len = normalizedGroups.length
        const first = normalizedGroups[0]!
        const last = normalizedGroups[len - 1]!
        const validFirst =
            isNonEmptyDigitSequence(first) &&
            first.length <= info.secondaryGroupSize
        let validMiddle = true
        for (let i = 1; i < len - 1; i += 1) {
            const part = normalizedGroups[i]!
            if (
                part.length !== info.secondaryGroupSize ||
                !isNonEmptyDigitSequence(part)
            ) {
                validMiddle = false
                break
            }
        }
        const lastIsDigits = isNonEmptyDigitSequence(last)
        const completedLastGroup =
            lastIsDigits && last.length === info.primaryGroupSize
        const partialLastGroup =
            lastIsDigits && last.length < info.primaryGroupSize
        const trailingGroupSeparator = last === ''
        const validPrefixTail =
            partialLastGroup ||
            (trailingGroupSeparator &&
                (len === 2 ||
                    normalizedGroups[len - 2]!.length ===
                        info.secondaryGroupSize))

        acceptedIntegerPrefix =
            validFirst && validMiddle && (completedLastGroup || validPrefixTail)
        completeInteger = validFirst && validMiddle && completedLastGroup
    }

    if (!acceptedIntegerPrefix) return { accepted: false, complete: false }

    const normalizedInteger =
        normalizedGroups.length === 1
            ? normalizedGroups[0]!
            : normalizedGroups.join('')
    const hasDigits =
        normalizedInteger.length > 0 ||
        (fractionPart !== undefined && fractionPart.length > 0)
    const complete = completeInteger && hasDigits

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
    const info = getMoneyLocaleInfo(locale)
    const { integerFormatter, defaultFractionDigits } = getCurrencyFormatEntry(
        info.intlLocale,
        currency,
    )
    const currencyParts = integerFormatter.formatToParts(BigInt(integer))
    const fraction = (fractionPart ?? '').padEnd(defaultFractionDigits, '0')

    if (!fraction) {
        let out = ''
        for (let i = 0; i < currencyParts.length; i += 1) {
            out += currencyParts[i]!.value
        }
        return out
    }

    let localizedFraction: string
    if (info.usesAsciiDigits) {
        localizedFraction = fraction
    } else {
        localizedFraction = ''
        for (let i = 0; i < fraction.length; i += 1) {
            localizedFraction +=
                info.localizedDigits[fraction.charCodeAt(i) - 48]!
        }
    }

    let lastNumberPartIndex = -1
    for (let i = currencyParts.length - 1; i >= 0; i -= 1) {
        const t = currencyParts[i]!.type
        if (t === 'integer' || t === 'group') {
            lastNumberPartIndex = i
            break
        }
    }

    let out = ''
    for (let i = 0; i < currencyParts.length; i += 1) {
        out += currencyParts[i]!.value
        if (i === lastNumberPartIndex) {
            out += info.decimal + localizedFraction
        }
    }
    if (lastNumberPartIndex === -1) {
        out = info.decimal + localizedFraction + out
    }
    return out
}
