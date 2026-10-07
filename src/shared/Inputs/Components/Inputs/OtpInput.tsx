/* oxlint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/role-supports-aria-props, jsx-a11y/no-autofocus -- Preserve the composite OTP group error contract and explicitly opt-in autoFocus API; each digit independently exposes invalid state. */
import { forwardRef } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import useOtpInputLogic from '../../Hooks/Inputs/useOtpInput.logic.js'
import type { OtpInputProps } from '../../Types/OtpInput.types.js'

export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
    function OtpInput(props, ref) {
        const { state, handler, refs } = useOtpInputLogic(props, ref)
        const {
            name,
            label,
            description,
            error,
            animated,
            showProgress,
            feedbackClassNames,
            required,
            disabled,
            readOnly,
            autoFocus,
            className,
            inputClassName,
            ariaLabel,
            defaults,
            design,
            digits,
            code,
            digitCount,
            resolvedMessages,
            resolvedError,
            hasError,
            visualStatus,
            groupId,
            labelId,
            descriptionId,
            errorId,
            successId,
            isSuccess,
            focusClasses,
            idleClasses,
            filledClasses,
            errorClasses,
            successClasses,
            progressTrackClasses,
            progressFilledClasses,
            progressErrorClasses,
            progressSuccessClasses,
            hasLabel,
            hasDescription,
            describedBy,
            labelledBy,
        } = state
        const {
            handleInvalid,
            handleGroupBlur,
            handleDigitChange,
            handleDigitKeyDown,
            handleDigitPaste,
        } = handler
        const { validationInput, setDigitRef, firstDigitRef } = refs

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
                            ref={
                                index === 0
                                    ? firstDigitRef
                                    : (element) => setDigitRef(index, element)
                            }
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
