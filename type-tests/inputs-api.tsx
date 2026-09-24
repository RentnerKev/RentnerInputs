import type { ChangeEvent } from 'react'
import {
    CustomInput,
    Textarea,
    TextInput,
    type CustomInputProps,
    type CustomInputType,
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
interface ExtendedCustomInputProps extends CustomInputProps {
    testId: string
}

const directText = <TextInput value="" onValueChange={setValue} />
const nativeText = <TextInput value="" onChange={handleInput} />
const combinedText = (
    <TextInput value="" onChange={handleInput} onValueChange={setValue} />
)
const directTextarea = <Textarea value="" onValueChange={setValue} />
const directCustomText = <CustomInput value="" onValueChange={setValue} />
const directCustomTextarea = (
    <CustomInput type="textarea" value="" onValueChange={setValue} />
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
// @ts-expect-error Specialized CustomInput modes keep native onChange required.
const missingCustomEmailHandler = <CustomInput type="email" value="" />
const invalidCustomEmailValueHandler = (
    <CustomInput
        type="email"
        value=""
        onChange={handleCustomInput}
        // @ts-expect-error onValueChange is limited to text and textarea modes.
        onValueChange={setValue}
    />
)

const extensionExamples: [
    ExtendedTextInputProps | undefined,
    ExtendedTextareaProps | undefined,
    ExtendedCustomInputProps | undefined,
] = [undefined, undefined, undefined]

void [
    directText,
    nativeText,
    combinedText,
    directTextarea,
    directCustomText,
    directCustomTextarea,
    combinedCustomText,
    nativeCustomEmail,
    missingTextHandler,
    invalidTextHandler,
    missingCustomEmailHandler,
    invalidCustomEmailValueHandler,
    extensionExamples,
]
