import type { InputFieldLogicResult } from '../../Types/InputFieldLogicResult.types.ts'
import { useId } from 'react'
import { DESIGN_CONFIG } from '../../../../config/inputDesign.config.ts'
import { useInputDefaults, useInputMessages } from '../useInputDefaults.ts'
import { mergeAriaDescribedBy } from '../../../../lib/Inputs/fieldA11y.utils.ts'
import type { InputFieldProps } from '../../Types/InputField.types.ts'

export default function useInputFieldLogic({
    logic,
    inputType,
    displayValue,
    rightControl,
    passwordStrength,
    showPasswordStrength,
    value: _value,
    onChange: _onChange,
    onValueChange: _onValueChange,
    onFocus: _onFocus,
    onBlur: _onBlur,
    onInvalid: _onInvalid,
    label,
    required: nativeRequired,
    icon,
    customDesign,
    description,
    error,
    triggerRef: _triggerRef,
    showLength,
    maxLength,
    minLength,
    locale,
    messages,
    validationMode: _validationMode,
    className,
    disabled,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    'aria-required': ariaRequired,
    ...nativeProps
}: InputFieldProps): InputFieldLogicResult {
    void [
        _value,
        _onChange,
        _onValueChange,
        _onFocus,
        _onBlur,
        _onInvalid,
        _triggerRef,
        _validationMode,
    ]
    const defaults = useInputDefaults()
    const resolvedMessages = useInputMessages(locale, messages)
    const generatedId = useId()
    const fieldId = nativeProps.id ?? generatedId
    const labelId = `${fieldId}-label`
    const descriptionId = `${fieldId}-description`
    const errorId = `${fieldId}-error`
    const hasDescription =
        description !== undefined &&
        description !== null &&
        description !== false
    const hasLabel = label !== undefined && label !== null && label !== false
    const hasVisibleError = logic.state.hasError && Boolean(logic.state.error)
    const describedBy = mergeAriaDescribedBy(
        ariaDescribedBy,
        hasDescription ? descriptionId : undefined,
        hasVisibleError ? errorId : undefined,
    )
    const labelledBy = mergeAriaDescribedBy(
        ariaLabelledBy,
        hasLabel ? labelId : undefined,
    )
    const design = {
        ...DESIGN_CONFIG,
        ...defaults.customDesign,
        ...customDesign,
    }
    const fieldClasses =
        className ?? defaults.classNames?.input ?? 'w-full py-3 rounded-xl'
    const hasLeftIcon = Boolean(icon || logic.state.hasError)
    const fieldClassName = `peer block ${hasLeftIcon ? 'pl-11' : 'pl-4'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-[background-color,border-color,box-shadow,color] ${fieldClasses} ${design.bg} border ${design.text} ${design.placeholder} ${
        logic.state.hasError
            ? `${design.errorBorder} focus:ring-2 ${design.errorRing}`
            : `${design.border} focus:ring-2 ${design.focusRing} ${design.focusBorder}`
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    const passwordStrengthBarClass =
        !passwordStrength || passwordStrength.score <= 1
            ? design.passwordStrengthWeak
            : passwordStrength.score === 2
              ? design.passwordStrengthFair
              : passwordStrength.score === 3
                ? design.passwordStrengthGood
                : design.passwordStrengthStrong

    return {
        state: {
            logic,
            inputType,
            displayValue,
            rightControl,
            passwordStrength,
            showPasswordStrength,
            label,
            nativeRequired,
            icon,
            description,
            error,
            showLength,
            maxLength,
            minLength,
            disabled,
            ariaErrorMessage,
            ariaInvalid,
            ariaRequired,
            nativeProps,
            resolvedMessages,
            fieldId,
            labelId,
            descriptionId,
            errorId,
            hasDescription,
            hasLabel,
            hasVisibleError,
            describedBy,
            labelledBy,
            design,
            hasLeftIcon,
            fieldClassName,
            passwordStrengthBarClass,
        },
    }
}
