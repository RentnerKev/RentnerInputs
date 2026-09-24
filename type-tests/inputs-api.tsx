import type { ChangeEvent } from 'react'
import {
    CustomInput,
    EmailInput,
    MoneyInput,
    NativeTimeInput,
    NumberInput,
    PasswordInput,
    PhoneInput,
    QuantityInput,
    SearchInput,
    TimeInput,
    Textarea,
    TextInput,
    type EmailInputProps,
    type CustomInputProps,
    type CustomInputType,
    type MoneyInputProps,
    type NativeTimeInputProps,
    type NumberInputProps,
    type PasswordInputProps,
    type PhoneInputProps,
    type QuantityInputProps,
    type SearchInputProps,
    type TimeInputProps,
    type TextareaProps,
    type TextInputProps,
} from '../src/index.js'

const setValue = (_value: string) => undefined
const setNumber = (_value: number) => undefined
const handleInput = (_event: ChangeEvent<HTMLInputElement>) => undefined
const handleCustomInput = (
    _event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => undefined
declare const dynamicType: CustomInputType

interface ExtendedTextInputProps extends TextInputProps {
    testId: string
}
interface ExtendedTextareaProps extends TextareaProps {
    testId: string
}
interface ExtendedEmailInputProps extends EmailInputProps {
    testId: string
}
interface ExtendedPasswordInputProps extends PasswordInputProps {
    testId: string
}
interface ExtendedMoneyInputProps extends MoneyInputProps {
    testId: string
}
interface ExtendedPhoneInputProps extends PhoneInputProps {
    testId: string
}
interface ExtendedNumberInputProps extends NumberInputProps {
    testId: string
}
interface ExtendedQuantityInputProps extends QuantityInputProps {
    testId: string
}
interface ExtendedSearchInputProps extends SearchInputProps {
    testId: string
}
interface ExtendedNativeTimeInputProps extends NativeTimeInputProps {
    testId: string
}
interface ExtendedTimeInputProps extends TimeInputProps {
    testId: string
}
interface ExtendedCustomInputProps extends CustomInputProps {
    testId: string
}

const directText = <TextInput value="" onValueChange={setValue} />
const nativeText = <TextInput value="" onChange={handleInput} />
const combinedText = (
    <TextInput value="" onChange={handleInput} onValueChange={setValue} />
)
const directTextarea = <Textarea value="" onValueChange={setValue} />
const directEmail = <EmailInput value="" onValueChange={setValue} />
const directPassword = <PasswordInput value="" onValueChange={setValue} />
const directMoney = <MoneyInput value="" onValueChange={setValue} />
const directPhone = <PhoneInput value="" onValueChange={setValue} />
const directNumber = <NumberInput value="" onValueChange={setValue} />
const directQuantity = <QuantityInput value="" onValueChange={setValue} />
const directSearch = <SearchInput value="" onValueChange={setValue} />
const directNativeTime = <NativeTimeInput value="" onValueChange={setValue} />
const directTime = <TimeInput value="" onValueChange={setValue} />
const directCustomText = <CustomInput value="" onValueChange={setValue} />
const directCustomTextarea = (
    <CustomInput type="textarea" value="" onValueChange={setValue} />
)
const directCustomEmail = (
    <CustomInput type="email" value="" onValueChange={setValue} />
)
const directCustomDynamic = (
    <CustomInput type={dynamicType} value="" onValueChange={setValue} />
)
const combinedCustomText = (
    <CustomInput
        type="text"
        value=""
        onChange={handleCustomInput}
        onValueChange={setValue}
    />
)
const nativeCustomEmail = (
    <CustomInput type={dynamicType} value="" onChange={handleCustomInput} />
)

// @ts-expect-error A text input needs onChange, onValueChange, or both.
const missingTextHandler = <TextInput value="" />
// @ts-expect-error onValueChange receives a string.
const invalidTextHandler = <Textarea value="" onValueChange={setNumber} />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingEmailHandler = <EmailInput value="" />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingPasswordHandler = <PasswordInput value="" />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingMoneyHandler = <MoneyInput value="" />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingPhoneHandler = <PhoneInput value="" />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingNumberHandler = <NumberInput value="" />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingQuantityHandler = <QuantityInput value="" />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingSearchHandler = <SearchInput value="" />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingNativeTimeHandler = <NativeTimeInput value="" />
// @ts-expect-error Every string input needs onChange, onValueChange, or both.
const missingTimeHandler = <TimeInput value="" />
// @ts-expect-error onValueChange receives a string.
const invalidEmailHandler = <EmailInput value="" onValueChange={setNumber} />

const extensionExamples: [
    ExtendedTextInputProps | undefined,
    ExtendedTextareaProps | undefined,
    ExtendedEmailInputProps | undefined,
    ExtendedPasswordInputProps | undefined,
    ExtendedMoneyInputProps | undefined,
    ExtendedPhoneInputProps | undefined,
    ExtendedNumberInputProps | undefined,
    ExtendedQuantityInputProps | undefined,
    ExtendedSearchInputProps | undefined,
    ExtendedNativeTimeInputProps | undefined,
    ExtendedTimeInputProps | undefined,
    ExtendedCustomInputProps | undefined,
] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
]

void [
    directText,
    nativeText,
    combinedText,
    directTextarea,
    directEmail,
    directPassword,
    directMoney,
    directPhone,
    directNumber,
    directQuantity,
    directSearch,
    directNativeTime,
    directTime,
    directCustomText,
    directCustomTextarea,
    directCustomEmail,
    directCustomDynamic,
    combinedCustomText,
    nativeCustomEmail,
    missingTextHandler,
    invalidTextHandler,
    missingEmailHandler,
    missingPasswordHandler,
    missingMoneyHandler,
    missingPhoneHandler,
    missingNumberHandler,
    missingQuantityHandler,
    missingSearchHandler,
    missingNativeTimeHandler,
    missingTimeHandler,
    invalidEmailHandler,
    extensionExamples,
]
