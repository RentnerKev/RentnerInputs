import { useState } from 'react'
import type { Ref } from 'react'
import type { PasswordInputProps } from '../../Types/PasswordInput.types.js'
import { getPasswordStrength } from '../../Utils/passwordStrength.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function usePasswordInputLogic(
    props: PasswordInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const [showPassword, setShowPassword] = useState(false)
    const showLength = props.showLength
    const field = useInputFieldLogic<HTMLInputElement>({
        ...props,
        forwardedRef,
    })

    function togglePassword() {
        setShowPassword((currentValue) => !currentValue)
    }

    return {
        ...field,
        state: {
            ...field.state,
            showPassword,
            passwordStrength: getPasswordStrength(field.state.safeValue),
            shouldShowPasswordStrength: props.showPasswordStrength === true,
            dynamicPaddingRight:
                field.state.dynamicPaddingRight + (showLength ? 40 : 32),
        },
        handler: { ...field.handler, togglePassword },
        setter: { ...field.setter, setShowPassword },
    }
}
