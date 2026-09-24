import type { Ref } from 'react'
import type { TextInputComponentProps } from '../../Types/TextInput.types.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useTextInputLogic(
    props: TextInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        forwardedRef,
    })
}
