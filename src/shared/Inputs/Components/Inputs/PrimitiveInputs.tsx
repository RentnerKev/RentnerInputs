import { forwardRef } from 'react'
import { useInputDefaults } from '../../Hooks/useInputDefaults.ts'
import type {
    CheckboxInputProps,
    RadioInputProps,
    RangeInputProps,
    FileInputProps,
} from '../../Types/PrimitiveInputs.types.ts'
export type {
    CheckboxInputProps,
    RadioInputProps,
    RangeInputProps,
    FileInputProps,
} from '../../Types/PrimitiveInputs.types.ts'

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
