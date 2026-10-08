import { useState } from 'react'
import type { RefCallback } from 'react'
import type { RefFixtureLogicResult } from '../Types/RefFixture.types.ts'
window.refTestEvents = []
window.refTestNodes = {}

function makeCleanupRef<Element extends HTMLElement>(
    name: string,
): RefCallback<Element> {
    return (element) => {
        if (element === null) {
            window.refTestEvents.push(`${name}:null`)
            window.refTestNodes[name] = null
            return
        }

        window.refTestEvents.push(`${name}:attach`)
        window.refTestNodes[name] = element
        return () => {
            window.refTestEvents.push(`${name}:cleanup`)
            window.refTestNodes[name] = null
        }
    }
}

function makeLegacyRef<Element extends HTMLElement>(
    name: string,
): RefCallback<Element> {
    return (element) => {
        window.refTestEvents.push(`${name}:${element ? 'attach' : 'null'}`)
        window.refTestNodes[name] = element
    }
}

const textRef = makeCleanupRef<HTMLInputElement>('text-public')
const textTriggerRef = makeLegacyRef<HTMLInputElement>('text-trigger')
const timeRef = makeCleanupRef<HTMLInputElement>('time-hidden')
const hourTriggerRef = makeLegacyRef<HTMLButtonElement>('time-hour-trigger')
const otpFirstRef = makeCleanupRef<HTMLInputElement>('otp-first')
const otpSecondRef = makeCleanupRef<HTMLInputElement>('otp-second')

function handleUnmount() {
    window.unmountRefFixture()
}
function handleIgnoreChange() {}

export function useRefFixtureLogic(): RefFixtureLogicResult {
    const [text, setText] = useState('')
    const [time, setTime] = useState('09:00')
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
    const [otpLength, setOtpLength] = useState(6)
    const [useSecondOtpRef, setUseSecondOtpRef] = useState(false)
    const [revision, setRevision] = useState(0)
    const currentOtpRef = useSecondOtpRef ? otpSecondRef : otpFirstRef

    function handleRerender() {
        setRevision((value) => value + 1)
    }
    function handleChangeLength() {
        setOtpLength((value) => (value === 6 ? 4 : 6))
    }
    function handleChangeRef() {
        setUseSecondOtpRef((value) => !value)
    }
    return {
        state: { text, time, otp, otpLength, revision },
        setter: { setText, setTime, setOtp },
        refs: {
            textRef,
            textTriggerRef,
            timeRef,
            hourTriggerRef,
            currentOtpRef,
        },
        handler: {
            handleRerender,
            handleChangeLength,
            handleChangeRef,
            handleUnmount,
            handleIgnoreChange,
        },
    }
}
