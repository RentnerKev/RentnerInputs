import type { ChangeEventHandler, InputHTMLAttributes } from 'react'
import type {
    InputVisualProps,
    NumericValueProps,
} from './InputShared.types.js'

export type CustomInputType =
    | 'text'
    | 'number'
    | 'phone'
    | 'email'
    | 'money'
    | 'password'
    | 'quantity'
    | 'time'
    | 'textarea'

type CustomInputElement = HTMLInputElement | HTMLTextAreaElement
type ReplacedCustomAttributes = 'value' | 'defaultValue' | 'onChange' | 'type'

export interface CustomInputProps
    extends
        Omit<InputHTMLAttributes<CustomInputElement>, ReplacedCustomAttributes>,
        InputVisualProps,
        NumericValueProps {
    value: string
    onChange: ChangeEventHandler<CustomInputElement>
    type?: CustomInputType
    rows?: number
    wrap?: 'hard' | 'soft' | 'off'
    currency?: string
    suffix?: string
    showPasswordStrength?: boolean
    minuteStep?: number
}
