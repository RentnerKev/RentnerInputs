import type {
    ChangeEventHandler,
    InputHTMLAttributes,
    Ref,
    ReactNode,
    TextareaHTMLAttributes,
} from 'react'
import type { InputLocale, InputMessages } from '../Config/messages.js'
import type { InputValidationMode } from '../InputProvider.js'

export interface CustomDesign {
    bg?: string
    border?: string
    text?: string
    labelText?: string
    placeholder?: string
    focusRing?: string
    focusBorder?: string
    errorBorder?: string
    errorRing?: string
    errorRingBase?: string
    errorText?: string
    iconColor?: string
    iconFocus?: string
    counterBg?: string
    counterText?: string
    counterBorderFocus?: string
    passwordStrengthTrack?: string
    passwordStrengthText?: string
    passwordStrengthWeak?: string
    passwordStrengthFair?: string
    passwordStrengthGood?: string
    passwordStrengthStrong?: string
}

export interface InputVisualProps {
    label?: ReactNode
    description?: ReactNode
    error?: string | null
    icon?: ReactNode
    customDesign?: CustomDesign
    showLength?: boolean
    locale?: InputLocale
    messages?: Partial<InputMessages>
    triggerRef?: Ref<HTMLInputElement | HTMLTextAreaElement>
    validationMode?: InputValidationMode
}

type ReplacedInputAttributes = 'value' | 'defaultValue' | 'onChange' | 'type'

export interface BaseInputProps
    extends
        Omit<InputHTMLAttributes<HTMLInputElement>, ReplacedInputAttributes>,
        InputVisualProps {
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
}

type ReplacedTextareaAttributes = 'value' | 'defaultValue' | 'onChange'

export interface BaseTextareaProps
    extends
        Omit<
            TextareaHTMLAttributes<HTMLTextAreaElement>,
            ReplacedTextareaAttributes
        >,
        InputVisualProps {
    value: string
    onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export interface NumericValueProps {
    minValue?: number
    maxValue?: number
}

export interface PasswordStrength {
    score: number
    percentage: number
    label: string
}
