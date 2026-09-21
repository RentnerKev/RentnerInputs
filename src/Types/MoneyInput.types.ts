import type { BaseInputProps } from './InputShared.types.js'

export interface MoneyInputProps extends BaseInputProps {
    type?: 'money'
    currency?: string
}
