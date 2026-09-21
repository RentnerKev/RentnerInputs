import type { Ref } from 'react'
import type { EmailInputProps } from '../../Types/EmailInput.types.js'
import { resolveInputMessages } from '../../Config/messages.js'
import { validateEmail } from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useEmailInputLogic(
    props: EmailInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = resolveInputMessages(props.locale, props.messages)
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) => validateEmail(value, messages),
        forwardedRef,
    })
}
