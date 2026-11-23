import { useInputDefaults } from './useInputDefaults.ts'
import type { InputVisualProps } from '../Types/InputShared.types.ts'

const EMPTY_CLASS_NAMES: NonNullable<InputVisualProps['classNames']> = {}

export function useInputPresentation(
    props: Pick<
        InputVisualProps,
        | 'controlSize'
        | 'classNames'
        | 'portalContainer'
        | 'portalClassName'
        | 'portalZIndex'
    >,
) {
    const defaults = useInputDefaults()
    const size = props.controlSize ?? defaults.controlSize
    const classNames =
        !defaults.classNames && !props.classNames
            ? EMPTY_CLASS_NAMES
            : !props.classNames
              ? defaults.classNames!
              : !defaults.classNames
                ? props.classNames
                : { ...defaults.classNames, ...props.classNames }
    return {
        state: {
            classNames,
            sizeClassName:
                size === 'sm'
                    ? 'h-rentner-control-sm'
                    : size === 'md'
                      ? 'h-rentner-control-md'
                      : size === 'lg'
                        ? 'h-rentner-control-lg'
                        : '',
            portalContainer:
                props.portalContainer === undefined
                    ? defaults.portalContainer
                    : props.portalContainer,
            portalClassName: props.portalClassName ?? defaults.portalClassName,
            portalZIndex: props.portalZIndex ?? defaults.portalZIndex,
        },
    }
}
