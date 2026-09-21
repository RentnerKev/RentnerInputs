import { forwardRef } from 'react'
import type { Ref } from 'react'
import type { CustomInputProps } from '../Types/CustomInput.types.js'
import type { EmailInputProps } from '../Types/EmailInput.types.js'
import type { MoneyInputProps } from '../Types/MoneyInput.types.js'
import type { NumberInputProps } from '../Types/NumberInput.types.js'
import type { PasswordInputProps } from '../Types/PasswordInput.types.js'
import type { PhoneInputProps } from '../Types/PhoneInput.types.js'
import type { QuantityInputProps } from '../Types/QuantityInput.types.js'
import type { TextareaProps } from '../Types/Textarea.types.js'
import type { TextInputProps } from '../Types/TextInput.types.js'
import type { TimeInputProps } from '../Types/TimeInput.types.js'
import { EmailInput } from './Inputs/EmailInput.js'
import { MoneyInput } from './Inputs/MoneyInput.js'
import { NumberInput } from './Inputs/NumberInput.js'
import { PasswordInput } from './Inputs/PasswordInput.js'
import { PhoneInput } from './Inputs/PhoneInput.js'
import { QuantityInput } from './Inputs/QuantityInput.js'
import { Textarea } from './Inputs/Textarea.js'
import { TextInput } from './Inputs/TextInput.js'
import { TimeInput } from './Inputs/TimeInput.js'

type CustomInputElement = HTMLInputElement | HTMLTextAreaElement

export const CustomInput = forwardRef<CustomInputElement, CustomInputProps>(
    function CustomInput(props, ref) {
        switch (props.type) {
            case 'email':
                return (
                    <EmailInput
                        {...(props as EmailInputProps)}
                        ref={ref as Ref<HTMLInputElement>}
                    />
                )
            case 'phone':
                return (
                    <PhoneInput
                        {...(props as PhoneInputProps)}
                        ref={ref as Ref<HTMLInputElement>}
                    />
                )
            case 'number':
                return (
                    <NumberInput
                        {...(props as NumberInputProps)}
                        ref={ref as Ref<HTMLInputElement>}
                    />
                )
            case 'money':
                return (
                    <MoneyInput
                        {...(props as MoneyInputProps)}
                        ref={ref as Ref<HTMLInputElement>}
                    />
                )
            case 'password':
                return (
                    <PasswordInput
                        {...(props as PasswordInputProps)}
                        ref={ref as Ref<HTMLInputElement>}
                    />
                )
            case 'quantity':
                return (
                    <QuantityInput
                        {...(props as QuantityInputProps)}
                        ref={ref as Ref<HTMLInputElement>}
                    />
                )
            case 'time':
                return (
                    <TimeInput
                        {...(props as TimeInputProps)}
                        ref={ref as Ref<HTMLInputElement>}
                    />
                )
            case 'textarea':
                return (
                    <Textarea
                        {...(props as unknown as TextareaProps)}
                        ref={ref as Ref<HTMLTextAreaElement>}
                    />
                )
            default:
                return (
                    <TextInput
                        {...(props as TextInputProps)}
                        ref={ref as Ref<HTMLInputElement>}
                    />
                )
        }
    },
)
