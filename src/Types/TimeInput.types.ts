import type { Ref } from 'react'
import type { BaseInputProps } from './InputShared.types.js'

export interface TimeInputProps extends Omit<BaseInputProps, 'triggerRef'> {
    type?: 'time'
    minuteStep?: number
    triggerRef?: Ref<HTMLButtonElement>
    onValueChange?: (value: string) => void
}

export type TimeInputValueProps = Omit<TimeInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type TimeInputComponentProps = TimeInputProps | TimeInputValueProps
