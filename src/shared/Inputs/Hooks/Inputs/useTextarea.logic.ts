import type { TextareaLogicResult } from '../../Types/TextareaLogicResult.types.js'
import { useId, type Ref } from 'react'
import { DESIGN_CONFIG } from '../../../../config/inputDesign.config.js'
import { useInputDefaults } from '../useInputDefaults.js'
import { mergeAriaDescribedBy } from '../../../../lib/Inputs/fieldA11y.utils.js'
import { useFieldValidation } from './useFieldValidation.js'
import type { TextareaComponentProps } from '../../Types/Textarea.types.js'

export default function useTextareaLogic(
    props: TextareaComponentProps,
    ref: Ref<HTMLTextAreaElement>,
): TextareaLogicResult {
    const {
        type: _type,
        value: _value,
        onChange: _onChange,
        onValueChange: _onValueChange,
        onFocus: _onFocus,
        onBlur: _onBlur,
        onInvalid: _onInvalid,
        label,
        description,
        error,
        icon,
        customDesign,
        locale: _locale,
        messages: _messages,
        showLength,
        maxLength,
        minLength,
        className,
        disabled,
        validationMode: _validationMode,
        triggerRef: _triggerRef,
        required: nativeRequired,
        'aria-describedby': ariaDescribedBy,
        'aria-errormessage': ariaErrorMessage,
        'aria-invalid': ariaInvalid,
        'aria-labelledby': ariaLabelledBy,
        'aria-required': ariaRequired,
        rows = 4,
        ...nativeProps
    } = props
    void [_type, _locale, _messages, _validationMode, _triggerRef]
    const logic = useFieldValidation<HTMLTextAreaElement>({
        ...props,
        forwardedRef: ref,
    })
    const generatedId = useId()
    const fieldId = nativeProps.id ?? generatedId
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
        hasLabel ? `${fieldId}-label` : undefined,
    )
    const defaults = useInputDefaults()
    const design = {
        ...DESIGN_CONFIG,
        ...defaults.customDesign,
        ...customDesign,
    }
    const fieldClasses =
        className ?? defaults.classNames?.textarea ?? 'w-full py-3 rounded-xl'
    const hasLeftIcon = Boolean(icon || logic.state.hasError)
    const fieldClassName = `peer block min-h-28 resize-y ${hasLeftIcon ? 'pl-11' : 'pl-4'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-[background-color,border-color,box-shadow,color] ${fieldClasses} ${design.bg} border ${design.text} ${design.placeholder} ${
        logic.state.hasError
            ? `${design.errorBorder} focus:ring-2 ${design.errorRing}`
            : `${design.border} focus:ring-2 ${design.focusRing} ${design.focusBorder}`
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

    return {
        state: {
            safeValue: logic.state.safeValue,
            error: logic.state.error,
            hasError: logic.state.hasError,
            isFocused: logic.state.isFocused,
            effectiveShowLength: logic.state.effectiveShowLength,
            counterText: logic.state.counterText,
            dynamicPaddingRight: logic.state.dynamicPaddingRight,
            nativeProps,
            label,
            description,
            externalError: error,
            icon,
            showLength,
            maxLength,
            minLength,
            disabled,
            nativeRequired,
            ariaErrorMessage,
            ariaInvalid,
            ariaRequired,
            rows,
            fieldId,
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
        },
        handler: {
            handleInputChange: logic.handler.handleInputChange,
            handleFocus: logic.handler.handleFocus,
            handleBlur: logic.handler.handleBlur,
            handleInvalid: logic.handler.handleInvalid,
        },
        refs: { field: logic.refs.field },
    }
}
