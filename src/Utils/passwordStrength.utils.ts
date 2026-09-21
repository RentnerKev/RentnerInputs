import { inputMessageCatalog, type InputMessages } from '../Config/messages.js'
import type { PasswordStrength } from '../Types/InputShared.types.js'

const COMMON_PASSWORDS = new Set([
    'password',
    'passwort',
    '123456',
    '12345678',
    '123456789',
    'qwertz',
    'qwerty',
    'admin',
    'letmein',
    'welcome',
    'iloveyou',
    'monkey',
    'dragon',
    'football',
    'baseball',
    'superman',
    'minecraft',
    'pokemon',
    'rentner',
    'kevin',
])

const SEQUENCE_PATTERNS = [
    'abcdefghijklmnopqrstuvwxyz',
    'zyxwvutsrqponmlkjihgfedcba',
    '0123456789',
    '9876543210',
    'qwertzuiopüasdfghjklöäyxcvbnm',
    'mnbvcxyäölkjhgfdsapüoiuztrewq',
    'qwertyuiopasdfghjklzxcvbnm',
    'mnbvcxzlkjhgfdsa poiuytrewq'.replace(/\s/g, ''),
]

function containsSequence(password: string) {
    return SEQUENCE_PATTERNS.some((sequence) => {
        for (let size = Math.min(password.length, 6); size >= 3; size -= 1) {
            for (let index = 0; index <= password.length - size; index += 1) {
                if (sequence.includes(password.slice(index, index + size)))
                    return true
            }
        }
        return false
    })
}

export function getPasswordStrength(
    password: string,
    messages: InputMessages = inputMessageCatalog.de,
): PasswordStrength {
    const normalizedPassword = password.trim()
    if (!normalizedPassword)
        return {
            score: 0,
            percentage: 0,
            label: messages.passwordStrengthEmpty,
        }

    const lowerPassword = normalizedPassword.toLowerCase()
    const length = normalizedPassword.length
    const hasLowerCase = /[a-z]/.test(normalizedPassword)
    const hasUpperCase = /[A-Z]/.test(normalizedPassword)
    const hasNumber = /\d/.test(normalizedPassword)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(normalizedPassword)
    const charsetSize =
        (hasLowerCase ? 26 : 0) +
        (hasUpperCase ? 26 : 0) +
        (hasNumber ? 10 : 0) +
        (hasSpecialChar ? 33 : 0)
    const repeatedPenalty = (
        normalizedPassword.match(/(.)\1{2,}/g) ?? []
    ).reduce((total, part) => total + part.length * 1.25, 0)
    const uniqueRatio = new Set(normalizedPassword).size / length
    const uniquePenalty = uniqueRatio < 0.45 ? (0.45 - uniqueRatio) * 22 : 0
    const commonPenalty =
        COMMON_PASSWORDS.has(lowerPassword) ||
        [...COMMON_PASSWORDS].some((commonPassword) =>
            lowerPassword.includes(commonPassword),
        )
            ? 35
            : 0
    const varietyBonus =
        [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean)
            .length * 3
    const lengthBonus =
        length >= 20
            ? 14
            : length >= 16
              ? 10
              : length >= 12
                ? 6
                : length >= 8
                  ? 2
                  : -18
    const rawStrength =
        length * Math.log2(Math.max(charsetSize, 1)) +
        varietyBonus +
        lengthBonus -
        repeatedPenalty -
        uniquePenalty -
        (containsSequence(lowerPassword) ? 12 : 0) -
        commonPenalty -
        (/^[a-zA-Z]+$/.test(normalizedPassword) ? 10 : 0) -
        (/^\d+$/.test(normalizedPassword) ? 25 : 0)
    const score =
        rawStrength >= 115
            ? 4
            : rawStrength >= 85
              ? 3
              : rawStrength >= 55
                ? 2
                : rawStrength >= 30
                  ? 1
                  : 0
    const labels = [
        messages.passwordStrengthVeryWeak,
        messages.passwordStrengthWeak,
        messages.passwordStrengthOkay,
        messages.passwordStrengthStrong,
        messages.passwordStrengthVeryStrong,
    ]

    return { score, percentage: score * 25, label: labels[score] ?? labels[0] }
}
