import type { InputFieldValidationResult } from '../../Types/InputFieldValidation.types.ts'
import type { Ref } from 'react'
import type { PhoneInputComponentProps } from '../../Types/PhoneInput.types.ts'
import { useInputMessages } from '../useInputDefaults.ts'
import { validatePhone } from '../../../../lib/Inputs/inputValidation.utils.ts'
import { useFieldValidation } from './useFieldValidation.ts'

export default function usePhoneInputLogic(
    props: PhoneInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
): InputFieldValidationResult<HTMLInputElement> {
    const messages = useInputMessages(props.locale, props.messages)
    return useFieldValidation<HTMLInputElement>({
        ...props,
        validate: (value) => validatePhone(value, messages),
        forwardedRef,
    })
}
