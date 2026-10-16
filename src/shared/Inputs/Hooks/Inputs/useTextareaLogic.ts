import type { TextareaLogicResult } from '../../Types/TextareaLogicResult.types.ts'
import { useId, type Ref } from 'react'
import { DESIGN_CONFIG } from '../../../../config/inputDesign.config.ts'
import { useInputDefaults } from '../useInputDefaults.ts'
import { mergeAriaDescribedBy } from '../../../../lib/Inputs/fieldA11y.utils.ts'
import { useFieldValidation } from './useFieldValidation.ts'
import type { TextareaComponentProps } from '../../Types/Textarea.types.ts'

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
        classNames: providedClassNames,
        controlSize,
        portalContainer: _portalContainer,
        portalClassName: _portalClassName,
        portalZIndex: _portalZIndex,
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
    void [_portalContainer, _portalClassName, _portalZIndex]
    const classNames = { ...defaults.classNames, ...providedClassNames }
    const size = controlSize ?? defaults.controlSize
    const sizeClassName =
        size === 'sm'
            ? 'h-rentner-control-sm py-0'
            : size === 'md'
              ? 'h-rentner-control-md py-0'
              : size === 'lg'
                ? 'h-rentner-control-lg py-0'
                : ''
    const design = {
        ...DESIGN_CONFIG,
        ...defaults.customDesign,
        ...customDesign,
    }
    const hasLeftIcon = Boolean(icon || logic.state.hasError)
    const fieldClassName = `peer block resize-y focus:ring-2 focus-visible:outline-none transition-[background-color,border-color,box-shadow,color] ${classNames.control ?? `${className ?? classNames.textarea ?? 'min-h-28 w-full py-3 rounded-rentner-control'} ${design.bg} border ${design.text} ${design.placeholder} ${logic.state.hasError ? `${design.errorBorder} focus:ring-2 ${design.errorRing}` : `${design.border} focus:ring-2 ${design.focusRing} ${design.focusBorder}`}`} ${sizeClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

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
            classNames,
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
