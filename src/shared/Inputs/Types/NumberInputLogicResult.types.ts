import type { InputFieldValidationResult } from './InputFieldValidation.types.ts'
export type NumberInputLogicResult = Pick<
    InputFieldValidationResult<HTMLInputElement>,
    'handler' | 'refs'
> & {
    state: InputFieldValidationResult<HTMLInputElement>['state'] & {
        min: number | undefined
        max: number | undefined
    }
}
