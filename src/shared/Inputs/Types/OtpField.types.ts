import type { OtpInputProps } from './OtpInput.types.js'

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
