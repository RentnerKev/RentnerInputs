import { useEffect, useRef, useState } from 'react'
import type {
    ChangeEvent,
    ChangeEventHandler,
    FocusEvent,
    FocusEventHandler,
    FormEventHandler,
    InvalidEvent,
    Ref,
} from 'react'
import type { InputValidator } from '../../Utils/inputValidation.utils.js'

type InputElement = HTMLInputElement | HTMLTextAreaElement

export interface UseInputFieldLogicOptions<Element extends InputElement> {
    value: string
    onChange: ChangeEventHandler<Element>
    onFocus?: FocusEventHandler<Element>
    onBlur?: FocusEventHandler<Element>
    onInvalid?: FormEventHandler<Element>
    forwardedRef?: Ref<Element>
    required?: boolean
    minLength?: number
    maxLength?: number
    showLength?: boolean
    validate?: InputValidator
    acceptsValue?: (value: string) => boolean
    selectZeroOnFocus?: boolean
}

function assignRef<Element>(
    ref: Ref<Element> | undefined,
    value: Element | null,
) {
    if (typeof ref === 'function') ref(value)
    else if (ref) ref.current = value
}

export function useInputFieldLogic<Element extends InputElement>({
    value,
    onChange,
    onFocus,
    onBlur,
    onInvalid,
    forwardedRef,
    required,
    minLength,
    maxLength,
    showLength,
    validate,
    acceptsValue,
    selectZeroOnFocus,
}: UseInputFieldLogicOptions<Element>) {
    const safeValue = value === null || value === undefined ? '' : String(value)
    const [isTouched, setIsTouched] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [nativeError, setNativeError] = useState<string | null>(null)
    const inputRef = useRef<Element | null>(null)
    const lastValueRef = useRef(safeValue)
    const valueChangedByInputRef = useRef(false)

    function validateValue(nextValue: string) {
        if (required && !nextValue) return 'Dieses Feld ist erforderlich'
        if (minLength && nextValue && nextValue.length < minLength) {
            return `Mindestens ${minLength} Zeichen erforderlich`
        }
        return validate?.(nextValue) ?? null
    }

    const validationError = validateValue(safeValue)
    const currentError = validationError ?? nativeError
    const hasError = isTouched && currentError !== null
    const counterText = maxLength
        ? `${safeValue.length} / ${maxLength}`
        : `${safeValue.length}`
    const dynamicPaddingRight = showLength ? counterText.length * 8 + 24 : 16

    useEffect(() => {
        inputRef.current?.setCustomValidity(validationError ?? '')
    }, [validationError])

    useEffect(() => {
        const input = inputRef.current
        const form = input?.form
        if (!input || !form) return

        function handleFormSubmit() {
            if (input?.validity.valid) setIsTouched(false)
        }

        form.addEventListener('submit', handleFormSubmit)
        return () => form.removeEventListener('submit', handleFormSubmit)
    }, [])

    useEffect(() => {
        const wasClearedExternally =
            lastValueRef.current !== '' &&
            safeValue === '' &&
            !valueChangedByInputRef.current
        if (wasClearedExternally) {
            setIsTouched(false)
            setNativeError(null)
        }
        valueChangedByInputRef.current = false
        lastValueRef.current = safeValue
    }, [safeValue])

    function setFieldRef(element: Element | null) {
        inputRef.current = element
        assignRef(forwardedRef, element)
    }

    function handleFocus(event: FocusEvent<Element>) {
        setIsFocused(true)
        if (
            selectZeroOnFocus &&
            (safeValue === '0' || safeValue === '0.00' || safeValue === '0,00')
        ) {
            event.currentTarget.select()
        }
        onFocus?.(event)
    }

    function handleBlur(event: FocusEvent<Element>) {
        setIsTouched(true)
        setIsFocused(false)
        onBlur?.(event)
    }

    function handleInputChange(event: ChangeEvent<Element>) {
        const nextValue = event.currentTarget.value
        if (maxLength && nextValue.length > maxLength) return
        if (acceptsValue && !acceptsValue(nextValue)) return

        setNativeError(null)
        if (validateValue(nextValue)) setIsTouched(true)
        valueChangedByInputRef.current = true
        onChange(event)
    }

    function handleInvalid(event: InvalidEvent<Element>) {
        event.preventDefault()
        setIsTouched(true)
        setNativeError(
            event.currentTarget.validationMessage || 'Ungültige Eingabe',
        )
        onInvalid?.(event)
    }

    return {
        ref: { field: setFieldRef },
        state: {
            safeValue,
            error: currentError,
            hasError,
            isFocused,
            effectiveShowLength: showLength === true,
            counterText,
            dynamicPaddingRight,
        },
        handler: {
            handleInputChange,
            handleFocus,
            handleBlur,
            handleInvalid,
        },
        setter: {
            setIsTouched,
            setIsFocused,
            setNativeError,
        },
    }
}
