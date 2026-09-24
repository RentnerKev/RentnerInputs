import type { Ref } from 'react'
import type { PhoneInputComponentProps } from '../../Types/PhoneInput.types.js'
import { useInputMessages } from '../../InputProvider.js'
import { validatePhone } from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function usePhoneInputLogic(
    props: PhoneInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = useInputMessages(props.locale, props.messages)
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) => validatePhone(value, messages),
        forwardedRef,
    })
}
