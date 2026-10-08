import { inputMessageCatalog } from './messages.ts'
import type {
    InputLocale,
    InputMessages,
} from '../../shared/Inputs/Types/Messages.types.ts'
import {
    acceptsMoney as acceptsLocalizedMoney,
    isCompleteMoneyValue,
} from './money.utils.ts'

export function validateEmail(
    value: string,
    messages: InputMessages = inputMessageCatalog.de,
) {
    if (!value) return null
    const at = value.indexOf('@')
    // Same grammar as the former regexp: nonempty local part, exactly one @,
    // no ECMAScript whitespace, and a dot with characters on both domain sides.
    const valid =
        at > 0 &&
        value.indexOf('@', at + 1) === -1 &&
        !/\s/.test(value) &&
        value.indexOf('.', at + 2) < value.length - 1 &&
        value.indexOf('.', at + 2) !== -1
    return valid ? null : messages.invalidEmail
}

export function validatePhone(
    value: string,
    messages: InputMessages = inputMessageCatalog.de,
) {
    return value && !/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(value)
        ? messages.invalidPhone
        : null
}

export function validateNumber(
    value: string,
    minValue?: number,
    maxValue?: number,
    messages: InputMessages = inputMessageCatalog.de,
) {
    if (value && Number.isNaN(Number(value))) return messages.onlyNumbers
    if (value && minValue !== undefined && Number(value) < minValue) {
        return messages.minValue(minValue)
    }
    if (value && maxValue !== undefined && Number(value) > maxValue) {
        return messages.maxValue(maxValue)
    }
    return null
}

export function validateMoney(
    value: string,
    messages: InputMessages = inputMessageCatalog.de,
    locale: InputLocale = 'de',
) {
    return value &&
        (!acceptsLocalizedMoney(value, locale) ||
            !isCompleteMoneyValue(value, locale))
        ? messages.onlyMoneyCharacters
        : null
}

export function acceptsMoney(value: string, locale: InputLocale = 'de') {
    return acceptsLocalizedMoney(value, locale)
}

export function acceptsQuantity(value: string) {
    return value === '' || /^[0-9]*$/.test(value)
}

export function resolveNumberBound(
    nativeBound: string | number | undefined,
    valueBound: number | undefined,
) {
    if (nativeBound === undefined) return valueBound
    if (nativeBound === '') return undefined
    const parsedBound = Number(nativeBound)
    return Number.isFinite(parsedBound) ? parsedBound : undefined
}
