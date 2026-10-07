import { useState } from 'react'
import type { RefCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { OtpInput, TextInput, TimeInput } from '../../src'
import { TooltipProvider } from '@rentnerkev/tooltips'

declare global {
    interface Window {
        refTestEvents: string[]
        refTestNodes: Record<string, HTMLElement | null>
        unmountRefFixture: () => void
    }
}

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

function RefFixture() {
    const [text, setText] = useState('')
    const [time, setTime] = useState('09:00')
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
    const [otpLength, setOtpLength] = useState(6)
    const [useSecondOtpRef, setUseSecondOtpRef] = useState(false)
    const [revision, setRevision] = useState(0)
    const currentOtpRef = useSecondOtpRef ? otpSecondRef : otpFirstRef

    return (
        <main>
            <TooltipProvider delayDuration={0}>
                <TextInput
                    id="provider-error"
                    label="Provider error"
                    value=""
                    error="Provider tooltip error"
                    onValueChange={() => undefined}
                />
            </TooltipProvider>
            <TextInput
                id="ref-text"
                label="Text"
                value={text}
                onValueChange={setText}
                ref={textRef}
                triggerRef={textTriggerRef}
            />
            <TimeInput
                id="ref-time"
                label="Time"
                value={time}
                onValueChange={setTime}
                ref={timeRef}
                triggerRef={hourTriggerRef}
            />
            <OtpInput
                id="ref-otp"
                label="Code"
                value={otp}
                length={otpLength}
                onValueChange={setOtp}
                ref={currentOtpRef}
                triggerRef={currentOtpRef}
            />
            <output data-testid="revision">{revision}</output>
            <button
                type="button"
                data-testid="rerender"
                onClick={() => setRevision((current) => current + 1)}
            >
                Rerender
            </button>
            <button
                type="button"
                data-testid="change-otp-length"
                onClick={() =>
                    setOtpLength((current) => (current === 6 ? 4 : 6))
                }
            >
                Change OTP length
            </button>
            <button
                type="button"
                data-testid="change-otp-ref"
                onClick={() => setUseSecondOtpRef((current) => !current)}
            >
                Change OTP ref
            </button>
            <button
                type="button"
                data-testid="unmount"
                onClick={() => window.unmountRefFixture()}
            >
                Unmount
            </button>
        </main>
    )
}

const root = createRoot(document.getElementById('root')!)
root.render(<RefFixture />)
window.unmountRefFixture = () => root.unmount()
