import { ErrorTooltip } from './ErrorTooltip.tsx'
import { forwardRef } from 'react'
import useTextareaLogic from '../../Hooks/Inputs/useTextareaLogic.ts'
import type { TextareaComponentProps } from '../../Types/Textarea.types.ts'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaComponentProps>(
    function Textarea(props, ref) {
        const {
            state,
            handler,
            refs: { field: fieldRef },
        } = useTextareaLogic(props, ref)
        const {
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
        } = state

        return (
            <div className={`group min-w-0 ${classNames.root ?? 'w-full'}`}>
                {hasLabel && (
                    <label
                        id={`${fieldId}-label`}
                        htmlFor={fieldId}
                        className={
                            classNames.label ??
                            `mb-2 block text-sm font-medium ${design.labelText}`
                        }
                    >
                        {label}
                    </label>
                )}

                <div className={`relative ${classNames.wrapper ?? ''}`}>
                    {hasLeftIcon && (
                        <div
                            className={`absolute left-0 top-4 z-10 flex items-start ${classNames.leading ?? 'pl-4'}`}
                        >
                            {state.hasError ? (
                                <ErrorTooltip
                                    content={state.error ?? ''}
                                    className={`h-5 w-5 ${design.errorText}`}
                                />
                            ) : (
                                <span
                                    className={`flex items-center [&>svg]:h-5 [&>svg]:w-5 ${classNames.leading === undefined ? `${design.iconColor} ${design.iconFocus} transition-colors` : ''}`}
                                >
                                    {icon}
                                </span>
                            )}
                        </div>
                    )}

                    <textarea
                        {...nativeProps}
                        id={fieldId}
                        ref={fieldRef}
                        rows={rows}
                        value={state.safeValue}
                        onChange={handler.handleInputChange}
                        onFocus={handler.handleFocus}
                        onBlur={handler.handleBlur}
                        onInvalid={handler.handleInvalid}
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
                            state.hasError || ariaInvalid || undefined
                        }
                        aria-labelledby={labelledBy}
                        aria-required={
                            disabled
                                ? undefined
                                : nativeRequired || ariaRequired
                        }
                        style={{
                            paddingLeft: hasLeftIcon
                                ? 44
                                : classNames.control === undefined
                                  ? 16
                                  : undefined,
                            ...nativeProps.style,
                            paddingRight:
                                state.effectiveShowLength || showLength
                                    ? `${state.dynamicPaddingRight}px`
                                    : classNames.control === undefined
                                      ? 16
                                      : nativeProps.style?.paddingRight,
                        }}
                        className={fieldClassName}
                    />

                    {(state.effectiveShowLength || showLength) && (
                        <div
                            className={`pointer-events-none absolute bottom-0 right-0 z-10 ${
                                classNames.counter ??
                                `rounded-br-xl rounded-tl-xl border p-1 text-[10px] font-medium uppercase tracking-wider transition-[background-color,border-color,color] ${design.counterBg} ${
                                    state.hasError
                                        ? `${design.errorBorder} ${design.errorText} peer-focus:${design.errorBorder}`
                                        : `${design.border} ${design.counterText} ${design.counterBorderFocus}`
                                }`
                            }`}
                        >
                            {state.counterText}
                        </div>
                    )}
                </div>

                {hasDescription && (
                    <p
                        id={descriptionId}
                        className={
                            classNames.description ??
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
                            classNames.error ??
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
