import type { BaseInputProps } from './InputShared.types.js'

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
