import type { BaseInputProps } from './InputShared.types.js'

export interface PhoneInputProps extends BaseInputProps {
    type?: 'phone'
    onValueChange?: (value: string) => void
}

export type PhoneInputValueProps = Omit<PhoneInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type PhoneInputComponentProps = PhoneInputProps | PhoneInputValueProps
