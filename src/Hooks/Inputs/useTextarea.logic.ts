import type { Ref } from 'react'
import type { TextareaComponentProps } from '../../Types/Textarea.types.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useTextareaLogic(
    props: TextareaComponentProps,
    forwardedRef?: Ref<HTMLTextAreaElement>,
) {
    return useInputFieldLogic<HTMLTextAreaElement>({
        ...props,
        forwardedRef,
    })
}
