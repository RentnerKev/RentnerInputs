import type { Ref } from 'react'
import type { EmailInputComponentProps } from '../../Types/EmailInput.types.js'
import { useInputMessages } from '../../InputProvider.js'
import { validateEmail } from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useEmailInputLogic(
    props: EmailInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = useInputMessages(props.locale, props.messages)
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) => validateEmail(value, messages),
        forwardedRef,
    })
}
