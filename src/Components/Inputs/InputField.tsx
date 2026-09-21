import { AlertCircle } from 'lucide-react'
import { CustomTooltip } from '../../Internal/Tooltip.js'
import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import type {
    BaseInputProps,
    PasswordStrength,
} from '../../Types/InputShared.types.js'
import type { useInputFieldLogic } from '../../Hooks/Inputs/useInputField.logic.js'

type InputFieldLogic = ReturnType<typeof useInputFieldLogic<HTMLInputElement>>

interface InputFieldProps extends BaseInputProps {
    logic: InputFieldLogic
    inputType: InputHTMLAttributes<HTMLInputElement>['type']
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
    onFocus: _onFocus,
    onBlur: _onBlur,
    onInvalid: _onInvalid,
    label,
    icon,
    customDesign,
    showLength,
    maxLength,
    minLength,
    className = 'w-full py-3 rounded-xl',
    disabled,
    ...nativeProps
}: InputFieldProps) {
    void [_value, _onChange, _onFocus, _onBlur, _onInvalid]
    const generatedId = useId()
    const fieldId = nativeProps.id ?? generatedId
    const design = { ...DESIGN_CONFIG, ...customDesign }
    const hasLeftIcon = Boolean(icon || logic.state.hasError)
    const fieldClassName = `peer block ${hasLeftIcon ? 'pl-11' : 'pl-4'} focus:outline-none transition-all ${className} ${design.bg} border ${design.text} ${design.placeholder} ${
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
        <div className="group w-full">
            {label && (
                <label
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
                    aria-invalid={logic.state.hasError || undefined}
                    style={{
                        ...nativeProps.style,
                        paddingRight: `${logic.state.dynamicPaddingRight}px`,
                    }}
                    className={`${fieldClassName} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                />

                {rightControl}

                {(logic.state.effectiveShowLength || showLength) && (
                    <div
                        className={`pointer-events-none absolute bottom-0 right-0 z-10 rounded-br-xl rounded-tl-xl border p-1 text-[10px] font-medium uppercase tracking-wider transition-all ${design.counterBg} ${
                            logic.state.hasError
                                ? `${design.errorBorder} ${design.errorText} peer-focus:${design.errorBorder}`
                                : `${design.border} ${design.counterText} ${design.counterBorderFocus}`
                        }`}
                    >
                        {logic.state.counterText}
                    </div>
                )}
            </div>

            {showPasswordStrength && passwordStrength && (
                <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                        <span className={design.passwordStrengthText}>
                            Passwortstärke
                        </span>
                        <span className={design.passwordStrengthText}>
                            {passwordStrength.label}
                        </span>
                    </div>
                    <div
                        className={`h-2 w-full overflow-hidden rounded-full ${design.passwordStrengthTrack}`}
                    >
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${passwordStrengthBarClass}`}
                            style={{ width: `${passwordStrength.percentage}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
