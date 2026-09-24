import { useEffect, useRef, useState } from 'react'
import type {
    ClipboardEvent,
    FocusEvent,
    InvalidEvent,
    KeyboardEvent,
} from 'react'
import { useInputDefaults, useInputMessages } from '../../InputProvider.js'
import type { OtpInputProps } from '../../Types/OtpInput.types.js'

type OtpLogicOptions = Pick<
    OtpInputProps,
    | 'value'
    | 'onValueChange'
    | 'onComplete'
    | 'length'
    | 'required'
    | 'disabled'
    | 'readOnly'
    | 'error'
    | 'status'
    | 'locale'
    | 'messages'
    | 'validationMode'
>

export default function useOtpInputLogic({
    value,
    onValueChange,
    onComplete,
    length = 6,
    required = false,
    disabled = false,
    readOnly = false,
    error: externalError,
    status = 'idle',
    locale,
    messages: providedMessages,
    validationMode,
}: OtpLogicOptions) {
    const defaults = useInputDefaults()
    const messages = useInputMessages(locale, providedMessages)
    const resolvedValidationMode =
        validationMode ?? defaults.validationMode ?? 'built-in'
    const digitCount = Number.isInteger(length) && length > 0 ? length : 6
    const digits = Array.from(
        { length: digitCount },
        (_, index) => value[index]?.replace(/\D/g, '').slice(-1) ?? '',
    )
    const code = digits.join('')
    const [isTouched, setIsTouched] = useState(false)
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])
    const validationInputRef = useRef<HTMLInputElement>(null)
    const internalError =
        resolvedValidationMode === 'built-in' &&
        required &&
        digits.some((digit) => !digit)
            ? messages.otpIncomplete(digitCount)
            : null
    const resolvedError =
        externalError != null
            ? externalError
            : status === 'error'
              ? messages.otpInvalid
              : externalError === null
                ? null
                : internalError
    const hasError =
        Boolean(resolvedError) &&
        (externalError !== undefined || status === 'error' || isTouched)
    const visualStatus = hasError
        ? 'error'
        : status === 'success' && digits.every(Boolean)
          ? 'success'
          : 'idle'

    useEffect(() => {
        validationInputRef.current?.setCustomValidity(
            disabled || readOnly ? '' : (resolvedError ?? ''),
        )
    }, [disabled, readOnly, resolvedError])

    function setDigitRef(index: number, element: HTMLInputElement | null) {
        inputRefs.current[index] = element
    }

    function commitValue(nextDigits: Array<string>, focusIndex: number) {
        if (nextDigits.some((digit, index) => digit !== digits[index])) {
            onValueChange(nextDigits)
            if (nextDigits.every(Boolean)) onComplete?.(nextDigits.join(''))
        }
        inputRefs.current[Math.min(focusIndex, digitCount - 1)]?.focus()
    }

    function handleDigitChange(index: number, rawValue: string) {
        if (disabled || readOnly) return
        const enteredDigits = rawValue.replace(/\D/g, '')
        if (!enteredDigits && rawValue) return
        if (enteredDigits.length >= digitCount) {
            commitValue(
                Array.from(
                    { length: digitCount },
                    (_, position) => enteredDigits[position] ?? '',
                ),
                digitCount - 1,
            )
            return
        }
        const nextDigits = [...digits]
        nextDigits[index] = enteredDigits.slice(-1)
        commitValue(nextDigits, enteredDigits ? index + 1 : index)
    }

    function handleDigitKeyDown(
        index: number,
        event: KeyboardEvent<HTMLInputElement>,
    ) {
        if (disabled || readOnly) return
        if (event.key === 'Backspace' && !digits[index] && index > 0) {
            event.preventDefault()
            inputRefs.current[index - 1]?.focus()
        } else if (event.key === 'ArrowLeft' && index > 0) {
            event.preventDefault()
            inputRefs.current[index - 1]?.focus()
        } else if (event.key === 'ArrowRight' && index < digitCount - 1) {
            event.preventDefault()
            inputRefs.current[index + 1]?.focus()
        }
    }

    function handleDigitPaste(
        index: number,
        event: ClipboardEvent<HTMLInputElement>,
    ) {
        if (disabled || readOnly) return
        event.preventDefault()
        const pastedDigits = event.clipboardData
            .getData('text')
            .replace(/\D/g, '')
        if (!pastedDigits) return
        const position = pastedDigits.length >= digitCount ? 0 : index
        const nextDigits =
            pastedDigits.length >= digitCount
                ? Array<string>(digitCount).fill('')
                : [...digits]
        for (
            let offset = 0;
            offset < pastedDigits.length && position + offset < digitCount;
            offset++
        ) {
            nextDigits[position + offset] = pastedDigits[offset]
        }
        commitValue(nextDigits, position + pastedDigits.length)
    }

    function handleGroupBlur(event: FocusEvent<HTMLDivElement>) {
        if (!event.currentTarget.contains(event.relatedTarget))
            setIsTouched(true)
    }

    function handleInvalid(event: InvalidEvent<HTMLInputElement>) {
        event.preventDefault()
        setIsTouched(true)
        const firstEmpty = digits.findIndex((digit) => !digit)
        inputRefs.current[firstEmpty >= 0 ? firstEmpty : 0]?.focus()
    }

    return {
        ref: { setDigitRef, validationInput: validationInputRef },
        state: {
            digits,
            code,
            digitCount,
            messages,
            resolvedError,
            hasError,
            visualStatus,
        },
        handler: {
            handleDigitChange,
            handleDigitKeyDown,
            handleDigitPaste,
            handleGroupBlur,
            handleInvalid,
        },
        setter: { setIsTouched },
    }
}
