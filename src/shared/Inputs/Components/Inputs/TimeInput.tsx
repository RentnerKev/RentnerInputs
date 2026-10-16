/* oxlint-disable jsx-a11y/prefer-tag-over-role -- The custom listbox owns roving option-button focus; native select/option and fieldset would change keyboard/layout semantics. */
import { createPortal } from 'react-dom'
import { useInputPresentation } from '../../Hooks/useInputPresentation.ts'
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
    fieldOwnerId,
    portalContainer,
    portalClassName,
    portalZIndex,
    controlClassName,
    controlSizeClassName,
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
    const { listboxRef, rootRef } = refs
    const { handleBlur, handleOptionKeyDown } = handler
    return (
        <div ref={rootRef} className="relative flex-1" onBlur={handleBlur}>
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
                onMouseDown={handler.handleTriggerMouseDown}
                onKeyDown={handler.handleTriggerKeyDown}
                onClick={onToggle}
                className={`flex w-full cursor-pointer items-center justify-between focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${controlSizeClassName || 'h-11'} ${controlClassName ?? 'rounded-lg border border-rentner-border bg-rentner-control px-3 text-left text-sm font-semibold text-rentner-foreground transition-colors focus-visible:ring-rentner-accent'}`}
            >
                <span
                    id={value ? valueId : undefined}
                    className={
                        !value && controlClassName === undefined
                            ? 'text-rentner-muted'
                            : undefined
                    }
                >
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 transition-transform ${controlClassName === undefined ? 'text-rentner-accent' : ''} ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        data-rentner-time-owner={fieldOwnerId}
                        className={`fixed overflow-y-auto rounded-lg border border-rentner-border bg-rentner-surface p-1 shadow-xl ${portalClassName ?? ''}`}
                        style={{
                            ...state.position,
                            zIndex:
                                portalZIndex ?? 'var(--rentner-overlay-z, 30)',
                        }}
                    >
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
                                        option === value ||
                                        (!value && index === 0)
                                            ? 0
                                            : -1
                                    }
                                    disabled={disabled || readOnly}
                                    onClick={() => handler.handleSelect(option)}
                                    className={`flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                                        option === value
                                            ? 'bg-rentner-accent text-rentner-accent-foreground'
                                            : 'text-rentner-muted hover:bg-rentner-control hover:text-rentner-foreground'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>,
                    portalContainer ?? document.body,
                )}
        </div>
    )
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputComponentProps>(
    function TimeInput(props, ref) {
        const presentation = useInputPresentation(props).state
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
            <div className={presentation.classNames.root ?? 'group w-full'}>
                {hasLabel && (
                    <label
                        id={labelId}
                        htmlFor={fieldId}
                        className={
                            presentation.classNames.label ??
                            `mb-2 block text-sm font-medium ${design.labelText}`
                        }
                    >
                        {label}
                    </label>
                )}

                <div
                    ref={wrapperRef}
                    className="relative"
                    onBlurCapture={handler.handleFieldBlur}
                >
                    {hasLeftIcon && (
                        <div
                            className={`absolute inset-y-0 left-0 z-10 flex items-center ${presentation.classNames.leading ?? 'pl-4'}`}
                        >
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
                        className={`${fieldClassName} ${presentation.sizeClassName}`}
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
                            fieldOwnerId={fieldId}
                            portalContainer={presentation.portalContainer}
                            portalClassName={presentation.portalClassName}
                            portalZIndex={presentation.portalZIndex}
                            controlClassName={presentation.classNames.trailing}
                            controlSizeClassName={presentation.sizeClassName}
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
                            fieldOwnerId={fieldId}
                            portalContainer={presentation.portalContainer}
                            portalClassName={presentation.portalClassName}
                            portalZIndex={presentation.portalZIndex}
                            controlClassName={presentation.classNames.trailing}
                            controlSizeClassName={presentation.sizeClassName}
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
                        className={
                            presentation.classNames.description ??
                            'mt-1 text-xs text-rentner-muted'
                        }
                    >
                        {description}
                    </p>
                )}

                {hasVisibleError && (
                    <p
                        id={errorId}
                        aria-live="polite"
                        className={
                            presentation.classNames.error ??
                            `mt-1 text-xs ${design.errorText}`
                        }
                    >
                        {state.error}
                    </p>
                )}
            </div>
        )
    },
)
