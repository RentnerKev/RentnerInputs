import { AlertCircle } from 'lucide-react'
import { CustomTooltip } from '@rentnerkev/tooltips'
import {
    useId,
    type ChangeEventHandler,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import { useInputDefaults, useInputMessages } from '../../InputProvider.js'
import { mergeAriaDescribedBy } from '../../Utils/fieldA11y.utils.js'
import type {
    BaseInputProps,
    PasswordStrength,
} from '../../Types/InputShared.types.js'
import type { useInputFieldLogic } from '../../Hooks/Inputs/useInputField.logic.js'

type InputFieldLogic = ReturnType<typeof useInputFieldLogic<HTMLInputElement>>

interface InputFieldProps extends Omit<BaseInputProps, 'onChange'> {
    logic: InputFieldLogic
    inputType: InputHTMLAttributes<HTMLInputElement>['type']
    onChange?: ChangeEventHandler<HTMLInputElement>
    onValueChange?: (value: string) => void
    displayValue?: string
    rightControl?: ReactNode
    passwordStrength?: PasswordStrength
    showPasswordStrength?: boolean
}

export function InputField({
    logic,
    inputType,
    displayValue,
    rightControl,
    passwordStrength,
    showPasswordStrength,
    value: _value,
    onChange: _onChange,
    onValueChange: _onValueChange,
    onFocus: _onFocus,
    onBlur: _onBlur,
    onInvalid: _onInvalid,
    label,
    required: nativeRequired,
    icon,
    customDesign,
    description,
    error,
    triggerRef: _triggerRef,
    showLength,
    maxLength,
    minLength,
    locale,
    messages,
    validationMode: _validationMode,
    className,
    disabled,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    'aria-required': ariaRequired,
    ...nativeProps
}: InputFieldProps) {
    void [
        _value,
        _onChange,
        _onValueChange,
        _onFocus,
        _onBlur,
        _onInvalid,
        _triggerRef,
        _validationMode,
    ]
    const defaults = useInputDefaults()
    const resolvedMessages = useInputMessages(locale, messages)
    const generatedId = useId()
    const fieldId = nativeProps.id ?? generatedId
    const labelId = `${fieldId}-label`
    const descriptionId = `${fieldId}-description`
    const errorId = `${fieldId}-error`
    const hasDescription =
        description !== undefined &&
        description !== null &&
        description !== false
    const hasLabel = label !== undefined && label !== null && label !== false
    const hasVisibleError = logic.state.hasError && Boolean(logic.state.error)
    const describedBy = mergeAriaDescribedBy(
        ariaDescribedBy,
        hasDescription ? descriptionId : undefined,
        hasVisibleError ? errorId : undefined,
    )
    const labelledBy = mergeAriaDescribedBy(
        ariaLabelledBy,
        hasLabel ? labelId : undefined,
    )
    const design = {
        ...DESIGN_CONFIG,
        ...defaults.customDesign,
        ...customDesign,
    }
    const fieldClasses =
        className ?? defaults.classNames?.input ?? 'w-full py-3 rounded-xl'
    const hasLeftIcon = Boolean(icon || logic.state.hasError)
    const fieldClassName = `peer block ${hasLeftIcon ? 'pl-11' : 'pl-4'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-[background-color,border-color,box-shadow,color] ${fieldClasses} ${design.bg} border ${design.text} ${design.placeholder} ${
        logic.state.hasError
            ? `${design.errorBorder} focus:ring-2 ${design.errorRing}`
            : `${design.border} focus:ring-2 ${design.focusRing} ${design.focusBorder}`
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    const passwordStrengthBarClass =
        !passwordStrength || passwordStrength.score <= 1
            ? design.passwordStrengthWeak
            : passwordStrength.score === 2
              ? design.passwordStrengthFair
              : passwordStrength.score === 3
                ? design.passwordStrengthGood
                : design.passwordStrengthStrong

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
                        {logic.state.hasError ? (
                            <CustomTooltip
                                content={logic.state.error ?? ''}
                                side="bottom"
                            >
                                <AlertCircle
                                    className={`h-5 w-5 ${design.errorText}`}
                                />
                            </CustomTooltip>
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
                    ref={logic.ref.field}
                    type={inputType}
                    value={displayValue ?? logic.state.safeValue}
                    onChange={logic.handler.handleInputChange}
                    onFocus={logic.handler.handleFocus}
                    onBlur={logic.handler.handleBlur}
                    onInvalid={logic.handler.handleInvalid}
                    maxLength={maxLength}
                    minLength={minLength}
                    disabled={disabled}
                    required={error === undefined ? nativeRequired : undefined}
                    aria-describedby={describedBy}
                    aria-errormessage={
                        hasVisibleError ? errorId : ariaErrorMessage
                    }
                    aria-invalid={
                        logic.state.hasError || ariaInvalid || undefined
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
                        paddingRight: `${Math.max(logic.state.dynamicPaddingRight, rightControl ? 56 : 16)}px`,
                    }}
                    className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                />

                {rightControl}

                {(logic.state.effectiveShowLength || showLength) && (
                    <div
                        className={`pointer-events-none absolute bottom-0 right-0 z-10 rounded-br-xl rounded-tl-xl border p-1 text-[10px] font-medium uppercase tracking-wider transition-[background-color,border-color,color] ${design.counterBg} ${
                            logic.state.hasError
                                ? `${design.errorBorder} ${design.errorText} peer-focus:${design.errorBorder}`
                                : `${design.border} ${design.counterText} ${design.counterBorderFocus}`
                        }`}
                    >
                        {logic.state.counterText}
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
                    {logic.state.error}
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
