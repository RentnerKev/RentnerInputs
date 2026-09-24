import { AlertCircle } from 'lucide-react'
import { CustomTooltip } from '@rentnerkev/tooltips'
import { forwardRef, useId } from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import { useInputDefaults } from '../../InputProvider.js'
import { mergeAriaDescribedBy } from '../../Utils/fieldA11y.utils.js'
import useTextareaLogic from '../../Hooks/Inputs/useTextarea.logic.js'
import type { TextareaComponentProps } from '../../Types/Textarea.types.js'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaComponentProps>(
    function Textarea(props, ref) {
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
        const logic = useTextareaLogic(props, ref)
        const generatedId = useId()
        const fieldId = nativeProps.id ?? generatedId
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
            hasLabel ? `${fieldId}-label` : undefined,
        )
        const defaults = useInputDefaults()
        const design = {
            ...DESIGN_CONFIG,
            ...defaults.customDesign,
            ...customDesign,
        }
        const fieldClasses =
            className ??
            defaults.classNames?.textarea ??
            'w-full py-3 rounded-xl'
        const hasLeftIcon = Boolean(icon || logic.state.hasError)
        const fieldClassName = `peer block min-h-28 resize-y ${hasLeftIcon ? 'pl-11' : 'pl-4'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-[background-color,border-color,box-shadow,color] ${fieldClasses} ${design.bg} border ${design.text} ${design.placeholder} ${
            logic.state.hasError
                ? `${design.errorBorder} focus:ring-2 ${design.errorRing}`
                : `${design.border} focus:ring-2 ${design.focusRing} ${design.focusBorder}`
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

        return (
            <div className="group min-w-0 w-full">
                {hasLabel && (
                    <label
                        id={`${fieldId}-label`}
                        htmlFor={fieldId}
                        className={`mb-2 block text-sm font-medium ${design.labelText}`}
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {hasLeftIcon && (
                        <div className="absolute left-0 top-4 z-10 flex items-start pl-4">
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
                                    {icon}
                                </span>
                            )}
                        </div>
                    )}

                    <textarea
                        {...nativeProps}
                        id={fieldId}
                        ref={logic.ref.field}
                        rows={rows}
                        value={logic.state.safeValue}
                        onChange={logic.handler.handleInputChange}
                        onFocus={logic.handler.handleFocus}
                        onBlur={logic.handler.handleBlur}
                        onInvalid={logic.handler.handleInvalid}
                        maxLength={maxLength}
                        minLength={minLength}
                        disabled={disabled}
                        required={
                            error === undefined ? nativeRequired : undefined
                        }
                        aria-describedby={describedBy}
                        aria-errormessage={
                            hasVisibleError ? errorId : ariaErrorMessage
                        }
                        aria-invalid={
                            logic.state.hasError || ariaInvalid || undefined
                        }
                        aria-labelledby={labelledBy}
                        aria-required={
                            disabled
                                ? undefined
                                : error === undefined
                                  ? nativeRequired || ariaRequired || undefined
                                  : ariaRequired
                        }
                        style={{
                            paddingLeft: hasLeftIcon ? 44 : 16,
                            ...nativeProps.style,
                            paddingRight: `${logic.state.dynamicPaddingRight}px`,
                        }}
                        className={fieldClassName}
                    />

                    {(logic.state.effectiveShowLength || showLength) && (
                        <div
                            className={`pointer-events-none absolute bottom-0 right-0 z-10 rounded-br-xl rounded-tl-xl border p-1 text-[10px] font-medium uppercase tracking-wider transition-[background-color,border-color,color] ${design.counterBg} ${
                                logic.state.hasError
                                    ? `${design.errorBorder} ${design.errorText} peer-focus:${design.errorBorder}`
                                    : `${design.border} ${design.counterText} ${design.counterBorderFocus}`
                            }`}
                        >
                            {logic.state.counterText}
                        </div>
                    )}
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
