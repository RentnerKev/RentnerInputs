import type { BaseInputProps } from './InputShared.types.js'

export interface EmailInputProps extends BaseInputProps {
    type?: 'email'
    onValueChange?: (value: string) => void
}

export type EmailInputValueProps = Omit<EmailInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type EmailInputComponentProps = EmailInputProps | EmailInputValueProps
