import type { BaseInputProps } from './InputShared.types.js'

export interface TextInputProps extends BaseInputProps {
    type?: 'text'
    onValueChange?: (value: string) => void
}

export type TextInputValueProps = Omit<TextInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type TextInputComponentProps = TextInputProps | TextInputValueProps
