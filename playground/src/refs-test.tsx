import { useRefFixtureLogic } from './Hooks/useRefFixtureLogic.ts'
import { createRoot } from 'react-dom/client'
import { OtpInput } from '../../src/shared/Inputs/Components/Inputs/OtpInput.tsx'
import { TextInput } from '../../src/shared/Inputs/Components/Inputs/TextInput.tsx'
import { TimeInput } from '../../src/shared/Inputs/Components/Inputs/TimeInput.tsx'
import { TooltipProvider } from '@rentnerkev/tooltips'

function RefFixture() {
    const {
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
    } = useRefFixtureLogic()
    return (
        <main>
            <TooltipProvider delayDuration={0}>
                <TextInput
                    id="provider-error"
                    label="Provider error"
                    value=""
                    error="Provider tooltip error"
                    onValueChange={handleIgnoreChange}
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
                onClick={handleRerender}
            >
                Rerender
            </button>
            <button
                type="button"
                data-testid="change-otp-length"
                onClick={handleChangeLength}
            >
                Change OTP length
            </button>
            <button
                type="button"
                data-testid="change-otp-ref"
                onClick={handleChangeRef}
            >
                Change OTP ref
            </button>
            <button type="button" data-testid="unmount" onClick={handleUnmount}>
                Unmount
            </button>
        </main>
    )
}

const root = createRoot(document.getElementById('root')!)
root.render(<RefFixture />)
window.unmountRefFixture = () => root.unmount()
