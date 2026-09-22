export type InputLocale = 'de' | 'en' | 'es' | 'fr' | (string & {})

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

export const inputMessageCatalog: Record<
    'de' | 'en' | 'es' | 'fr',
    InputMessages
> = {
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
    es: {
        required: 'Este campo es obligatorio',
        minLength: (minLength) =>
            `Se requieren al menos ${minLength} caracteres`,
        invalidInput: 'Entrada no válida',
        invalidEmail: 'Dirección de correo no válida',
        invalidPhone: 'Número de teléfono no válido',
        onlyNumbers: 'Solo se permiten números',
        minValue: (minValue) => `El valor debe ser al menos ${minValue}`,
        maxValue: (maxValue) => `El valor debe ser como máximo ${maxValue}`,
        onlyMoneyCharacters: 'Solo números, puntos y comas',
        passwordStrength: 'Seguridad de la contraseña',
        passwordStrengthEmpty: 'Vacía',
        passwordStrengthVeryWeak: 'Muy débil',
        passwordStrengthWeak: 'Débil',
        passwordStrengthOkay: 'Aceptable',
        passwordStrengthStrong: 'Fuerte',
        passwordStrengthVeryStrong: 'Muy fuerte',
        showPassword: 'Mostrar contraseña',
        hidePassword: 'Ocultar contraseña',
        hourSelect: 'Seleccionar hora',
        hourPlaceholder: 'Hora',
        minuteSelect: 'Seleccionar minuto',
        minutePlaceholder: 'Minuto',
    },
    fr: {
        required: 'Ce champ est obligatoire',
        minLength: (minLength) =>
            `Au moins ${minLength} caractères sont requis`,
        invalidInput: 'Saisie non valide',
        invalidEmail: 'Adresse e-mail non valide',
        invalidPhone: 'Numéro de téléphone non valide',
        onlyNumbers: 'Chiffres uniquement',
        minValue: (minValue) => `La valeur doit être au moins ${minValue}`,
        maxValue: (maxValue) => `La valeur doit être au plus ${maxValue}`,
        onlyMoneyCharacters: 'Chiffres, points et virgules uniquement',
        passwordStrength: 'Force du mot de passe',
        passwordStrengthEmpty: 'Vide',
        passwordStrengthVeryWeak: 'Très faible',
        passwordStrengthWeak: 'Faible',
        passwordStrengthOkay: 'Correct',
        passwordStrengthStrong: 'Fort',
        passwordStrengthVeryStrong: 'Très fort',
        showPassword: 'Afficher le mot de passe',
        hidePassword: 'Masquer le mot de passe',
        hourSelect: 'Choisir une heure',
        hourPlaceholder: 'Heure',
        minuteSelect: 'Choisir une minute',
        minutePlaceholder: 'Minute',
    },
}

export function resolveInputMessages(
    locale: InputLocale = 'de',
    messages?: Partial<InputMessages>,
): InputMessages {
    const normalizedLocale = locale.toLowerCase().replace('_', '-')
    const language = normalizedLocale.split('-')[0]
    const messageLocale =
        language === 'en' || language === 'es' || language === 'fr'
            ? language
            : 'de'

    return {
        ...inputMessageCatalog[messageLocale],
        ...messages,
    }
}

export function resolveInputIntlLocale(locale: InputLocale = 'de') {
    if (locale === 'de') return 'de-DE'
    if (locale === 'en') return 'en-US'
    if (locale === 'es') return 'es-ES'
    if (locale === 'fr') return 'fr-FR'
    return locale
}
