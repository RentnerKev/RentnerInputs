import type { Ref } from 'react'
import type { EmailInputComponentProps } from '../../Types/EmailInput.types.js'
import { useInputMessages } from '../useInputDefaults.js'
import { validateEmail } from '../../../../lib/Inputs/inputValidation.utils.js'
import { useFieldValidation } from './useFieldValidation.js'

export default function useEmailInputLogic(
    props: EmailInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = useInputMessages(props.locale, props.messages)
    return useFieldValidation<HTMLInputElement>({
        ...props,
        validate: (value) => validateEmail(value, messages),
        forwardedRef,
    })
}
