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
import {
    resolveInputMessages,
    type InputLocale,
    type InputMessages,
} from '../../Config/messages.js'
import type { InputValidator } from '../../Utils/inputValidation.utils.js'
import { useInputDefaults } from '../../InputProvider.js'
import type { InputValidationMode } from '../../InputProvider.js'

type InputElement = HTMLInputElement | HTMLTextAreaElement

interface NativeErrorSnapshot {
    constraints: string
}

const nativeConstraintAttributes = [
    'type',
    'required',
    'min',
    'max',
    'step',
    'pattern',
    'minlength',
    'maxlength',
    'multiple',
    'title',
    'disabled',
    'readonly',
    'accept',
]

function getNativeConstraintSnapshot(input: InputElement) {
    return JSON.stringify({
        willValidate: input.willValidate,
        attributes: nativeConstraintAttributes.map((name) =>
            input.getAttribute(name),
        ),
    })
}

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
    onValueChange,
    onFocus,
    onBlur,
    onInvalid,
    forwardedRef,
    triggerRef,
    focusTarget,
    required,
    minLength,
    maxLength,
    showLength,
    validate,
    acceptsValue,
    selectZeroOnFocus,
    locale,
    messages,
    error: externalError,
    disabled = false,
    readOnly = false,
    validationMode,
}: UseInputFieldLogicOptions<Element>) {
    const defaults = useInputDefaults()
    const resolvedValidationMode =
        validationMode ?? defaults.validationMode ?? 'built-in'
    const safeValue = value === null || value === undefined ? '' : String(value)
    const resolvedMessages = resolveInputMessages(locale ?? defaults.locale, {
        ...defaults.messages,
        ...messages,
    })
    const [isTouched, setIsTouched] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [nativeError, setNativeError] = useState<string | null>(null)
    const inputRef = useRef<Element | null>(null)
    const lastValueRef = useRef(safeValue)
    const valueChangedByInputRef = useRef<string | null>(null)
    const nativeErrorSnapshotRef = useRef<NativeErrorSnapshot | null>(null)
    const validationOwnerRef = useRef({
        externalError,
        validationMode: resolvedValidationMode,
    })

    function validateValue(nextValue: string) {
        if (resolvedValidationMode === 'external') return null
        if (disabled || readOnly) return null
        if (required && !nextValue) return resolvedMessages.required
        if (minLength && nextValue && nextValue.length < minLength) {
            return resolvedMessages.minLength(minLength)
        }
        return validate?.(nextValue) ?? null
    }

    const validationError = validateValue(safeValue)
    const internalError =
        disabled || readOnly || resolvedValidationMode === 'external'
            ? null
            : (validationError ?? nativeError)
    const currentError =
        externalError !== undefined ? externalError : internalError
    const hasError =
        Boolean(currentError) && (externalError !== undefined || isTouched)
    const counterText = maxLength
        ? `${safeValue.length} / ${maxLength}`
        : `${safeValue.length}`
    const dynamicPaddingRight = showLength ? counterText.length * 8 + 24 : 16

    useEffect(() => {
        inputRef.current?.setCustomValidity(
            disabled || readOnly ? '' : (currentError ?? ''),
        )
    }, [currentError, disabled, readOnly])

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
        const valueChanged = lastValueRef.current !== safeValue
        const valueMatchedInput = valueChangedByInputRef.current === safeValue
        const wasClearedExternally =
            valueChanged &&
            lastValueRef.current !== '' &&
            safeValue === '' &&
            !valueMatchedInput
        if (wasClearedExternally) {
            setIsTouched(false)
        }
        if (valueChanged) {
            const input = inputRef.current
            const canReevaluateNativeError =
                nativeErrorSnapshotRef.current !== null &&
                input !== null &&
                externalError === undefined &&
                resolvedValidationMode !== 'external' &&
                !disabled &&
                !readOnly &&
                !input.disabled &&
                !input.readOnly
            let nextNativeError: string | null = null

            if (input && canReevaluateNativeError) {
                input.setCustomValidity('')
                if (!input.validity.valid) {
                    nextNativeError =
                        input.validationMessage || resolvedMessages.invalidInput
                }
            }

            nativeErrorSnapshotRef.current =
                input && nextNativeError
                    ? { constraints: getNativeConstraintSnapshot(input) }
                    : null
            if (input) {
                const currentValidityError =
                    externalError !== undefined
                        ? externalError
                        : disabled ||
                            readOnly ||
                            resolvedValidationMode === 'external'
                          ? null
                          : (validationError ?? nextNativeError)
                input.setCustomValidity(currentValidityError ?? '')
            }
            setNativeError(nextNativeError)
        }
        valueChangedByInputRef.current = null
        lastValueRef.current = safeValue
    }, [
        disabled,
        externalError,
        readOnly,
        resolvedMessages.invalidInput,
        resolvedValidationMode,
        safeValue,
        validationError,
    ])

    useEffect(() => {
        const ownerChanged =
            validationOwnerRef.current.externalError !== externalError ||
            validationOwnerRef.current.validationMode !== resolvedValidationMode
        if (ownerChanged) {
            nativeErrorSnapshotRef.current = null
            setNativeError(null)
        }
        validationOwnerRef.current = {
            externalError,
            validationMode: resolvedValidationMode,
        }
    }, [externalError, resolvedValidationMode])

    useEffect(() => {
        const input = inputRef.current
        if (
            !input ||
            !nativeError ||
            !nativeErrorSnapshotRef.current ||
            typeof MutationObserver === 'undefined'
        ) {
            return
        }

        const observer = new MutationObserver(() => {
            const snapshot = nativeErrorSnapshotRef.current
            if (!snapshot) return

            const constraints = getNativeConstraintSnapshot(input)
            if (snapshot.constraints === constraints) return
            if (
                externalError !== undefined ||
                resolvedValidationMode === 'external' ||
                disabled ||
                readOnly ||
                input.disabled ||
                input.readOnly
            ) {
                nativeErrorSnapshotRef.current = null
                setNativeError(null)
                return
            }

            input.setCustomValidity('')
            const nextNativeError = input.validity.valid
                ? null
                : input.validationMessage || resolvedMessages.invalidInput
            nativeErrorSnapshotRef.current = nextNativeError
                ? { constraints }
                : null
            input.setCustomValidity(validationError ?? nextNativeError ?? '')
            setNativeError(nextNativeError)
        })
        observer.observe(input, {
            attributes: true,
            attributeFilter: nativeConstraintAttributes,
        })
        return () => observer.disconnect()
    }, [
        disabled,
        externalError,
        nativeError,
        readOnly,
        resolvedMessages.invalidInput,
        resolvedValidationMode,
        validationError,
    ])

    function setFieldRef(element: Element | null) {
        inputRef.current = element
        assignRef(forwardedRef, element)
        if (forwardedRef !== triggerRef) {
            assignRef(triggerRef, element)
        }
    }

    function focusField() {
        const focusElement = focusTarget?.() ?? inputRef.current
        focusElement?.focus()
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
        if (disabled || readOnly) return
        const nextValue = event.currentTarget.value
        if (maxLength && nextValue.length > maxLength) return
        if (
            resolvedValidationMode === 'built-in' &&
            acceptsValue &&
            !acceptsValue(nextValue)
        )
            return

        nativeErrorSnapshotRef.current = null
        setNativeError(null)
        if (validateValue(nextValue)) setIsTouched(true)
        valueChangedByInputRef.current = nextValue
        onChange?.(event)
        onValueChange?.(nextValue)
    }

    function handleInvalid(event: InvalidEvent<Element>) {
        if (disabled || readOnly) return
        if (resolvedValidationMode === 'external') {
            onInvalid?.(event)
            return
        }
        event.preventDefault()
        setIsTouched(true)
        if (externalError !== undefined) {
            nativeErrorSnapshotRef.current = null
            setNativeError(null)
            focusField()
            onInvalid?.(event)
            return
        }
        nativeErrorSnapshotRef.current = {
            constraints: getNativeConstraintSnapshot(event.currentTarget),
        }
        setNativeError(
            event.currentTarget.validationMessage ||
                resolvedMessages.invalidInput,
        )
        focusField()
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
