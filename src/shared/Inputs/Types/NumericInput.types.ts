import type { BaseInputProps } from './InputShared.types.ts'
export interface NumericInputProps extends Omit<
    BaseInputProps,
    'value' | 'onChange'
> {
    value: number | null
    onValueChange: (value: number | null) => void
}
