import { describe, expect, test } from 'bun:test'
import {
    inputMessageCatalog,
    resolveInputIntlLocale,
    resolveInputMessages,
} from '../Config/messages.js'
import {
    validateEmail,
    validateNumber,
} from '../Utils/inputValidation.utils.js'
import { getPasswordStrength } from '../Utils/passwordStrength.utils.js'

describe('input locale messages', () => {
    test('keeps German defaults', () => {
        const messages = resolveInputMessages()

        expect(messages.required).toBe('Dieses Feld ist erforderlich')
        expect(messages.invalidEmail).toBe('Ungültige E-Mail-Adresse')
        expect(messages.minLength(3)).toBe('Mindestens 3 Zeichen erforderlich')
        expect(getPasswordStrength('', messages).label).toBe('Noch leer')
        expect(getPasswordStrength('abc', messages).label).toBe('Sehr schwach')
        expect(validateEmail('not-an-email', messages)).toBe(
            'Ungültige E-Mail-Adresse',
        )
        expect(validateNumber('1', 2, undefined, messages)).toBe(
            'Der Wert muss mindestens 2 sein',
        )
    })

    test('provides complete English defaults', () => {
        const messages = resolveInputMessages('en')

        expect(messages).toEqual(inputMessageCatalog.en)
        expect(messages.required).toBe('This field is required')
        expect(messages.invalidPhone).toBe('Invalid phone number')
        expect(messages.minLength(3)).toBe('At least 3 characters are required')
        expect(getPasswordStrength('', messages).label).toBe('Empty')
        expect(getPasswordStrength('abc', messages).label).toBe('Very weak')
        expect(validateNumber('1', 2, undefined, messages)).toBe(
            'The value must be at least 2',
        )
    })

    test('provides Spanish and French messages including locale variants', () => {
        expect(resolveInputMessages('es-ES').showPassword).toBe(
            'Mostrar contraseña',
        )
        expect(resolveInputMessages('fr-FR').hidePassword).toBe(
            'Masquer le mot de passe',
        )
        expect(resolveInputIntlLocale('es')).toBe('es-ES')
        expect(resolveInputIntlLocale('fr')).toBe('fr-FR')
    })

    test('merges partial overrides without losing locale defaults', () => {
        const messages = resolveInputMessages('en', {
            required: 'Please fill out this field',
            minLength: (minLength) => `Use at least ${minLength} letters`,
        })

        expect(messages.required).toBe('Please fill out this field')
        expect(messages.minLength(4)).toBe('Use at least 4 letters')
        expect(messages.invalidEmail).toBe('Invalid email address')
        expect(messages.passwordStrengthStrong).toBe('Strong')
    })

    test('keeps arbitrary Intl locales while using English messages for English variants', () => {
        const messages = resolveInputMessages('en-GB')

        expect(messages.required).toBe('This field is required')
        expect(resolveInputIntlLocale('en-GB')).toBe('en-GB')
        expect(resolveInputIntlLocale('de-DE')).toBe('de-DE')
        expect(resolveInputMessages('en_GB').invalidPhone).toBe(
            'Invalid phone number',
        )
    })
})
