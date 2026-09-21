import { AlertCircle, ChevronDown, Clock } from 'lucide-react'
import { CustomTooltip } from '../../Internal/Tooltip.js'
import { forwardRef, useId } from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import useTimeInputLogic from '../../Hooks/Inputs/useTimeInput.logic.js'
import type { TimeInputProps } from '../../Types/TimeInput.types.js'

interface TimeDropdownProps {
    label: string
    value: string
    placeholder: string
    options: string[]
    isOpen: boolean
    disabled?: boolean
    onToggle: () => void
    onSelect: (value: string) => void
}

function TimeDropdown({
    label,
    value,
    placeholder,
    options,
    isOpen,
    disabled,
    onToggle,
    onSelect,
}: TimeDropdownProps) {
    return (
        <div className="relative flex-1">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
                onClick={onToggle}
                className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-border-dark bg-background-dark/60 px-3 text-left text-sm font-semibold text-white transition-colors hover:border-secondary-text/70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className={value ? 'text-white' : 'text-gray-600'}>
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
                                onClick={() => onSelect(option)}
                                className={`flex w-full cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none ${
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

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
    function TimeInput(
        {
            type: _type,
            label,
            icon,
            customDesign,
            className = 'w-full py-3 rounded-xl',
            disabled,
            showLength: _showLength,
            minuteStep,
            ...props
        },
        ref,
    ) {
        void [_type, _showLength]
        const logic = useTimeInputLogic(
            { ...props, icon, customDesign, className, disabled, minuteStep },
            ref,
        )
        const generatedId = useId()
        const fieldId = props.id ?? generatedId
        const labelId = `${fieldId}-label`
        const design = { ...DESIGN_CONFIG, ...customDesign }
        const hasLeftIcon = Boolean(icon || logic.state.hasError)
        const fieldClassName = `peer flex min-h-14 items-center gap-3 ${hasLeftIcon ? 'pl-11' : 'pl-4'} pr-4 transition-all ${className} ${design.bg} border ${design.text} ${
            logic.state.hasError
                ? `${design.errorBorder} ring-2 ${design.errorRing.replace('focus:', '')}`
                : design.border
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

        return (
            <div className="group w-full">
                {label && (
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
                        {...props}
                        id={fieldId}
                        ref={logic.ref.field}
                        type="time"
                        value={logic.state.safeValue}
                        onChange={logic.handler.handleNativeChange}
                        onFocus={logic.handler.handleFocus}
                        onBlur={logic.handler.handleBlur}
                        onInvalid={logic.handler.handleInvalid}
                        disabled={disabled}
                        aria-hidden="true"
                        tabIndex={-1}
                        className="pointer-events-none absolute h-px w-px opacity-0"
                    />

                    <div
                        className={fieldClassName}
                        aria-invalid={logic.state.hasError || undefined}
                        aria-labelledby={label ? labelId : undefined}
                    >
                        <TimeDropdown
                            label="Stunde auswählen"
                            value={logic.state.selectedHour}
                            placeholder="Stunde"
                            options={logic.state.hours}
                            isOpen={logic.state.isHourDropdownOpen}
                            disabled={disabled}
                            onToggle={logic.handler.toggleHourDropdown}
                            onSelect={logic.handler.selectHour}
                        />
                        <span className="text-lg font-semibold text-primary">
                            :
                        </span>
                        <TimeDropdown
                            label="Minute auswählen"
                            value={logic.state.selectedMinute}
                            placeholder="Minute"
                            options={logic.state.minutes}
                            isOpen={logic.state.isMinuteDropdownOpen}
                            disabled={disabled}
                            onToggle={logic.handler.toggleMinuteDropdown}
                            onSelect={logic.handler.selectMinute}
                        />
                    </div>
                </div>
            </div>
        )
    },
)
