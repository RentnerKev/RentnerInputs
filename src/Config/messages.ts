export type InputLocale = 'de' | 'en' | (string & {})

export interface InputMessages {
    required: string
    minLength: (minLength: number) => string
    invalidInput: string
    invalidEmail: string
    invalidPhone: string
    onlyNumbers: string
    minValue: (minValue: number) => string
    maxValue: (maxValue: number) => string
    onlyMoneyCharacters: string
    passwordStrength: string
    passwordStrengthEmpty: string
    passwordStrengthVeryWeak: string
    passwordStrengthWeak: string
    passwordStrengthOkay: string
    passwordStrengthStrong: string
    passwordStrengthVeryStrong: string
    showPassword: string
    hidePassword: string
    hourSelect: string
    hourPlaceholder: string
    minuteSelect: string
    minutePlaceholder: string
}

export const inputMessageCatalog: Record<'de' | 'en', InputMessages> = {
    de: {
        required: 'Dieses Feld ist erforderlich',
        minLength: (minLength) =>
            `Mindestens ${minLength} Zeichen erforderlich`,
        invalidInput: 'Ungültige Eingabe',
        invalidEmail: 'Ungültige E-Mail-Adresse',
        invalidPhone: 'Ungültige Telefonnummer',
        onlyNumbers: 'Nur Zahlen erlaubt',
        minValue: (minValue) => `Der Wert muss mindestens ${minValue} sein`,
        maxValue: (maxValue) => `Der Wert darf maximal ${maxValue} sein`,
        onlyMoneyCharacters: 'Nur Zahlen, Punkt und Komma erlaubt',
        passwordStrength: 'Passwortstärke',
        passwordStrengthEmpty: 'Noch leer',
        passwordStrengthVeryWeak: 'Sehr schwach',
        passwordStrengthWeak: 'Schwach',
        passwordStrengthOkay: 'Okay',
        passwordStrengthStrong: 'Stark',
        passwordStrengthVeryStrong: 'Sehr stark',
        showPassword: 'Passwort anzeigen',
        hidePassword: 'Passwort ausblenden',
        hourSelect: 'Stunde auswählen',
        hourPlaceholder: 'Stunde',
        minuteSelect: 'Minute auswählen',
        minutePlaceholder: 'Minute',
    },
    en: {
        required: 'This field is required',
        minLength: (minLength) =>
            `At least ${minLength} characters are required`,
        invalidInput: 'Invalid input',
        invalidEmail: 'Invalid email address',
        invalidPhone: 'Invalid phone number',
        onlyNumbers: 'Numbers only',
        minValue: (minValue) => `The value must be at least ${minValue}`,
        maxValue: (maxValue) => `The value must be at most ${maxValue}`,
        onlyMoneyCharacters: 'Numbers, periods, and commas only',
        passwordStrength: 'Password strength',
        passwordStrengthEmpty: 'Empty',
        passwordStrengthVeryWeak: 'Very weak',
        passwordStrengthWeak: 'Weak',
        passwordStrengthOkay: 'Okay',
        passwordStrengthStrong: 'Strong',
        passwordStrengthVeryStrong: 'Very strong',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        hourSelect: 'Select hour',
        hourPlaceholder: 'Hour',
        minuteSelect: 'Select minute',
        minutePlaceholder: 'Minute',
    },
}

export function resolveInputMessages(
    locale: InputLocale = 'de',
    messages?: Partial<InputMessages>,
): InputMessages {
    const normalizedLocale = locale.toLowerCase().replace('_', '-')
    const messageLocale =
        normalizedLocale === 'en' || normalizedLocale.startsWith('en-')
            ? 'en'
            : 'de'

    return {
        ...inputMessageCatalog[messageLocale],
        ...messages,
    }
}

export function resolveInputIntlLocale(locale: InputLocale = 'de') {
    if (locale === 'de') return 'de-DE'
    if (locale === 'en') return 'en-US'
    return locale
}
