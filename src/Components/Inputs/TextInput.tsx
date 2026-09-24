import { forwardRef } from 'react'
import useTextInputLogic from '../../Hooks/Inputs/useTextInput.logic.js'
import type { TextInputComponentProps } from '../../Types/TextInput.types.js'
import { InputField } from './InputField.js'

export const TextInput = forwardRef<HTMLInputElement, TextInputComponentProps>(
    function TextInput({ type: _type, ...props }, ref) {
        void _type
        const logic = useTextInputLogic(props, ref)
        return <InputField {...props} logic={logic} inputType="text" />
    },
)
