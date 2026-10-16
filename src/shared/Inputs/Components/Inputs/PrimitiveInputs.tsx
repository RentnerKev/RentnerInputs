import { forwardRef } from 'react'
import { useInputPresentation } from '../../Hooks/useInputPresentation.ts'
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
    function CheckboxInput(
        { type: _type, className, controlSize, classNames, ...props },
        ref,
    ) {
        void _type
        const presentation = useInputPresentation({
            controlSize,
            classNames,
        }).state
        return (
            <input
                {...props}
                ref={ref}
                type="checkbox"
                className={`${presentation.sizeClassName} ${className ?? presentation.classNames.control ?? presentation.classNames.checkbox ?? 'size-4 accent-rentner-accent'}`}
            />
        )
    },
)

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
    function RadioInput(
        { type: _type, className, controlSize, classNames, ...props },
        ref,
    ) {
        void _type
        const presentation = useInputPresentation({
            controlSize,
            classNames,
        }).state
        return (
            <input
                {...props}
                ref={ref}
                type="radio"
                className={`${presentation.sizeClassName} ${className ?? presentation.classNames.control ?? presentation.classNames.radio ?? 'size-4 accent-rentner-accent'}`}
            />
        )
    },
)

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
    function RangeInput(
        { type: _type, className, controlSize, classNames, ...props },
        ref,
    ) {
        void _type
        const presentation = useInputPresentation({
            controlSize,
            classNames,
        }).state
        return (
            <input
                {...props}
                ref={ref}
                type="range"
                className={`${presentation.sizeClassName} ${className ?? presentation.classNames.control ?? presentation.classNames.range ?? 'w-full accent-rentner-accent'}`}
            />
        )
    },
)

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
    function FileInput(
        { type: _type, className, controlSize, classNames, ...props },
        ref,
    ) {
        void _type
        const presentation = useInputPresentation({
            controlSize,
            classNames,
        }).state
        return (
            <input
                {...props}
                ref={ref}
                type="file"
                className={`${presentation.sizeClassName} ${className ?? presentation.classNames.control ?? presentation.classNames.file ?? 'block w-full text-sm'}`}
            />
        )
    },
)
