import type { OtpInputLogicResult } from '../../Types/OtpInputLogicResult.types.js'
import { useCallback, useId, type Ref } from 'react'
import { DESIGN_CONFIG } from '../../../../config/inputDesign.config.js'
import useOtpField from './useOtpField.js'
import { useInputDefaults } from '../useInputDefaults.js'
import type { OtpInputProps } from '../../Types/OtpInput.types.js'
import { mergeAriaDescribedBy } from '../../../../lib/Inputs/fieldA11y.utils.js'
import { useComposedRefs } from '../useComposedRefs.js'

export default function useOtpInputLogic(
    props: OtpInputProps,
    ref: Ref<HTMLInputElement>,
): OtpInputLogicResult {
    const {
        id,
        name,
        value,
        onValueChange,
        onComplete,
        length,
        label,
        description,
        error,
        status,
        animated = true,
        showProgress = true,
        feedbackClassNames,
        required,
        disabled,
        readOnly,
        autoFocus,
        className,
        inputClassName,
        customDesign,
        triggerRef,
        locale,
        messages,
        validationMode,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
    } = props
    const defaults = useInputDefaults()
    const design = {
        ...DESIGN_CONFIG,
        ...defaults.customDesign,
        ...customDesign,
    }
    const logic = useOtpField({
        value,
        onValueChange,
        onComplete,
        length,
        required,
        disabled,
        readOnly,
        error,
        status,
        locale,
        messages,
        validationMode,
    })
    const {
        digits,
        code,
        digitCount,
        messages: resolvedMessages,
        resolvedError,
        hasError,
        visualStatus,
    } = logic.state
    const { validationInput, setDigitRef } = logic.refs
    const setFirstDigitRef = useCallback(
        (element: HTMLInputElement | null) => setDigitRef(0, element),
        [setDigitRef],
    )
    const firstDigitRef = useComposedRefs(setFirstDigitRef, ref, triggerRef)
    const {
        handleInvalid,
        handleGroupBlur,
        handleDigitChange,
        handleDigitKeyDown,
        handleDigitPaste,
    } = logic.handler
    const generatedId = useId()
    const groupId = id ?? `otp-${generatedId}`
    const labelId = `${groupId}-label`
    const descriptionId = `${groupId}-description`
    const errorId = `${groupId}-error`
    const successId = `${groupId}-success`
    const isSuccess = visualStatus === 'success'
    const focusClasses =
        feedbackClassNames?.focus ??
        (animated
            ? 'motion-safe:focus:-translate-y-1 motion-safe:focus:scale-[1.04] focus:shadow-lg'
            : 'focus:shadow-lg')
    const idleClasses = `${design.bg} ${design.text} ${design.border} ${design.focusBorder} ${design.focusRing} focus:shadow-primary/20`
    const filledClasses =
        feedbackClassNames?.filled ??
        `${design.bg} border-primary/60 text-primary ${design.focusBorder} ${design.focusRing} shadow-sm shadow-primary/10 focus:shadow-primary/25`
    const errorClasses =
        feedbackClassNames?.error ??
        `bg-red-500/10 ${design.errorBorder} ${design.errorText} ${design.errorRing} focus:shadow-red-500/20`
    const successClasses =
        feedbackClassNames?.success ??
        'border-emerald-400 bg-emerald-400/10 text-emerald-200 focus:ring-emerald-400/50 shadow-sm shadow-emerald-400/20 focus:shadow-emerald-400/25'
    const progressTrackClasses =
        feedbackClassNames?.progressTrack ?? 'bg-border-dark'
    const progressFilledClasses =
        feedbackClassNames?.progressFilled ??
        'bg-primary shadow-sm shadow-primary/40'
    const progressErrorClasses =
        feedbackClassNames?.progressError ?? 'bg-red-500'
    const progressSuccessClasses =
        feedbackClassNames?.progressSuccess ?? 'bg-emerald-400'
    const hasLabel = label !== undefined && label !== null && label !== false
    const hasDescription =
        description !== undefined &&
        description !== null &&
        description !== false
    const describedBy = mergeAriaDescribedBy(
        ariaDescribedBy,
        hasDescription ? descriptionId : undefined,
        hasError ? errorId : undefined,
        isSuccess ? successId : undefined,
    )
    const labelledBy = mergeAriaDescribedBy(
        ariaLabelledBy,
        hasLabel ? labelId : undefined,
    )

    return {
        state: {
            name,
            label,
            description,
            error,
            animated,
            showProgress,
            feedbackClassNames,
            required,
            disabled,
            readOnly,
            autoFocus,
            className,
            inputClassName,
            ariaLabel,
            defaults,
            design,
            digits,
            code,
            digitCount,
            resolvedMessages,
            resolvedError,
            hasError,
            visualStatus,
            groupId,
            labelId,
            descriptionId,
            errorId,
            successId,
            isSuccess,
            focusClasses,
            idleClasses,
            filledClasses,
            errorClasses,
            successClasses,
            progressTrackClasses,
            progressFilledClasses,
            progressErrorClasses,
            progressSuccessClasses,
            hasLabel,
            hasDescription,
            describedBy,
            labelledBy,
        },
        handler: {
            handleInvalid,
            handleGroupBlur,
            handleDigitChange,
            handleDigitKeyDown,
            handleDigitPaste,
        },
        refs: { validationInput, setDigitRef, firstDigitRef },
    }
}
