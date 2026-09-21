import type { BaseInputProps, NumericValueProps } from './InputShared.types.js'

export interface QuantityInputProps extends BaseInputProps, NumericValueProps {
    type?: 'quantity'
    suffix?: string
}
