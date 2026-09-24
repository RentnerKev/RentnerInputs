import type { ReactNode, Ref } from 'react'
import type { InputLocale, InputMessages } from '../Config/messages.js'
import type { CustomDesign } from './InputShared.types.js'
import type { InputValidationMode } from '../InputProvider.js'

export interface OtpInputProps {
    id?: string
    name?: string
    value: ReadonlyArray<string>
    onValueChange: (value: Array<string>) => void
    onComplete?: (value: string) => void
    length?: number
    label?: ReactNode
    description?: ReactNode
    error?: string | null
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    autoFocus?: boolean
    className?: string
    inputClassName?: string
    customDesign?: CustomDesign
    locale?: InputLocale
    messages?: Partial<InputMessages>
    validationMode?: InputValidationMode
    triggerRef?: Ref<HTMLInputElement>
    'aria-label'?: string
    'aria-labelledby'?: string
    'aria-describedby'?: string
}
