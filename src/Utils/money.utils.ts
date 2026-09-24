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
