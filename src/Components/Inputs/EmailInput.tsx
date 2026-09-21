import { forwardRef } from 'react'
import useEmailInputLogic from '../../Hooks/Inputs/useEmailInput.logic.js'
import type { EmailInputProps } from '../../Types/EmailInput.types.js'
import { InputField } from './InputField.js'

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
    function EmailInput({ type: _type, ...props }, ref) {
        void _type
        const logic = useEmailInputLogic(props, ref)
        return <InputField {...props} logic={logic} inputType="email" />
    },
)
