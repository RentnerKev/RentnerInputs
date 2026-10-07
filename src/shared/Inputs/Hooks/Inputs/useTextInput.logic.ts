import type { Ref } from 'react'
import type { TextInputComponentProps } from '../../Types/TextInput.types.js'
import { useFieldValidation } from './useFieldValidation.js'

export default function useTextInputLogic(
    props: TextInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    return useFieldValidation<HTMLInputElement>({
        ...props,
        forwardedRef,
    })
}
