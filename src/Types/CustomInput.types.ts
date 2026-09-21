import type { ChangeEventHandler, InputHTMLAttributes, Ref } from 'react'
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
        Omit<InputVisualProps, 'triggerRef'>,
        NumericValueProps {
    value: string
    onChange: ChangeEventHandler<CustomInputElement>
    type?: CustomInputType
    triggerRef?: InputVisualProps['triggerRef'] | Ref<HTMLButtonElement>
    rows?: number
    wrap?: 'hard' | 'soft' | 'off'
    currency?: string
    suffix?: string
    showPasswordStrength?: boolean
    minuteStep?: number
}
