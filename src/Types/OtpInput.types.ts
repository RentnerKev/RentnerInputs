import type { ReactNode, Ref } from 'react'
import type { InputLocale, InputMessages } from '../Config/messages.js'
import type { CustomDesign } from './InputShared.types.js'
import type { InputValidationMode } from '../InputProvider.js'

export type OtpInputStatus = 'idle' | 'error' | 'success'

export interface OtpFeedbackClassNames {
    focus?: string
    filled?: string
    error?: string
    success?: string
    progressTrack?: string
    progressFilled?: string
    progressError?: string
    progressSuccess?: string
    errorAnimation?: string
    successAnimation?: string
    errorMessage?: string
    successMessage?: string
}

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
    status?: OtpInputStatus
    animated?: boolean
    showProgress?: boolean
    feedbackClassNames?: OtpFeedbackClassNames
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
