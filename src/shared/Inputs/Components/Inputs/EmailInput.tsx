import { forwardRef } from 'react'
import useEmailInputLogic from '../../Hooks/Inputs/useEmailInputLogic.ts'
import type { EmailInputComponentProps } from '../../Types/EmailInput.types.ts'
import { InputField } from './InputField.tsx'

export const EmailInput = forwardRef<
    HTMLInputElement,
    EmailInputComponentProps
>(function EmailInput({ type: _type, ...props }, ref) {
    void _type
    const logic = useEmailInputLogic(props, ref)
    return <InputField {...props} logic={logic} inputType="email" />
})
