import { inputMessageCatalog } from './messages.ts'
import type {
    InputLocale,
    InputMessages,
} from '../../shared/Inputs/Types/Messages.types.ts'
import {
    acceptsMoney as acceptsLocalizedMoney,
    isCompleteMoneyValue,
} from './money.utils.ts'

const WHITESPACE_REGEX = /\s/

export function validateEmail(
    value: string,
    messages: InputMessages = inputMessageCatalog.de,
) {
    if (!value) return null
    const at = value.indexOf('@')
    if (at <= 0 || value.indexOf('@', at + 1) !== -1) {
        return messages.invalidEmail
    }
    const dot = value.indexOf('.', at + 2)
    // Same grammar as the former regexp: nonempty local part, exactly one @,
    // no ECMAScript whitespace, and a dot with characters on both domain sides.
    const valid =
        dot !== -1 && dot < value.length - 1 && !WHITESPACE_REGEX.test(value)
    return valid ? null : messages.invalidEmail
}

export function validatePhone(
    value: string,
    messages: InputMessages = inputMessageCatalog.de,
) {
    if (!value) return null
    const len = value.length
    let i = value.charCodeAt(0) === 43 ? 1 : 0
    if (i >= len) return messages.invalidPhone
    const first = value.charCodeAt(i)
    if (!((first >= 48 && first <= 57) || first === 40)) {
        return messages.invalidPhone
    }
    let hasDigit = false
    let depth = 0
    for (; i < len; i += 1) {
        const code = value.charCodeAt(i)
        if (code >= 48 && code <= 57) {
            hasDigit = true
        } else if (code === 40) {
            depth += 1
        } else if (code === 41) {
            if (depth === 0) return messages.invalidPhone
            depth -= 1
        } else if (
            code === 32 ||
            code === 45 ||
            code === 46 ||
            code === 47 ||
            code === 9 ||
            (code >= 10 && code <= 13) ||
            code === 160
        ) {
            continue
        } else if (code >= 128 && WHITESPACE_REGEX.test(value[i]!)) {
            continue
        } else {
            return messages.invalidPhone
        }
    }
    return hasDigit && depth === 0 ? null : messages.invalidPhone
}

export function validateNumber(
    value: string,
    minValue?: number,
    maxValue?: number,
    messages: InputMessages = inputMessageCatalog.de,
) {
    if (!value) return null
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) return messages.onlyNumbers
    if (minValue !== undefined && numericValue < minValue) {
        return messages.minValue(minValue)
    }
    if (maxValue !== undefined && numericValue > maxValue) {
        return messages.maxValue(maxValue)
    }
    return null
}

export function validateMoney(
    value: string,
    messages: InputMessages = inputMessageCatalog.de,
    locale: InputLocale = 'de',
) {
    return value && !isCompleteMoneyValue(value, locale)
        ? messages.onlyMoneyCharacters
        : null
}

export function acceptsMoney(value: string, locale: InputLocale = 'de') {
    return acceptsLocalizedMoney(value, locale)
}

export function acceptsQuantity(value: string) {
    for (let i = 0; i < value.length; i += 1) {
        const code = value.charCodeAt(i)
        if (code < 48 || code > 57) return false
    }
    return true
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
