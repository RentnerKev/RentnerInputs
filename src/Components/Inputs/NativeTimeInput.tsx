import { forwardRef } from 'react'
import { useInputFieldLogic } from '../../Hooks/Inputs/useInputField.logic.js'
import type { BaseInputProps } from '../../Types/InputShared.types.js'
import { InputField } from './InputField.js'

export interface NativeTimeInputProps extends BaseInputProps {
    type?: 'time'
    onValueChange?: (value: string) => void
}

export type NativeTimeInputValueProps = Omit<
    NativeTimeInputProps,
    'onChange'
> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type NativeTimeInputComponentProps =
    | NativeTimeInputProps
    | NativeTimeInputValueProps

export const NativeTimeInput = forwardRef<
    HTMLInputElement,
    NativeTimeInputComponentProps
>(function NativeTimeInput({ type: _type, ...props }, ref) {
    void _type
    const logic = useInputFieldLogic<HTMLInputElement>({
        ...props,
        forwardedRef: ref,
    })
    return <InputField {...props} logic={logic} inputType="time" />
})
