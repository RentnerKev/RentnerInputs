import type { Ref } from 'react'
import type { EmailInputProps } from '../../Types/EmailInput.types.js'
import { validateEmail } from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useEmailInputLogic(
    props: EmailInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: validateEmail,
        forwardedRef,
    })
}
