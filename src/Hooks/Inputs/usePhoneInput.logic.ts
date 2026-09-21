import type { Ref } from 'react'
import type { PhoneInputProps } from '../../Types/PhoneInput.types.js'
import { validatePhone } from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function usePhoneInputLogic(
    props: PhoneInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    return useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: validatePhone,
        forwardedRef,
    })
}
