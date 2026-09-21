import { Eye, EyeOff } from 'lucide-react'
import { forwardRef } from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import usePasswordInputLogic from '../../Hooks/Inputs/usePasswordInput.logic.js'
import type { PasswordInputProps } from '../../Types/PasswordInput.types.js'
import { InputField } from './InputField.js'

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    function PasswordInput(
        { type: _type, showPasswordStrength, ...props },
        ref,
    ) {
        void _type
        const originalProps = { ...props, showPasswordStrength }
        const logic = usePasswordInputLogic(originalProps, ref)
        const design = { ...DESIGN_CONFIG, ...props.customDesign }
        const rightControl = (
            <button
                type="button"
                onClick={logic.handler.togglePassword}
                disabled={props.disabled}
                aria-label={
                    logic.state.showPassword
                        ? 'Passwort ausblenden'
                        : 'Passwort anzeigen'
                }
                className={`absolute inset-y-0 right-4 z-30 flex cursor-pointer items-center transition-colors focus:outline-none ${design.iconColor} ${design.iconFocus}`}
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
    },
)
