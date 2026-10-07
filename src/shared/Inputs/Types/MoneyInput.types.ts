import type { BaseInputProps } from './InputShared.types.js'

export interface MoneyInputProps extends BaseInputProps {
    type?: 'money'
    currency?: string
    onValueChange?: (value: string) => void
}

export type MoneyInputValueProps = Omit<MoneyInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type MoneyInputComponentProps = MoneyInputProps | MoneyInputValueProps
