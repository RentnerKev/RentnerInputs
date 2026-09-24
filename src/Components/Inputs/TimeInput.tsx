import { AlertCircle, ChevronDown, Clock } from 'lucide-react'
import { CustomTooltip } from '@rentnerkev/tooltips'
import { forwardRef, useId, type AriaAttributes, type Ref } from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import { useInputDefaults, useInputMessages } from '../../InputProvider.js'
import {
    mergeAriaDescribedBy,
    partitionAriaProps,
} from '../../Utils/fieldA11y.utils.js'
import useTimeInputLogic from '../../Hooks/Inputs/useTimeInput.logic.js'
import type { TimeInputComponentProps } from '../../Types/TimeInput.types.js'

interface TimeDropdownProps {
    label: string
    value: string
    placeholder: string
    options: string[]
    isOpen: boolean
    id?: string
    disabled?: boolean
    readOnly?: boolean
    buttonRef?: Ref<HTMLButtonElement>
    fieldAria?: AriaAttributes
    onToggle: () => void
    onSelect: (value: string) => void
}

function TimeDropdown({
    label,
    value,
    placeholder,
    options,
    isOpen,
    id,
    disabled,
    readOnly,
    buttonRef,
    fieldAria,
    onToggle,
    onSelect,
}: TimeDropdownProps) {
    return (
        <div className="relative flex-1">
            <button
                ref={buttonRef}
                id={id}
                type="button"
                {...fieldAria}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={
                    fieldAria?.['aria-label'] ??
                    (fieldAria?.['aria-labelledby'] ? undefined : label)
                }
                aria-readonly={
                    fieldAria?.['aria-readonly'] ?? (readOnly || undefined)
                }
                disabled={disabled}
                onClick={onToggle}
                className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-border-dark bg-background-dark/60 px-3 text-left text-sm font-semibold text-white transition-colors hover:border-secondary-text/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className={value ? 'text-white' : 'text-gray-400'}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-52 overflow-y-auto rounded-lg border border-secondary-text/50 bg-input-dark p-1 shadow-xl shadow-black/30">
                    <div
                        role="listbox"
                        aria-label={label}
                        className="space-y-1"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                role="option"
                                aria-selected={option === value}
                                disabled={disabled || readOnly}
                                onClick={() => onSelect(option)}
                                className={`flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                                    option === value
                                        ? 'bg-primary text-background-dark'
                                        : 'text-secondary-text hover:bg-border-dark hover:text-white'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputComponentProps>(
    function TimeInput(
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
        },
        ref,
    ) {
        void [_type, _showLength]
        const { ariaProps: additionalAria, otherProps: inputProps } =
            partitionAriaProps(props)
        const defaults = useInputDefaults()
        const resolvedMessages = useInputMessages(locale, messages)
        const logic = useTimeInputLogic(
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
        const hasLabel =
            label !== undefined && label !== null && label !== false
        const hasVisibleError =
            logic.state.hasError && Boolean(logic.state.error)
        const describedBy = mergeAriaDescribedBy(
            ariaDescribedBy,
            hasDescription ? descriptionId : undefined,
            hasVisibleError ? errorId : undefined,
        )
        const labelledBy = mergeAriaDescribedBy(
            ariaLabelledBy,
            hasLabel ? labelId : undefined,
        )
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

        return (
            <div className="group w-full">
                {hasLabel && (
                    <label
                        id={labelId}
                        htmlFor={fieldId}
                        className={`mb-2 block text-sm font-medium ${design.labelText}`}
                    >
                        {label}
                    </label>
                )}

                <div ref={logic.ref.wrapper} className="relative">
                    {hasLeftIcon && (
                        <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                            {logic.state.hasError ? (
                                <CustomTooltip
                                    content={logic.state.error ?? ''}
                                    side="bottom"
                                >
                                    <AlertCircle
                                        className={`h-5 w-5 ${design.errorText}`}
                                    />
                                </CustomTooltip>
                            ) : (
                                <span
                                    className={`flex items-center ${design.iconColor} ${design.iconFocus} transition-colors [&>svg]:h-5 [&>svg]:w-5`}
                                >
                                    {icon ?? <Clock />}
                                </span>
                            )}
                        </div>
                    )}

                    <input
                        {...inputProps}
                        id={`${fieldId}-input`}
                        ref={logic.ref.field}
                        type="time"
                        value={logic.state.safeValue}
                        onChange={logic.handler.handleNativeChange}
                        onFocus={logic.handler.handleFocus}
                        onBlur={logic.handler.handleBlur}
                        onInvalid={logic.handler.handleInvalid}
                        disabled={disabled}
                        required={
                            error === undefined ? nativeRequired : undefined
                        }
                        aria-hidden="true"
                        aria-required={fieldRequired}
                        tabIndex={-1}
                        className="pointer-events-none absolute h-px w-px opacity-0"
                    />

                    <div
                        className={fieldClassName}
                        role="group"
                        aria-labelledby={labelledBy}
                        aria-describedby={describedBy}
                    >
                        <TimeDropdown
                            id={fieldId}
                            buttonRef={logic.ref.trigger}
                            label={resolvedMessages.hourSelect}
                            value={logic.state.selectedHour}
                            placeholder={resolvedMessages.hourPlaceholder}
                            options={logic.state.hours}
                            isOpen={
                                logic.state.isHourDropdownOpen &&
                                !disabled &&
                                !readOnly
                            }
                            disabled={disabled}
                            readOnly={readOnly}
                            fieldAria={{
                                ...fieldAria,
                                'aria-required': undefined,
                            }}
                            onToggle={logic.handler.toggleHourDropdown}
                            onSelect={logic.handler.selectHour}
                        />
                        <span className="text-lg font-semibold text-primary">
                            :
                        </span>
                        <TimeDropdown
                            label={resolvedMessages.minuteSelect}
                            value={logic.state.selectedMinute}
                            placeholder={resolvedMessages.minutePlaceholder}
                            options={logic.state.minutes}
                            isOpen={
                                logic.state.isMinuteDropdownOpen &&
                                !disabled &&
                                !readOnly
                            }
                            disabled={disabled}
                            readOnly={readOnly}
                            fieldAria={{
                                ...fieldAria,
                                'aria-required': undefined,
                            }}
                            onToggle={logic.handler.toggleMinuteDropdown}
                            onSelect={logic.handler.selectMinute}
                        />
                    </div>
                </div>

                {hasDescription && (
                    <p
                        id={descriptionId}
                        className="mt-1 text-xs text-secondary-text"
                    >
                        {description}
                    </p>
                )}

                {hasVisibleError && (
                    <p
                        id={errorId}
                        aria-live="polite"
                        className={`mt-1 text-xs ${design.errorText}`}
                    >
                        {logic.state.error}
                    </p>
                )}
            </div>
        )
    },
)
