import { ErrorTooltip } from './ErrorTooltip.tsx'
import useInputFieldLogic from '../../Hooks/Inputs/useInputFieldLogic.ts'
import type { InputFieldProps } from '../../Types/InputField.types.ts'

export function InputField(props: InputFieldProps) {
    const {
        logic,
        inputType,
        displayValue,
        rightControl,
        passwordStrength,
        showPasswordStrength,
        label,
        nativeRequired,
        icon,
        description,
        error,
        showLength,
        maxLength,
        minLength,
        disabled,
        ariaErrorMessage,
        ariaInvalid,
        ariaRequired,
        nativeProps,
        resolvedMessages,
        fieldId,
        labelId,
        descriptionId,
        errorId,
        hasDescription,
        hasLabel,
        hasVisibleError,
        describedBy,
        labelledBy,
        design,
        hasLeftIcon,
        fieldClassName,
        passwordStrengthBarClass,
    } = useInputFieldLogic(props).state

    const {
        state: fieldState,
        handler,
        refs: { field: fieldRef },
    } = logic

    return (
        <div className="group min-w-0 w-full">
            {hasLabel && (
                <label
                    id={labelId}
                    htmlFor={fieldId}
                    className={`mb-2 block text-sm font-medium ${design.labelText}`}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {hasLeftIcon && (
                    <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                        {fieldState.hasError ? (
                            <ErrorTooltip
                                content={fieldState.error ?? ''}
                                className={`h-5 w-5 ${design.errorText}`}
                            />
                        ) : (
                            <span
                                className={`flex items-center ${design.iconColor} ${design.iconFocus} transition-colors [&>svg]:h-5 [&>svg]:w-5`}
                            >
                                {icon}
                            </span>
                        )}
                    </div>
                )}

                <input
                    {...nativeProps}
                    id={fieldId}
                    ref={fieldRef}
                    type={inputType}
                    value={displayValue ?? fieldState.safeValue}
                    onChange={handler.handleInputChange}
                    onFocus={handler.handleFocus}
                    onBlur={handler.handleBlur}
                    onInvalid={handler.handleInvalid}
                    maxLength={maxLength}
                    minLength={minLength}
                    disabled={disabled}
                    required={error === undefined ? nativeRequired : undefined}
                    aria-describedby={describedBy}
                    aria-errormessage={
                        hasVisibleError ? errorId : ariaErrorMessage
                    }
                    aria-invalid={
                        fieldState.hasError || ariaInvalid || undefined
                    }
                    aria-labelledby={labelledBy}
                    aria-required={
                        disabled
                            ? undefined
                            : error === undefined
                              ? nativeRequired || ariaRequired || undefined
                              : ariaRequired
                    }
                    style={{
                        paddingLeft: hasLeftIcon ? 44 : 16,
                        ...nativeProps.style,
                        paddingRight: `${Math.max(fieldState.dynamicPaddingRight, rightControl ? 56 : 16)}px`,
                    }}
                    className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                />

                {rightControl}

                {(fieldState.effectiveShowLength || showLength) && (
                    <div
                        className={`pointer-events-none absolute bottom-0 right-0 z-10 rounded-br-xl rounded-tl-xl border p-1 text-[10px] font-medium uppercase tracking-wider transition-[background-color,border-color,color] ${design.counterBg} ${
                            fieldState.hasError
                                ? `${design.errorBorder} ${design.errorText} peer-focus:${design.errorBorder}`
                                : `${design.border} ${design.counterText} ${design.counterBorderFocus}`
                        }`}
                    >
                        {fieldState.counterText}
                    </div>
                )}
            </div>

            {hasDescription && (
                <p
                    id={descriptionId}
                    className="mt-1 text-xs text-secondary-text"
                >
                    {description}
                </p>
            )}

            {hasVisibleError && (
                <p
                    id={errorId}
                    aria-live="polite"
                    className={`mt-1 text-xs ${design.errorText}`}
                >
                    {fieldState.error}
                </p>
            )}

            {showPasswordStrength && passwordStrength && (
                <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                        <span className={design.passwordStrengthText}>
                            {resolvedMessages.passwordStrength}
                        </span>
                        <span className={design.passwordStrengthText}>
                            {passwordStrength.label}
                        </span>
                    </div>
                    <div
                        className={`h-2 w-full overflow-hidden rounded-full ${design.passwordStrengthTrack}`}
                    >
                        <div
                            className={`h-full w-full origin-left rounded-full transition-transform duration-300 motion-reduce:transition-none ${passwordStrengthBarClass}`}
                            style={{
                                transform: `scaleX(${passwordStrength.percentage / 100})`,
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
