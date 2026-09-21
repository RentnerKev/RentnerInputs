import type { BaseInputProps, NumericValueProps } from './InputShared.types.js'

export interface NumberInputProps extends BaseInputProps, NumericValueProps {
    type?: 'number'
}
