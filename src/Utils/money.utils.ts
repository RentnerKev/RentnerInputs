import { resolveInputIntlLocale } from '../Config/messages.js'
import type { InputLocale } from '../Config/messages.js'

export function parseMoneyValue(value: string, locale: InputLocale = 'de') {
    const parts = new Intl.NumberFormat(
        resolveInputIntlLocale(locale),
    ).formatToParts(1234.5)
    const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
    const group = parts.find((part) => part.type === 'group')?.value
    const segments = value.split(decimal)
    if (segments.length > 2) return undefined

    const [integer, fraction] = segments
    const integerGroups = group ? integer.split(group) : [integer]
    const validInteger =
        integerGroups.length === 1
            ? /^\d+$/.test(integer)
            : /^\d{1,3}$/.test(integerGroups[0]) &&
              integerGroups.slice(1).every((part) => /^\d{3}$/.test(part))
    if (!validInteger || (fraction !== undefined && !/^\d*$/.test(fraction))) {
        return undefined
    }

    const normalized = `${integerGroups.join('')}${
        fraction === undefined ? '' : `.${fraction}`
    }`

    const numericValue = Number(normalized)
    return Number.isFinite(numericValue) ? numericValue : undefined
}

export function formatMoneyValue(
    value: string,
    currency: string,
    locale: InputLocale = 'de',
) {
    if (parseMoneyValue(value, locale) === undefined) return undefined

    const intlLocale = resolveInputIntlLocale(locale)
    const numberParts = new Intl.NumberFormat(intlLocale).formatToParts(1234.5)
    const decimal =
        numberParts.find((part) => part.type === 'decimal')?.value ?? '.'
    const group = numberParts.find((part) => part.type === 'group')?.value
    const [integerPart = '', fractionPart] = value.split(decimal)
    const integer = group ? integerPart.split(group).join('') : integerPart

    const currencyFormatter = new Intl.NumberFormat(intlLocale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
    const currencyParts = currencyFormatter.formatToParts(BigInt(integer))
    const defaultFractionDigits =
        new Intl.NumberFormat(intlLocale, {
            style: 'currency',
            currency,
        }).resolvedOptions().minimumFractionDigits ?? 2
    const fraction = (fractionPart ?? '').padEnd(defaultFractionDigits, '0')

    if (fraction) {
        const decimalIndex = numberParts.findIndex(
            (part) => part.type === 'decimal',
        )
        const decimalSeparator =
            decimalIndex < 0 ? '.' : numberParts[decimalIndex].value
        const digitFormatter = new Intl.NumberFormat(intlLocale, {
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
            { type: 'decimal', value: decimalSeparator },
            { type: 'fraction', value: localizedFraction },
        )
    }

    return currencyParts.map((part) => part.value).join('')
}
