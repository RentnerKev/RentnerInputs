import type { TimeInputLogicResult } from '../../Types/TimeInputLogicResult.types.ts'
import { useId, type Ref, type AriaAttributes } from 'react'
import { DESIGN_CONFIG } from '../../../../config/inputDesign.config.ts'
import { useInputDefaults, useInputMessages } from '../useInputDefaults.ts'
import {
    mergeAriaDescribedBy,
    partitionAriaProps,
} from '../../../../lib/Inputs/fieldA11y.utils.ts'
import useTimeField from './useTimeField.ts'
import type { TimeInputComponentProps } from '../../Types/TimeInput.types.ts'

export default function useTimeInputLogic(
    {
        type: _type,
        label,
        icon,
        customDesign,
        description,
        error,
        locale,
        messages,
        className,
        disabled,
        validationMode,
        triggerRef,
        onValueChange: _onValueChange,
        required: nativeRequired,
        showLength: _showLength,
        minuteStep,
        'aria-describedby': ariaDescribedBy,
        'aria-errormessage': ariaErrorMessage,
        'aria-invalid': ariaInvalid,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-required': ariaRequired,
        ...props
    }: TimeInputComponentProps,
    ref: Ref<HTMLInputElement>,
): TimeInputLogicResult {
    void [_type, _showLength]
    const { ariaProps: additionalAria, otherProps: inputProps } =
        partitionAriaProps(props)
    const defaults = useInputDefaults()
    const resolvedMessages = useInputMessages(locale, messages)
    const logic = useTimeField(
        {
            ...inputProps,
            icon,
            customDesign,
            description,
            error,
            locale,
            messages,
            className,
            disabled,
            validationMode,
            triggerRef,
            onValueChange: _onValueChange,
            required: nativeRequired,
            minuteStep,
        } as TimeInputComponentProps,
        ref,
    )
    const generatedId = useId()
    const fieldId = inputProps.id ?? generatedId
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
    const hourPartLabelId = `${fieldId}-hour-part-label`
    const minutePartLabelId = `${fieldId}-minute-part-label`
    const hourPartAria = labelledBy
        ? {
              'aria-label': undefined,
              'aria-labelledby': mergeAriaDescribedBy(
                  labelledBy,
                  hourPartLabelId,
              ),
          }
        : ariaLabel
          ? {
                'aria-label': `${ariaLabel} ${resolvedMessages.hourSelect}`,
                'aria-labelledby': undefined,
            }
          : {
                'aria-label': resolvedMessages.hourSelect,
                'aria-labelledby': undefined,
            }
    const minutePartAria = labelledBy
        ? {
              'aria-label': undefined,
              'aria-labelledby': mergeAriaDescribedBy(
                  labelledBy,
                  minutePartLabelId,
              ),
          }
        : ariaLabel
          ? {
                'aria-label': `${ariaLabel} ${resolvedMessages.minuteSelect}`,
                'aria-labelledby': undefined,
            }
          : {
                'aria-label': resolvedMessages.minuteSelect,
                'aria-labelledby': undefined,
            }
    const readOnly = inputProps.readOnly
    const fieldInvalid = logic.state.hasError || ariaInvalid || undefined
    const fieldRequired = disabled
        ? undefined
        : error === undefined
          ? nativeRequired || ariaRequired || undefined
          : ariaRequired
    const fieldAria = {
        ...additionalAria,
        'aria-label': ariaLabel,
        'aria-labelledby': labelledBy,
        'aria-describedby': describedBy,
        'aria-errormessage': hasVisibleError ? errorId : ariaErrorMessage,
        'aria-invalid': fieldInvalid,
        'aria-required': fieldRequired,
        'aria-readonly': readOnly || undefined,
        'aria-disabled': disabled || undefined,
    } satisfies AriaAttributes
    const design = {
        ...DESIGN_CONFIG,
        ...defaults.customDesign,
        ...customDesign,
    }
    const fieldClasses =
        className ?? defaults.classNames?.input ?? 'w-full py-3 rounded-xl'
    const hasLeftIcon = Boolean(icon || logic.state.hasError)
    const fieldClassName = `peer flex min-h-14 items-center gap-3 ${hasLeftIcon ? 'pl-11' : 'pl-4'} pr-4 transition-[background-color,border-color,box-shadow,color] ${fieldClasses} ${design.bg} border ${design.text} ${
        logic.state.hasError
            ? `${design.errorBorder} ring-2 ${design.errorRingBase}`
            : design.border
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
            inputProps,
            label,
            icon,
            description,
            externalError: error,
            disabled,
            nativeRequired,
            ariaErrorMessage,
            readOnly,
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
            hourPartLabelId,
            minutePartLabelId,
            hourPartAria,
            minutePartAria,
            fieldRequired,
            fieldAria,
            design,
            fieldClassName,
            hasLeftIcon,
            hours: logic.state.hours,
            minutes: logic.state.minutes,
            selectedHour: logic.state.selectedHour,
            selectedMinute: logic.state.selectedMinute,
            isHourDropdownOpen: logic.state.isHourDropdownOpen,
            isMinuteDropdownOpen: logic.state.isMinuteDropdownOpen,
        },
        handler: {
            handleFocus: logic.handler.handleFocus,
            handleBlur: logic.handler.handleBlur,
            handleInvalid: logic.handler.handleInvalid,
            handleNativeChange: logic.handler.handleNativeChange,
            selectHour: logic.handler.selectHour,
            selectMinute: logic.handler.selectMinute,
            toggleHourDropdown: logic.handler.toggleHourDropdown,
            toggleMinuteDropdown: logic.handler.toggleMinuteDropdown,
        },
        setter: {
            setIsHourDropdownOpen: logic.setter.setIsHourDropdownOpen,
            setIsMinuteDropdownOpen: logic.setter.setIsMinuteDropdownOpen,
        },
        refs: {
            field: logic.refs.field,
            trigger: logic.refs.trigger,
            wrapper: logic.refs.wrapper,
        },
    }
}
