import type { Dispatch, RefCallback, SetStateAction } from 'react'
declare global {
    interface Window {
        refTestEvents: string[]
        refTestNodes: Record<string, HTMLElement | null>
        unmountRefFixture: () => void
    }
}

export type RefFixtureLogicResult = {
    state: {
        text: string
        time: string
        otp: string[]
        otpLength: number
        revision: number
    }
    setter: {
        setText: Dispatch<SetStateAction<string>>
        setTime: Dispatch<SetStateAction<string>>
        setOtp: Dispatch<SetStateAction<string[]>>
    }
    refs: {
        textRef: RefCallback<HTMLInputElement>
        textTriggerRef: RefCallback<HTMLInputElement>
        timeRef: RefCallback<HTMLInputElement>
        hourTriggerRef: RefCallback<HTMLButtonElement>
        currentOtpRef: RefCallback<HTMLInputElement>
    }
    handler: {
        handleRerender: () => void
        handleChangeLength: () => void
        handleChangeRef: () => void
        handleUnmount: () => void
        handleIgnoreChange: () => void
    }
}
