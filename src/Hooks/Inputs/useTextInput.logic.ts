import type { Ref } from 'react'
import type { TextInputProps } from '../../Types/TextInput.types.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useTextInputLogic(
    props: TextInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        forwardedRef,
    })
}
