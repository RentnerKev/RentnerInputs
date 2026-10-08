import type { InputFieldValidationResult } from '../../Types/InputFieldValidation.types.ts'
import type { Ref } from 'react'
import type { EmailInputComponentProps } from '../../Types/EmailInput.types.ts'
import { useInputMessages } from '../useInputDefaults.ts'
import { validateEmail } from '../../../../lib/Inputs/inputValidation.utils.ts'
import { useFieldValidation } from './useFieldValidation.ts'

export default function useEmailInputLogic(
    props: EmailInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
): InputFieldValidationResult<HTMLInputElement> {
    const messages = useInputMessages(props.locale, props.messages)
    return useFieldValidation<HTMLInputElement>({
        ...props,
        validate: (value) => validateEmail(value, messages),
        forwardedRef,
    })
}
