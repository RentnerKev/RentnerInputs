import { forwardRef } from 'react'
import type { Ref } from 'react'
import type {
    CustomInputComponentProps,
    CustomInputElement,
} from '../Types/CustomInput.types.ts'
import type { EmailInputComponentProps } from '../Types/EmailInput.types.ts'
import type { MoneyInputComponentProps } from '../Types/MoneyInput.types.ts'
import type { NumberInputComponentProps } from '../Types/NumberInput.types.ts'
import type { PasswordInputComponentProps } from '../Types/PasswordInput.types.ts'
import type { PhoneInputComponentProps } from '../Types/PhoneInput.types.ts'
import type { QuantityInputComponentProps } from '../Types/QuantityInput.types.ts'
import type { TextareaComponentProps } from '../Types/Textarea.types.ts'
import type { TextInputComponentProps } from '../Types/TextInput.types.ts'
import type { TimeInputComponentProps } from '../Types/TimeInput.types.ts'
import type { SearchInputComponentProps } from '../Types/SearchInput.types.ts'
import type { NativeTimeInputComponentProps } from '../Types/NativeTimeInput.types.ts'
import { EmailInput } from './Inputs/EmailInput.tsx'
import { MoneyInput } from './Inputs/MoneyInput.tsx'
import { NumberInput } from './Inputs/NumberInput.tsx'
import { PasswordInput } from './Inputs/PasswordInput.tsx'
import { PhoneInput } from './Inputs/PhoneInput.tsx'
import { QuantityInput } from './Inputs/QuantityInput.tsx'
import { Textarea } from './Inputs/Textarea.tsx'
import { TextInput } from './Inputs/TextInput.tsx'
import { SearchInput } from './Inputs/SearchInput.tsx'
import { NativeTimeInput } from './Inputs/NativeTimeInput.tsx'
import { TimeInput } from './Inputs/TimeInput.tsx'

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
