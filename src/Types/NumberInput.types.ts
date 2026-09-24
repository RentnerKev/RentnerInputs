import type { BaseInputProps, NumericValueProps } from './InputShared.types.js'

export interface NumberInputProps extends BaseInputProps, NumericValueProps {
    type?: 'number'
    onValueChange?: (value: string) => void
}

export type NumberInputValueProps = Omit<NumberInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type NumberInputComponentProps = NumberInputProps | NumberInputValueProps
