import type { KeyboardEventHandler } from 'react'
import type { InputFieldValidationResult } from './InputFieldValidation.types.ts'
export type NumericInputLogicResult = Pick<
    InputFieldValidationResult<HTMLInputElement>,
    'state' | 'refs'
> & {
    handler: InputFieldValidationResult<HTMLInputElement>['handler'] & {
        handleKeyDown: KeyboardEventHandler<HTMLInputElement>
    }
}
