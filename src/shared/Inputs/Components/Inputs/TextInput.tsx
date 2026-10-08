import { forwardRef } from 'react'
import { useFieldValidation } from '../../Hooks/Inputs/useFieldValidation.ts'
import type { TextInputComponentProps } from '../../Types/TextInput.types.ts'
import { InputField } from './InputField.tsx'

export const TextInput = forwardRef<HTMLInputElement, TextInputComponentProps>(
    function TextInput({ type: _type, ...props }, ref) {
        void _type
        const logic = useFieldValidation<HTMLInputElement>({
            ...props,
            forwardedRef: ref,
        })
        return <InputField {...props} logic={logic} inputType="text" />
    },
)
