import type { CustomDesign } from '../shared/Inputs/Types/InputShared.types.ts'

export const DESIGN_CONFIG = {
    bg: 'bg-rentner-control',
    border: 'border-rentner-border',
    text: 'text-rentner-foreground',
    labelText: 'text-rentner-muted',
    placeholder: 'placeholder-rentner-muted',
    focusRing: 'focus:ring-rentner-accent',
    focusBorder: 'focus:border-rentner-accent',
    errorBorder: 'border-rentner-danger',
    errorRing: 'focus:ring-rentner-danger',
    errorRingBase: 'ring-rentner-danger',
    errorText: 'text-rentner-danger',
    iconColor: 'text-rentner-muted',
    iconFocus: 'group-focus-within:text-rentner-accent',
    counterBg: 'bg-rentner-control',
    counterText: 'text-rentner-accent',
    counterBorderFocus:
        'peer-focus:border-r-rentner-accent peer-focus:border-b-rentner-accent peer-focus:border-t-rentner-border peer-focus:border-l-rentner-border',
    passwordStrengthTrack: 'bg-rentner-border',
    passwordStrengthText: 'text-rentner-muted',
    passwordStrengthWeak: 'bg-gradient-to-r from-red-500 to-orange-500',
    passwordStrengthFair: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    passwordStrengthGood: 'bg-gradient-to-r from-yellow-400 to-lime-400',
    passwordStrengthStrong: 'bg-gradient-to-r from-lime-400 to-green-500',
} satisfies Required<CustomDesign>
