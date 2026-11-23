import { inputMessageCatalog } from './messages.ts'
import type { InputMessages } from '../../shared/Inputs/Types/Messages.types.ts'
import type { PasswordStrength } from '../../shared/Inputs/Types/InputShared.types.ts'

const COMMON_PASSWORD_PATTERN =
    /password|passwort|123456|qwertz|qwerty|admin|letmein|welcome|iloveyou|monkey|dragon|football|baseball|superman|minecraft|pokemon|rentner|kevin/

const SEQUENCE_TRIGRAMS: Set<number> = /* @__PURE__ */ (() => {
    const patterns = [
        'abcdefghijklmnopqrstuvwxyz',
        'zyxwvutsrqponmlkjihgfedcba',
        '0123456789',
        '9876543210',
        'qwertzuiopüasdfghjklöäyxcvbnm',
        'mnbvcxyäölkjhgfdsapüoiuztrewq',
        'qwertyuiopasdfghjklzxcvbnm',
        'mnbvcxzlkjhgfdsapoiuytrewq',
    ]
    const set = new Set<number>()
    for (let p = 0; p < patterns.length; p += 1) {
        const seq = patterns[p]!
        for (let i = 0; i <= seq.length - 3; i += 1) {
            set.add(
                (seq.charCodeAt(i) << 16) |
                    (seq.charCodeAt(i + 1) << 8) |
                    seq.charCodeAt(i + 2),
            )
        }
    }
    return set
})()

function containsSequence(password: string) {
    const len = password.length
    if (len < 3) return false
    let c0 = password.charCodeAt(0)
    let c1 = password.charCodeAt(1)
    for (let i = 2; i < len; i += 1) {
        const c2 = password.charCodeAt(i)
        if (
            c0 < 256 &&
            c1 < 256 &&
            c2 < 256 &&
            SEQUENCE_TRIGRAMS.has((c0 << 16) | (c1 << 8) | c2)
        ) {
            return true
        }
        c0 = c1
        c1 = c2
    }
    return false
}

function isLineTerminator(code: number) {
    return code === 10 || code === 13 || code === 8232 || code === 8233
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
    let hasLowerCase = false
    let hasUpperCase = false
    let hasNumber = false
    let hasSpecialChar = false
    let m0 = 0
    let m1 = 0
    let m2 = 0
    let m3 = 0
    let uniqueCount = 0
    let extraUnique: Set<number> | undefined
    let repeatedPenalty = 0
    let runChar = -1
    let runLen = 0
    let hasSurrogate = false

    for (let i = 0; i < length; i += 1) {
        const code = normalizedPassword.charCodeAt(i)
        if (code >= 97 && code <= 122) hasLowerCase = true
        else if (code >= 65 && code <= 90) hasUpperCase = true
        else if (code >= 48 && code <= 57) hasNumber = true
        else hasSpecialChar = true

        if (code >= 0xd800 && code <= 0xdfff) {
            hasSurrogate = true
            const cp = normalizedPassword.codePointAt(i)!
            if (!extraUnique) extraUnique = new Set<number>()
            if (!extraUnique.has(cp)) {
                extraUnique.add(cp)
                uniqueCount += 1
            }
            if (cp > 0xffff) i += 1
            runChar = -1
            runLen = 0
            continue
        }

        if (code < 128) {
            const bit = 1 << (code & 31)
            const bucket = code >> 5
            if (bucket === 0) {
                if ((m0 & bit) === 0) {
                    m0 |= bit
                    uniqueCount += 1
                }
            } else if (bucket === 1) {
                if ((m1 & bit) === 0) {
                    m1 |= bit
                    uniqueCount += 1
                }
            } else if (bucket === 2) {
                if ((m2 & bit) === 0) {
                    m2 |= bit
                    uniqueCount += 1
                }
            } else if ((m3 & bit) === 0) {
                m3 |= bit
                uniqueCount += 1
            }
        } else {
            if (!extraUnique) extraUnique = new Set<number>()
            if (!extraUnique.has(code)) {
                extraUnique.add(code)
                uniqueCount += 1
            }
        }

        if (isLineTerminator(code)) {
            if (runLen >= 3) repeatedPenalty += runLen * 1.25
            runChar = -1
            runLen = 0
        } else if (code === runChar) {
            runLen += 1
        } else {
            if (runLen >= 3) repeatedPenalty += runLen * 1.25
            runChar = code
            runLen = 1
        }
    }
    if (runLen >= 3) repeatedPenalty += runLen * 1.25
    if (hasSurrogate) {
        repeatedPenalty = (normalizedPassword.match(/(.)\1{2,}/g) ?? []).reduce(
            (total, part) => total + part.length * 1.25,
            0,
        )
    }

    const charsetSize =
        (hasLowerCase ? 26 : 0) +
        (hasUpperCase ? 26 : 0) +
        (hasNumber ? 10 : 0) +
        (hasSpecialChar ? 33 : 0)
    const uniqueRatio = uniqueCount / length
    const uniquePenalty = uniqueRatio < 0.45 ? (0.45 - uniqueRatio) * 22 : 0
    const commonPenalty = COMMON_PASSWORD_PATTERN.test(lowerPassword) ? 35 : 0
    const varietyBonus =
        ((hasLowerCase ? 1 : 0) +
            (hasUpperCase ? 1 : 0) +
            (hasNumber ? 1 : 0) +
            (hasSpecialChar ? 1 : 0)) *
        3
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
    const onlyLetters =
        (hasLowerCase || hasUpperCase) && !hasNumber && !hasSpecialChar
    const onlyDigits =
        hasNumber && !hasLowerCase && !hasUpperCase && !hasSpecialChar
    const rawStrength =
        length * Math.log2(Math.max(charsetSize, 1)) +
        varietyBonus +
        lengthBonus -
        repeatedPenalty -
        uniquePenalty -
        (containsSequence(lowerPassword) ? 12 : 0) -
        commonPenalty -
        (onlyLetters ? 10 : 0) -
        (onlyDigits ? 25 : 0)
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
    const label =
        score === 4
            ? messages.passwordStrengthVeryStrong
            : score === 3
              ? messages.passwordStrengthStrong
              : score === 2
                ? messages.passwordStrengthOkay
                : score === 1
                  ? messages.passwordStrengthWeak
                  : messages.passwordStrengthVeryWeak

    return { score, percentage: score * 25, label }
}
