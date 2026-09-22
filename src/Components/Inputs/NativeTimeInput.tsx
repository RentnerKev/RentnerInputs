import { forwardRef } from 'react'
import { useInputFieldLogic } from '../../Hooks/Inputs/useInputField.logic.js'
import type { BaseInputProps } from '../../Types/InputShared.types.js'
import { InputField } from './InputField.js'

export interface NativeTimeInputProps extends BaseInputProps {
    type?: 'time'
}

export const NativeTimeInput = forwardRef<
    HTMLInputElement,
    NativeTimeInputProps
>(function NativeTimeInput({ type: _type, ...props }, ref) {
    void _type
    const logic = useInputFieldLogic<HTMLInputElement>({
        ...props,
        forwardedRef: ref,
    })
    return <InputField {...props} logic={logic} inputType="time" />
})
