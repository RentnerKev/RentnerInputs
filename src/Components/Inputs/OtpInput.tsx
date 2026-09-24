import { forwardRef, useId } from 'react'
import type { Ref } from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import useOtpInputLogic from '../../Hooks/Inputs/useOtpInput.logic.js'
import { useInputDefaults } from '../../InputProvider.js'
import type { OtpInputProps } from '../../Types/OtpInput.types.js'
import { mergeAriaDescribedBy } from '../../Utils/fieldA11y.utils.js'

function assignRef(
    ref: Ref<HTMLInputElement> | undefined,
    value: HTMLInputElement | null,
) {
    if (typeof ref === 'function') ref(value)
    else if (ref) ref.current = value
}

export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
    function OtpInput(props, ref) {
        const {
            id,
            name,
            value,
            onValueChange,
            onComplete,
            length,
            label,
            description,
            error,
            required,
            disabled,
            readOnly,
            autoFocus,
            className,
            inputClassName,
            customDesign,
            triggerRef,
            locale,
            messages,
            validationMode,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            'aria-describedby': ariaDescribedBy,
        } = props
        const defaults = useInputDefaults()
        const design = {
            ...DESIGN_CONFIG,
            ...defaults.customDesign,
            ...customDesign,
        }
        const logic = useOtpInputLogic({
            value,
            onValueChange,
            onComplete,
            length,
            required,
            disabled,
            readOnly,
            error,
            locale,
            messages,
            validationMode,
        })
        const {
            digits,
            code,
            digitCount,
            messages: resolvedMessages,
            resolvedError,
            hasError,
        } = logic.state
        const { validationInput, setDigitRef } = logic.ref
        const {
            handleInvalid,
            handleGroupBlur,
            handleDigitChange,
            handleDigitKeyDown,
            handleDigitPaste,
        } = logic.handler
        const generatedId = useId()
        const groupId = id ?? `otp-${generatedId}`
        const labelId = `${groupId}-label`
        const descriptionId = `${groupId}-description`
        const errorId = `${groupId}-error`
        const hasLabel =
            label !== undefined && label !== null && label !== false
        const hasDescription =
            description !== undefined &&
            description !== null &&
            description !== false
        const describedBy = mergeAriaDescribedBy(
            ariaDescribedBy,
            hasDescription ? descriptionId : undefined,
            hasError ? errorId : undefined,
        )
        const labelledBy = mergeAriaDescribedBy(
            ariaLabelledBy,
            hasLabel ? labelId : undefined,
        )

        return (
            <div className={`relative min-w-0 ${className ?? ''}`}>
                {hasLabel && (
                    <label
                        id={labelId}
                        htmlFor={`${groupId}-digit-1`}
                        className={`mb-2 block text-sm font-medium ${design.labelText}`}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={validationInput}
                    name={name}
                    value={code}
                    onChange={() => undefined}
                    onInvalid={handleInvalid}
                    required={
                        required &&
                        error === undefined &&
                        !disabled &&
                        !readOnly
                    }
                    disabled={disabled}
                    readOnly={readOnly}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="pointer-events-none absolute h-px w-px opacity-0"
                />
                <div
                    id={groupId}
                    role="group"
                    aria-label={
                        labelledBy
                            ? undefined
                            : (ariaLabel ?? resolvedMessages.otpCode)
                    }
                    aria-labelledby={labelledBy}
                    aria-describedby={describedBy}
                    aria-invalid={hasError || undefined}
                    aria-required={
                        (required && !disabled && error === undefined) ||
                        undefined
                    }
                    onBlurCapture={handleGroupBlur}
                    className="flex min-w-0 gap-2 sm:gap-3"
                >
                    {Array.from({ length: digitCount }, (_, index) => (
                        <input
                            key={index}
                            id={`${groupId}-digit-${index + 1}`}
                            ref={(element) => {
                                setDigitRef(index, element)
                                if (index === 0) {
                                    assignRef(ref, element)
                                    if (triggerRef !== ref)
                                        assignRef(triggerRef, element)
                                }
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete={index === 0 ? 'one-time-code' : 'off'}
                            maxLength={digitCount}
                            value={digits[index] ?? ''}
                            disabled={disabled}
                            readOnly={readOnly}
                            autoFocus={autoFocus && index === 0}
                            aria-label={resolvedMessages.otpDigit(
                                index + 1,
                                digitCount,
                            )}
                            aria-describedby={describedBy}
                            aria-invalid={hasError || undefined}
                            onChange={(event) =>
                                handleDigitChange(index, event.target.value)
                            }
                            onKeyDown={(event) =>
                                handleDigitKeyDown(index, event)
                            }
                            onPaste={(event) => handleDigitPaste(index, event)}
                            className={`h-14 w-12 min-w-0 flex-1 rounded-md border text-center text-2xl font-semibold outline-none transition-[border-color,box-shadow,color] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:h-16 sm:w-14 ${design.bg} ${design.text} ${
                                hasError
                                    ? `${design.errorBorder} ${design.errorText} ${design.errorRing}`
                                    : `${design.border} ${design.focusBorder} ${design.focusRing}`
                            } ${defaults.classNames?.otp ?? ''} ${inputClassName ?? ''}`}
                        />
                    ))}
                </div>
                {hasDescription && (
                    <p
                        id={descriptionId}
                        className="mt-1 text-xs text-secondary-text"
                    >
                        {description}
                    </p>
                )}
                {hasError && (
                    <p
                        id={errorId}
                        aria-live="polite"
                        className={`mt-1 text-xs ${design.errorText}`}
                    >
                        {resolvedError}
                    </p>
                )}
            </div>
        )
    },
)
