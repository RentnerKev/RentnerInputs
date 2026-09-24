import type { BaseTextareaProps } from './InputShared.types.js'

export interface TextareaProps extends BaseTextareaProps {
    type?: 'textarea'
    onValueChange?: (value: string) => void
}

export type TextareaValueProps = Omit<TextareaProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type TextareaComponentProps = TextareaProps | TextareaValueProps
