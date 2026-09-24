import type { BaseInputProps, NumericValueProps } from './InputShared.types.js'

export interface QuantityInputProps extends BaseInputProps, NumericValueProps {
    type?: 'quantity'
    suffix?: string
    onValueChange?: (value: string) => void
}

export type QuantityInputValueProps = Omit<QuantityInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type QuantityInputComponentProps =
    | QuantityInputProps
    | QuantityInputValueProps
