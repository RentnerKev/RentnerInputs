import { AlertCircle } from 'lucide-react'
import { CustomTooltip } from '../../Internal/Tooltip.js'
import { forwardRef, useId } from 'react'
import { DESIGN_CONFIG } from '../../Config/design.config.js'
import useTextareaLogic from '../../Hooks/Inputs/useTextarea.logic.js'
import type { TextareaProps } from '../../Types/Textarea.types.js'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    function Textarea(
        {
            type: _type,
            value: _value,
            onChange: _onChange,
            onFocus: _onFocus,
            onBlur: _onBlur,
            onInvalid: _onInvalid,
            label,
            icon,
            customDesign,
            showLength,
            maxLength,
            minLength,
            className = 'w-full py-3 rounded-xl',
            disabled,
            rows = 4,
            ...nativeProps
        },
        ref,
    ) {
        void _type
        const props = {
            ...nativeProps,
            value: _value,
            onChange: _onChange,
            onFocus: _onFocus,
            onBlur: _onBlur,
            onInvalid: _onInvalid,
            label,
            icon,
            customDesign,
            showLength,
            maxLength,
            minLength,
            className,
            disabled,
            rows,
        } satisfies TextareaProps
        const logic = useTextareaLogic(props, ref)
        const generatedId = useId()
        const fieldId = nativeProps.id ?? generatedId
        const design = { ...DESIGN_CONFIG, ...customDesign }
        const hasLeftIcon = Boolean(icon || logic.state.hasError)
        const fieldClassName = `peer block min-h-28 resize-y ${hasLeftIcon ? 'pl-11' : 'pl-4'} focus:outline-none transition-all ${className} ${design.bg} border ${design.text} ${design.placeholder} ${
            logic.state.hasError
                ? `${design.errorBorder} focus:ring-2 ${design.errorRing}`
                : `${design.border} focus:ring-2 ${design.focusRing} ${design.focusBorder}`
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

        return (
            <div className="group w-full">
                {label && (
                    <label
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
                        aria-invalid={logic.state.hasError || undefined}
                        style={{
                            ...nativeProps.style,
                            paddingRight: `${logic.state.dynamicPaddingRight}px`,
                        }}
                        className={fieldClassName}
                    />

                    {(logic.state.effectiveShowLength || showLength) && (
                        <div
                            className={`pointer-events-none absolute bottom-0 right-0 z-10 rounded-br-xl rounded-tl-xl border p-1 text-[10px] font-medium uppercase tracking-wider transition-all ${design.counterBg} ${
                                logic.state.hasError
                                    ? `${design.errorBorder} ${design.errorText} peer-focus:${design.errorBorder}`
                                    : `${design.border} ${design.counterText} ${design.counterBorderFocus}`
                            }`}
                        >
                            {logic.state.counterText}
                        </div>
                    )}
                </div>
            </div>
        )
    },
)
