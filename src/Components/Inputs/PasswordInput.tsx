import { Eye, EyeOff } from 'lucide-react'
import { forwardRef } from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import { useInputDefaults, useInputMessages } from '../../InputProvider.js'
import usePasswordInputLogic from '../../Hooks/Inputs/usePasswordInput.logic.js'
import type { PasswordInputComponentProps } from '../../Types/PasswordInput.types.js'
import { InputField } from './InputField.js'

export const PasswordInput = forwardRef<
    HTMLInputElement,
    PasswordInputComponentProps
>(function PasswordInput({ type: _type, showPasswordStrength, ...props }, ref) {
    void _type
    const defaults = useInputDefaults()
    const messages = useInputMessages(props.locale, props.messages)
    const originalProps = { ...props, showPasswordStrength }
    const logic = usePasswordInputLogic(originalProps, ref)
    const design = {
        ...DESIGN_CONFIG,
        ...defaults.customDesign,
        ...props.customDesign,
    }
    const rightControl = (
        <button
            type="button"
            onClick={logic.handler.togglePassword}
            onMouseDown={(event) => event.preventDefault()}
            disabled={props.disabled}
            aria-controls={props.id}
            aria-pressed={logic.state.showPassword}
            aria-label={
                logic.state.showPassword
                    ? messages.hidePassword
                    : messages.showPassword
            }
            className={`absolute inset-y-0 right-4 z-30 flex cursor-pointer items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-input-dark ${design.iconColor} ${design.iconFocus}`}
        >
            {logic.state.showPassword ? (
                <EyeOff className="h-5 w-5" />
            ) : (
                <Eye className="h-5 w-5" />
            )}
        </button>
    )

    return (
        <InputField
            {...props}
            logic={logic}
            inputType={logic.state.showPassword ? 'text' : 'password'}
            rightControl={rightControl}
            passwordStrength={logic.state.passwordStrength}
            showPasswordStrength={logic.state.shouldShowPasswordStrength}
        />
    )
})
