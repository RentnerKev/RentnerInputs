import type { BaseInputProps } from './InputShared.types.js'

export interface TimeInputProps extends BaseInputProps {
    type?: 'time'
    minuteStep?: number
}
