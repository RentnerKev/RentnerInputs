import { inputMessageCatalog } from '../Config/messages.js'
import type { InputLocale, InputMessages } from '../Config/messages.js'
import {
    acceptsMoney as acceptsLocalizedMoney,
    isCompleteMoneyValue,
} from './money.utils.js'

export type InputValidator = (value: string) => string | null

export function validateEmail(
    value: string,
    messages: InputMessages = inputMessageCatalog.de,
) {
    return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? messages.invalidEmail
        : null
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
