import { forwardRef } from 'react'
import usePhoneInputLogic from '../../Hooks/Inputs/usePhoneInput.logic.js'
import type { PhoneInputProps } from '../../Types/PhoneInput.types.js'
import { InputField } from './InputField.js'

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    function PhoneInput({ type: _type, ...props }, ref) {
        void _type
        const logic = usePhoneInputLogic(props, ref)
        return <InputField {...props} logic={logic} inputType="tel" />
    },
)
