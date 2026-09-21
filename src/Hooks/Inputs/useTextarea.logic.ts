import type { Ref } from 'react'
import type { TextareaProps } from '../../Types/Textarea.types.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useTextareaLogic(
    props: TextareaProps,
    forwardedRef?: Ref<HTMLTextAreaElement>,
) {
    return useInputFieldLogic<HTMLTextAreaElement>({
        ...props,
        forwardedRef,
    })
}
