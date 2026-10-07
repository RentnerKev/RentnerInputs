import type {
    ChangeEventHandler,
    FocusEventHandler,
    FormEventHandler,
    Ref,
    RefCallback,
    ChangeEvent,
    FocusEvent,
    InvalidEvent,
    Dispatch,
    SetStateAction,
} from 'react'
import type { InputLocale, InputMessages } from './Messages.types.js'
import type { InputValidationMode } from './InputProvider.types.js'
import type { InputValidator } from '../../../lib/Inputs/inputValidation.utils.js'

export type InputElement = HTMLInputElement | HTMLTextAreaElement

export interface UseInputFieldLogicOptions<Element extends InputElement> {
    value: string
    onChange?: ChangeEventHandler<Element>
    onValueChange?: (value: string) => void
    onFocus?: FocusEventHandler<Element>
    onBlur?: FocusEventHandler<Element>
    onInvalid?: FormEventHandler<Element>
    forwardedRef?: Ref<Element>
    triggerRef?: Ref<InputElement>
    focusTarget?: () => HTMLElement | null
    required?: boolean
    minLength?: number
    maxLength?: number
    showLength?: boolean
    validate?: InputValidator
    acceptsValue?: (value: string) => boolean
    selectZeroOnFocus?: boolean
    locale?: InputLocale
    messages?: Partial<InputMessages>
    error?: string | null
    disabled?: boolean
    readOnly?: boolean
    validationMode?: InputValidationMode
}

export interface InputFieldValidationResult<Element extends InputElement> {
    state: {
        safeValue: string
        error: string | null
        hasError: boolean
        isFocused: boolean
        effectiveShowLength: boolean
        counterText: string
        dynamicPaddingRight: number
    }
    handler: {
        handleInputChange: (event: ChangeEvent<Element>) => void
        handleFocus: (event: FocusEvent<Element>) => void
        handleBlur: (event: FocusEvent<Element>) => void
        handleInvalid: (event: InvalidEvent<Element>) => void
    }
    setter: {
        setIsTouched: Dispatch<SetStateAction<boolean>>
        setIsFocused: Dispatch<SetStateAction<boolean>>
        setNativeError: Dispatch<SetStateAction<string | null>>
    }
    refs: { field: RefCallback<InputElement> }
}
