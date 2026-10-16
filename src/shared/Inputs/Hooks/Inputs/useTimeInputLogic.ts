import type { TimeInputLogicResult } from '../../Types/TimeInputLogicResult.types.ts'
import { useId, type Ref, type AriaAttributes, type FocusEvent } from 'react'
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
        classNames: providedClassNames,
        controlSize,
        portalContainer: _portalContainer,
        portalClassName: _portalClassName,
        portalZIndex: _portalZIndex,
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
    void [_type, _showLength, _portalContainer, _portalClassName, _portalZIndex]
    const classNames = providedClassNames
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
    const fieldRequired = disabled ? undefined : nativeRequired || ariaRequired
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
        className ??
        defaults.classNames?.input ??
        ((controlSize ?? defaults.controlSize)
            ? 'w-full rounded-rentner-control'
            : 'w-full py-3 rounded-rentner-control')
    const hasLeftIcon = Boolean(icon || logic.state.hasError)
    const fieldClassName = `peer flex ${(controlSize ?? defaults.controlSize) ? '' : 'min-h-14'} items-center ${
        classNames?.control ??
        defaults.classNames?.control ??
        `gap-3 ${hasLeftIcon ? 'pl-11' : 'pl-4'} pr-4 transition-[background-color,border-color,box-shadow,color] ${fieldClasses} ${design.bg} border ${design.text} ${
            logic.state.hasError
                ? `${design.errorBorder} ring-2 ${design.errorRingBase}`
                : design.border
        }`
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

    function handleFieldBlur(event: FocusEvent<HTMLDivElement>) {
        const root = event.currentTarget
        const nextTarget = event.relatedTarget
        const input = root.querySelector<HTMLInputElement>('input[type="time"]')
        if (!input || event.target === input) return
        function containsFocus(target: EventTarget | null) {
            return (
                target instanceof Node &&
                (root.contains(target) ||
                    (target instanceof Element &&
                        target
                            .closest('[data-rentner-time-owner]')
                            ?.getAttribute('data-rentner-time-owner') ===
                            fieldId))
            )
        }
        function reportBlur(relatedTarget: Element | null) {
            logic.handler.handleBlur({
                ...event,
                currentTarget: input!,
                target: input!,
                relatedTarget,
                preventDefault: event.preventDefault.bind(event),
                stopPropagation: event.stopPropagation.bind(event),
                persist: event.persist.bind(event),
                isDefaultPrevented: event.isDefaultPrevented.bind(event),
                isPropagationStopped: event.isPropagationStopped.bind(event),
            })
        }
        if (containsFocus(nextTarget)) return
        if (
            nextTarget instanceof Element &&
            nextTarget.shadowRoot &&
            Array.from(
                nextTarget.shadowRoot.querySelectorAll(
                    '[data-rentner-time-owner]',
                ),
            ).some(
                (popup) =>
                    popup.getAttribute('data-rentner-time-owner') === fieldId,
            )
        ) {
            queueMicrotask(() => {
                let active = nextTarget.ownerDocument.activeElement
                while (active?.shadowRoot?.activeElement)
                    active = active.shadowRoot.activeElement
                if (!containsFocus(active)) reportBlur(active)
            })
            return
        }
        reportBlur(nextTarget)
    }
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
            handleFieldBlur,
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
