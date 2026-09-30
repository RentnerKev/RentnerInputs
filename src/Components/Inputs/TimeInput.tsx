import { AlertCircle, ChevronDown, Clock } from 'lucide-react'
import { CustomTooltip } from '@rentnerkev/tooltips'
import {
    forwardRef,
    useEffect,
    useId,
    useRef,
    type AriaAttributes,
    type KeyboardEvent as ReactKeyboardEvent,
    type Ref,
} from 'react'
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
    const listboxRef = useRef<HTMLDivElement | null>(null)

    function focusTrigger() {
        const trigger = listboxRef.current
            ?.closest('div.relative')
            ?.querySelector<HTMLButtonElement>(
                'button[aria-haspopup="listbox"]',
            )
        trigger?.focus()
    }

    useEffect(() => {
        if (!isOpen) return

        const optionElements =
            listboxRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="option"]',
            )
        const selectedOption = Array.from(optionElements ?? []).find(
            (_, index) => options[index] === value,
        )
        const firstOption = optionElements?.[0]
        const initialOption = selectedOption ?? firstOption
        if (initialOption) initialOption.focus()
    }, [isOpen, listboxRef, options, value])

    function focusOptionAt(index: number) {
        const optionElements =
            listboxRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="option"]',
            )
        optionElements?.[index]?.focus()
    }

    function handleOptionKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Escape') {
            event.preventDefault()
            onToggle()
            focusTrigger()
            return
        }

        const optionElements =
            listboxRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="option"]',
            )
        if (!optionElements?.length) return

        const activeIndex = Array.from(optionElements).findIndex(
            (option) => option === document.activeElement,
        )
        const selectedIndex = Array.from(optionElements).findIndex(
            (option) => option.getAttribute('aria-selected') === 'true',
        )
        const currentIndex =
            activeIndex >= 0 ? activeIndex : Math.max(selectedIndex, 0)
        let nextIndex: number | undefined

        if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % optionElements.length
        } else if (event.key === 'ArrowUp') {
            nextIndex =
                (currentIndex - 1 + optionElements.length) %
                optionElements.length
        } else if (event.key === 'Home') {
            nextIndex = 0
        } else if (event.key === 'End') {
            nextIndex = optionElements.length - 1
        } else if (event.key === 'PageDown') {
            nextIndex = Math.min(currentIndex + 10, optionElements.length - 1)
        } else if (event.key === 'PageUp') {
            nextIndex = Math.max(currentIndex - 10, 0)
        }

        if (nextIndex !== undefined) {
            event.preventDefault()
            focusOptionAt(nextIndex)
        }
    }

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
                onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        event.preventDefault()
                        if (!isOpen) onToggle()
                    }
                }}
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
                        ref={listboxRef}
                        role="listbox"
                        aria-label={label}
                        onKeyDown={handleOptionKeyDown}
                        className="space-y-1"
                    >
                        {options.map((option, index) => (
                            <button
                                key={option}
                                type="button"
                                role="option"
                                aria-selected={option === value}
                                tabIndex={
                                    option === value || (!value && index === 0)
                                        ? 0
                                        : -1
                                }
                                disabled={disabled || readOnly}
                                onClick={() => {
                                    onSelect(option)
                                    focusTrigger()
                                }}
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
                        <span id={hourPartLabelId} className="sr-only">
                            {resolvedMessages.hourSelect}
                        </span>
                        <span id={minutePartLabelId} className="sr-only">
                            {resolvedMessages.minuteSelect}
                        </span>
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
                                ...hourPartAria,
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
                                ...minutePartAria,
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
