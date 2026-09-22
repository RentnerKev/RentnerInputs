import type { CustomDesign } from '../Types/InputShared.types.js'

export const DESIGN_CONFIG = {
    bg: 'bg-input-dark',
    border: 'border-border-dark',
    text: 'text-white',
    labelText: 'text-secondary-text',
    placeholder: 'placeholder-gray-400',
    focusRing: 'focus:ring-primary/50',
    focusBorder: 'focus:border-primary',
    errorBorder: 'border-red-500',
    errorRing: 'focus:ring-red-500/50',
    errorText: 'text-red-400',
    iconColor: 'text-gray-500',
    iconFocus: 'group-focus-within:text-primary',
    counterBg: 'bg-input-dark',
    counterText: 'text-primary',
    counterBorderFocus:
        'peer-focus:border-r-primary peer-focus:border-b-primary peer-focus:border-t-border-dark peer-focus:border-l-border-dark',
    passwordStrengthTrack: 'bg-border-dark',
    passwordStrengthText: 'text-secondary-text',
    passwordStrengthWeak: 'bg-gradient-to-r from-red-500 to-orange-500',
    passwordStrengthFair: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    passwordStrengthGood: 'bg-gradient-to-r from-yellow-400 to-lime-400',
    passwordStrengthStrong: 'bg-gradient-to-r from-lime-400 to-green-500',
} satisfies Required<CustomDesign>
