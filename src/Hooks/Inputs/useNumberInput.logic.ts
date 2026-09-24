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
    const minValue = resolveNumberBound(props.min, props.minValue)
    const maxValue = resolveNumberBound(props.max, props.maxValue)

    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) =>
            validateNumber(value, minValue, maxValue, messages),
        acceptsValue: (value) =>
            value === '' ||
            maxValue === undefined ||
            Number.isNaN(Number(value)) ||
            Number(value) <= maxValue,
        selectZeroOnFocus: true,
        forwardedRef,
    })
}

export function resolveNumberBound(
    nativeBound: string | number | undefined,
    valueBound: number | undefined,
) {
    if (nativeBound === undefined) return valueBound
    if (nativeBound === '') return undefined
    const parsedBound = Number(nativeBound)
    return Number.isFinite(parsedBound) ? parsedBound : undefined
}
