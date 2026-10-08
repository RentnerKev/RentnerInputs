import type { OtpInputProps } from './OtpInput.types.ts'

export type OtpLogicOptions = Pick<
    OtpInputProps,
    | 'value'
    | 'onValueChange'
    | 'onComplete'
    | 'length'
    | 'required'
    | 'disabled'
    | 'readOnly'
    | 'error'
    | 'status'
    | 'locale'
    | 'messages'
    | 'validationMode'
>
