import type { BaseTextareaProps } from './InputShared.types.ts'

export interface TextareaProps extends BaseTextareaProps {
    type?: 'textarea'
    onValueChange?: (value: string) => void
}

export type TextareaValueProps = Omit<TextareaProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type TextareaComponentProps = TextareaProps | TextareaValueProps
