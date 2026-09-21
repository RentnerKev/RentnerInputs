import { inputMessageCatalog } from '../Config/messages.js'
import type { InputMessages } from '../Config/messages.js'

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
) {
    return value && !/^[0-9.,]*$/.test(value)
        ? messages.onlyMoneyCharacters
        : null
}

export function acceptsMoney(value: string) {
    return value === '' || /^[0-9.,]*$/.test(value)
}

export function acceptsQuantity(value: string) {
    return value === '' || /^[0-9]*$/.test(value)
}
