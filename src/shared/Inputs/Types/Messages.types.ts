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
    otpCode: string
    otpDigit: (position: number, count: number) => string
    otpIncomplete: (count: number) => string
    otpInvalid?: string
    otpVerified?: string
}
