import { forwardRef } from 'react'
import usePhoneInputLogic from '../../Hooks/Inputs/usePhoneInputLogic.ts'
import type { PhoneInputComponentProps } from '../../Types/PhoneInput.types.ts'
import { InputField } from './InputField.tsx'

export const PhoneInput = forwardRef<
    HTMLInputElement,
    PhoneInputComponentProps
>(function PhoneInput({ type: _type, ...props }, ref) {
    void _type
    const logic = usePhoneInputLogic(props, ref)
    return <InputField {...props} logic={logic} inputType="tel" />
})
