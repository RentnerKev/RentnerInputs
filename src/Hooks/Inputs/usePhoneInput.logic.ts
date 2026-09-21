import type { Ref } from 'react'
import type { PhoneInputProps } from '../../Types/PhoneInput.types.js'
import { resolveInputMessages } from '../../Config/messages.js'
import { validatePhone } from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function usePhoneInputLogic(
    props: PhoneInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = resolveInputMessages(props.locale, props.messages)
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) => validatePhone(value, messages),
        forwardedRef,
    })
}
