export interface MoneyLocaleInfo {
    decimal: string
    group?: string
    primaryGroupSize: number
    secondaryGroupSize: number
    digits: Array<[localized: string, ascii: string]>
    intlLocale: string
}

export interface ParsedMoneyParts {
    integer: string
    fraction?: string
}

export interface MoneyInputParseResult {
    accepted: boolean
    complete: boolean
    parts?: ParsedMoneyParts
}
