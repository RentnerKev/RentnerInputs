/* oxlint-disable jsx-a11y/prefer-tag-over-role -- The custom listbox owns roving option-button focus; native select/option and fieldset would change keyboard/layout semantics. */
import useTimeDropdownLogic from '../../Hooks/Inputs/useTimeDropdownLogic.ts'
import type { TimeDropdownProps } from '../../Types/TimeDropdown.types.ts'
import { ChevronDown, Clock } from 'lucide-react'
import { ErrorTooltip } from './ErrorTooltip.tsx'
import { forwardRef } from 'react'
import useTimeInputLogic from '../../Hooks/Inputs/useTimeInputLogic.ts'
import type { TimeInputComponentProps } from '../../Types/TimeInput.types.ts'

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
    onClose,
    onSelect,
}: TimeDropdownProps) {
    const { state, handler, refs } = useTimeDropdownLogic({
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
        onClose,
        onSelect,
    })
    const {
        labelledBy,
        fallbackLabel,
        accessibleName,
        generatedLabelId,
        valueId,
    } = state
    const { listboxRef } = refs
    const { handleBlur, handleOptionKeyDown } = handler
    return (
        <div className="relative flex-1" onBlur={handleBlur}>
            {!labelledBy && (
                <span id={generatedLabelId} className="sr-only">
                    {fallbackLabel}
                </span>
            )}
            <button
                ref={buttonRef}
                id={id}
                type="button"
                {...fieldAria}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={undefined}
                aria-labelledby={accessibleName}
                aria-readonly={undefined}
                aria-disabled={
                    disabled ||
                    readOnly ||
                    fieldAria?.['aria-disabled'] ||
                    undefined
                }
                disabled={disabled}
                onKeyDown={handler.handleTriggerKeyDown}
                onClick={onToggle}
                className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-border-dark bg-background-dark/60 px-3 text-left text-sm font-semibold text-white transition-colors hover:border-secondary-text/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span
                    id={value ? valueId : undefined}
                    className={value ? 'text-white' : 'text-gray-400'}
                >
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
                        tabIndex={-1}
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
                                onClick={() => handler.handleSelect(option)}
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
    function TimeInput(props, ref) {
        const {
            state,
            handler,
            refs: { field: fieldRef, wrapper: wrapperRef, trigger: triggerRef },
            setter,
        } = useTimeInputLogic(props, ref)
        const {
            inputProps,
            label,
            icon,
            description,
            externalError: error,
            disabled,
            nativeRequired,
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
        } = state

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

                <div ref={wrapperRef} className="relative">
                    {hasLeftIcon && (
                        <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                            {state.hasError ? (
                                <ErrorTooltip
                                    content={state.error ?? ''}
                                    className={`h-5 w-5 ${design.errorText}`}
                                />
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
                        ref={fieldRef}
                        type="time"
                        value={state.safeValue}
                        onChange={handler.handleNativeChange}
                        onFocus={handler.handleFocus}
                        onBlur={handler.handleBlur}
                        onInvalid={handler.handleInvalid}
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
                            buttonRef={triggerRef}
                            label={resolvedMessages.hourSelect}
                            value={state.selectedHour}
                            placeholder={resolvedMessages.hourPlaceholder}
                            options={state.hours}
                            isOpen={
                                state.isHourDropdownOpen &&
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
                            onToggle={handler.toggleHourDropdown}
                            onClose={() => setter.setIsHourDropdownOpen(false)}
                            onSelect={handler.selectHour}
                        />
                        <span className="text-lg font-semibold text-primary">
                            :
                        </span>
                        <TimeDropdown
                            label={resolvedMessages.minuteSelect}
                            value={state.selectedMinute}
                            placeholder={resolvedMessages.minutePlaceholder}
                            options={state.minutes}
                            isOpen={
                                state.isMinuteDropdownOpen &&
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
                            onToggle={handler.toggleMinuteDropdown}
                            onClose={() =>
                                setter.setIsMinuteDropdownOpen(false)
                            }
                            onSelect={handler.selectMinute}
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
                        {state.error}
                    </p>
                )}
            </div>
        )
    },
)
