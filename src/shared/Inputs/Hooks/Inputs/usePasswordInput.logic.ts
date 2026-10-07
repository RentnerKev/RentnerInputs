import type { PasswordInputLogicResult } from '../../Types/PasswordInputLogicResult.types.js'
import { useState } from 'react'
import type { Ref } from 'react'
import { useInputDefaults, useInputMessages } from '../useInputDefaults.js'
import { DESIGN_CONFIG } from '../../../../config/inputDesign.config.js'
import type { PasswordInputComponentProps } from '../../Types/PasswordInput.types.js'
import { getPasswordStrength } from '../../../../lib/Inputs/passwordStrength.utils.js'
import { useFieldValidation } from './useFieldValidation.js'

export default function usePasswordInputLogic(
    props: PasswordInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
): PasswordInputLogicResult {
    const [showPassword, setShowPassword] = useState(false)
    const showLength = props.showLength
    const messages = useInputMessages(props.locale, props.messages)
    const defaults = useInputDefaults()
    const design = {
        ...DESIGN_CONFIG,
        ...defaults.customDesign,
        ...props.customDesign,
    }
    const field = useFieldValidation<HTMLInputElement>({
        ...props,
        forwardedRef,
    })

    function togglePassword() {
        setShowPassword((currentValue) => !currentValue)
    }

    return {
        refs: { field: field.refs.field },

        state: {
            design,
            messages,
            safeValue: field.state.safeValue,
            error: field.state.error,
            hasError: field.state.hasError,
            isFocused: field.state.isFocused,
            effectiveShowLength: field.state.effectiveShowLength,
            counterText: field.state.counterText,
            showPassword,
            passwordStrength:
                props.showPasswordStrength === true
                    ? getPasswordStrength(field.state.safeValue, messages)
                    : undefined,
            shouldShowPasswordStrength: props.showPasswordStrength === true,
            dynamicPaddingRight:
                field.state.dynamicPaddingRight + (showLength ? 40 : 32),
        },
        handler: {
            handleInputChange: field.handler.handleInputChange,
            handleFocus: field.handler.handleFocus,
            handleBlur: field.handler.handleBlur,
            handleInvalid: field.handler.handleInvalid,
            togglePassword,
        },
        setter: {
            setIsTouched: field.setter.setIsTouched,
            setIsFocused: field.setter.setIsFocused,
            setNativeError: field.setter.setNativeError,
            setShowPassword,
        },
    }
}
