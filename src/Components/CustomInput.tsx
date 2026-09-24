import { forwardRef } from 'react'
import type { Ref } from 'react'
import type { CustomInputComponentProps } from '../Types/CustomInput.types.js'
import type { EmailInputComponentProps } from '../Types/EmailInput.types.js'
import type { MoneyInputComponentProps } from '../Types/MoneyInput.types.js'
import type { NumberInputComponentProps } from '../Types/NumberInput.types.js'
import type { PasswordInputComponentProps } from '../Types/PasswordInput.types.js'
import type { PhoneInputComponentProps } from '../Types/PhoneInput.types.js'
import type { QuantityInputComponentProps } from '../Types/QuantityInput.types.js'
import type { TextareaComponentProps } from '../Types/Textarea.types.js'
import type { TextInputComponentProps } from '../Types/TextInput.types.js'
import type { TimeInputComponentProps } from '../Types/TimeInput.types.js'
import type { SearchInputComponentProps } from './Inputs/SearchInput.js'
import type { NativeTimeInputComponentProps } from './Inputs/NativeTimeInput.js'
import { EmailInput } from './Inputs/EmailInput.js'
import { MoneyInput } from './Inputs/MoneyInput.js'
import { NumberInput } from './Inputs/NumberInput.js'
import { PasswordInput } from './Inputs/PasswordInput.js'
import { PhoneInput } from './Inputs/PhoneInput.js'
import { QuantityInput } from './Inputs/QuantityInput.js'
import { Textarea } from './Inputs/Textarea.js'
import { TextInput } from './Inputs/TextInput.js'
import { SearchInput } from './Inputs/SearchInput.js'
import { NativeTimeInput } from './Inputs/NativeTimeInput.js'
import { TimeInput } from './Inputs/TimeInput.js'

type CustomInputElement = HTMLInputElement | HTMLTextAreaElement

export const CustomInput = forwardRef<
    CustomInputElement,
    CustomInputComponentProps
>(function CustomInput(props, ref) {
    switch (props.type) {
        case 'search':
            return (
                <SearchInput
                    {...(props as SearchInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'native-time':
            return (
                <NativeTimeInput
                    {...(props as NativeTimeInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'email':
            return (
                <EmailInput
                    {...(props as EmailInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'phone':
            return (
                <PhoneInput
                    {...(props as PhoneInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'number':
            return (
                <NumberInput
                    {...(props as NumberInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'money':
            return (
                <MoneyInput
                    {...(props as MoneyInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'password':
            return (
                <PasswordInput
                    {...(props as PasswordInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'quantity':
            return (
                <QuantityInput
                    {...(props as QuantityInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'time':
            return (
                <TimeInput
                    {...(props as TimeInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
        case 'textarea':
            return (
                <Textarea
                    {...(props as unknown as TextareaComponentProps)}
                    ref={ref as Ref<HTMLTextAreaElement>}
                />
            )
        default:
            return (
                <TextInput
                    {...(props as TextInputComponentProps)}
                    ref={ref as Ref<HTMLInputElement>}
                />
            )
    }
})
