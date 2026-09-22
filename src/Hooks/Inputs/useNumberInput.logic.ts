import type { Ref } from 'react'
import type { NumberInputProps } from '../../Types/NumberInput.types.js'
import { useInputMessages } from '../../InputProvider.js'
import { validateNumber } from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useNumberInputLogic(
    props: NumberInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = useInputMessages(props.locale, props.messages)
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) =>
            validateNumber(value, props.minValue, props.maxValue, messages),
        acceptsValue: (value) =>
            value === '' ||
            props.maxValue === undefined ||
            Number.isNaN(Number(value)) ||
            Number(value) <= props.maxValue,
        selectZeroOnFocus: true,
        forwardedRef,
    })
}
