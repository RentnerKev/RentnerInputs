export type InputValidator = (value: string) => string | null

export function validateEmail(value: string) {
    return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? 'Ungültige E-Mail-Adresse'
        : null
}

export function validatePhone(value: string) {
    return value && !/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(value)
        ? 'Ungültige Telefonnummer'
        : null
}

export function validateNumber(
    value: string,
    minValue?: number,
    maxValue?: number,
) {
    if (value && Number.isNaN(Number(value))) return 'Nur Zahlen erlaubt'
    if (value && minValue !== undefined && Number(value) < minValue) {
        return `Der Wert muss mindestens ${minValue} sein`
    }
    if (value && maxValue !== undefined && Number(value) > maxValue) {
        return `Der Wert darf maximal ${maxValue} sein`
    }
    return null
}

export function validateMoney(value: string) {
    return value && !/^[0-9.,]*$/.test(value)
        ? 'Nur Zahlen, Punkt und Komma erlaubt'
        : null
}

export function acceptsMoney(value: string) {
    return value === '' || /^[0-9.,]*$/.test(value)
}

export function acceptsQuantity(value: string) {
    return value === '' || /^[0-9]*$/.test(value)
}
