import { forwardRef, type InputHTMLAttributes } from 'react'
import { useInputDefaults } from '../../InputProvider.js'

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export interface CheckboxInputProps extends NativeInputProps {
    type?: 'checkbox'
}

export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
    function CheckboxInput({ type: _type, className, ...props }, ref) {
        void _type
        const defaults = useInputDefaults()
        return (
            <input
                {...props}
                ref={ref}
                type="checkbox"
                className={
                    className ??
                    defaults.classNames?.checkbox ??
                    'size-4 accent-primary'
                }
            />
        )
    },
)

export interface RadioInputProps extends NativeInputProps {
    type?: 'radio'
}

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
    function RadioInput({ type: _type, className, ...props }, ref) {
        void _type
        const defaults = useInputDefaults()
        return (
            <input
                {...props}
                ref={ref}
                type="radio"
                className={
                    className ??
                    defaults.classNames?.radio ??
                    'size-4 accent-primary'
                }
            />
        )
    },
)

export interface RangeInputProps extends NativeInputProps {
    type?: 'range'
}

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
    function RangeInput({ type: _type, className, ...props }, ref) {
        void _type
        const defaults = useInputDefaults()
        return (
            <input
                {...props}
                ref={ref}
                type="range"
                className={
                    className ??
                    defaults.classNames?.range ??
                    'w-full accent-primary'
                }
            />
        )
    },
)

export interface FileInputProps extends NativeInputProps {
    type?: 'file'
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
    function FileInput({ type: _type, className, ...props }, ref) {
        void _type
        const defaults = useInputDefaults()
        return (
            <input
                {...props}
                ref={ref}
                type="file"
                className={
                    className ??
                    defaults.classNames?.file ??
                    'block w-full text-sm'
                }
            />
        )
    },
)
