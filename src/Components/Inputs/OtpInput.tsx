import { forwardRef, useId } from 'react'
import type { Ref } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
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
            status,
            animated = true,
            showProgress = true,
            feedbackClassNames,
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
            status,
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
            visualStatus,
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
        const successId = `${groupId}-success`
        const isSuccess = visualStatus === 'success'
        const focusClasses =
            feedbackClassNames?.focus ??
            (animated
                ? 'motion-safe:focus:-translate-y-1 motion-safe:focus:scale-[1.04] focus:shadow-lg'
                : 'focus:shadow-lg')
        const idleClasses = `${design.bg} ${design.text} ${design.border} ${design.focusBorder} ${design.focusRing} focus:shadow-primary/20`
        const filledClasses =
            feedbackClassNames?.filled ??
            `${design.bg} border-primary/60 text-primary ${design.focusBorder} ${design.focusRing} shadow-sm shadow-primary/10 focus:shadow-primary/25`
        const errorClasses =
            feedbackClassNames?.error ??
            `bg-red-500/10 ${design.errorBorder} ${design.errorText} ${design.errorRing} focus:shadow-red-500/20`
        const successClasses =
            feedbackClassNames?.success ??
            'border-emerald-400 bg-emerald-400/10 text-emerald-200 focus:ring-emerald-400/50 shadow-sm shadow-emerald-400/20 focus:shadow-emerald-400/25'
        const progressTrackClasses =
            feedbackClassNames?.progressTrack ?? 'bg-border-dark'
        const progressFilledClasses =
            feedbackClassNames?.progressFilled ??
            'bg-primary shadow-sm shadow-primary/40'
        const progressErrorClasses =
            feedbackClassNames?.progressError ?? 'bg-red-500'
        const progressSuccessClasses =
            feedbackClassNames?.progressSuccess ?? 'bg-emerald-400'
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
            isSuccess ? successId : undefined,
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
                    data-otp-status={visualStatus}
                    onBlurCapture={handleGroupBlur}
                    className={`flex min-w-0 gap-2 sm:gap-3 ${
                        animated && hasError
                            ? (feedbackClassNames?.errorAnimation ??
                              'motion-safe:animate-otp-shake')
                            : ''
                    }`}
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
                            data-otp-filled={Boolean(digits[index])}
                            className={`h-14 w-12 min-w-0 flex-1 rounded-xl border text-center text-2xl font-semibold outline-none focus:z-10 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:w-14 ${
                                animated
                                    ? 'motion-safe:transition-[transform,border-color,box-shadow,background-color,color] motion-safe:duration-200 motion-safe:ease-out'
                                    : ''
                            } ${focusClasses} ${
                                hasError
                                    ? errorClasses
                                    : isSuccess
                                      ? successClasses
                                      : digits[index]
                                        ? filledClasses
                                        : idleClasses
                            } ${
                                animated && isSuccess
                                    ? (feedbackClassNames?.successAnimation ??
                                      'motion-safe:animate-otp-confirm')
                                    : ''
                            } ${defaults.classNames?.otp ?? ''} ${inputClassName ?? ''}`}
                        />
                    ))}
                </div>
                {showProgress && (
                    <div
                        aria-hidden="true"
                        data-otp-progress=""
                        className="mt-2 flex min-w-0 gap-2 sm:gap-3"
                    >
                        {digits.map((digit, index) => (
                            <span
                                key={`${groupId}-progress-${index + 1}`}
                                className={`h-1 min-w-0 flex-1 rounded-full ${
                                    animated
                                        ? 'motion-safe:transition-[background-color,box-shadow,transform] motion-safe:duration-300'
                                        : ''
                                } ${
                                    !digit
                                        ? progressTrackClasses
                                        : hasError
                                          ? progressErrorClasses
                                          : isSuccess
                                            ? progressSuccessClasses
                                            : progressFilledClasses
                                }`}
                            />
                        ))}
                    </div>
                )}
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
                        className={`mt-2 flex items-center gap-1.5 text-xs ${feedbackClassNames?.errorMessage ?? design.errorText}`}
                    >
                        <CircleAlert aria-hidden="true" className="size-3.5" />
                        {resolvedError}
                    </p>
                )}
                {isSuccess && (
                    <p
                        id={successId}
                        role="status"
                        className={`mt-2 flex items-center gap-1.5 text-xs ${feedbackClassNames?.successMessage ?? 'text-emerald-300'}`}
                    >
                        <CircleCheck aria-hidden="true" className="size-3.5" />
                        {resolvedMessages.otpVerified}
                    </p>
                )}
            </div>
        )
    },
)
