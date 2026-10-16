import type { InputHTMLAttributes } from 'react'

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> &
    Pick<
        import('./InputShared.types.ts').InputVisualProps,
        'controlSize' | 'classNames'
    >

export interface CheckboxInputProps extends NativeInputProps {
    type?: 'checkbox'
}

export interface RadioInputProps extends NativeInputProps {
    type?: 'radio'
}

export interface RangeInputProps extends NativeInputProps {
    type?: 'range'
}

export interface FileInputProps extends NativeInputProps {
    type?: 'file'
}
