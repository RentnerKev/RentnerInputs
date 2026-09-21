import type { Ref } from 'react'
import type { BaseInputProps } from './InputShared.types.js'

export interface TimeInputProps extends Omit<BaseInputProps, 'triggerRef'> {
    type?: 'time'
    minuteStep?: number
    triggerRef?: Ref<HTMLButtonElement>
}
