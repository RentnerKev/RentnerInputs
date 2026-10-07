import type { Ref } from 'react'
import type { PhoneInputComponentProps } from '../../Types/PhoneInput.types.js'
import { useInputMessages } from '../useInputDefaults.js'
import { validatePhone } from '../../../../lib/Inputs/inputValidation.utils.js'
import { useFieldValidation } from './useFieldValidation.js'

export default function usePhoneInputLogic(
    props: PhoneInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = useInputMessages(props.locale, props.messages)
    return useFieldValidation<HTMLInputElement>({
        ...props,
        validate: (value) => validatePhone(value, messages),
        forwardedRef,
    })
}
