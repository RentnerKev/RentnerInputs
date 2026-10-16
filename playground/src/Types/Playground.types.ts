import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { OtpInputStatus } from '../../../src/shared/Inputs/Types/OtpInput.types.ts'
export type PlaygroundLogicResult = {
    refs: { setShadowHost: import('react').RefCallback<HTMLDivElement> }
    state: {
        timeBlurs: number
        portalContainer: HTMLElement | ShadowRoot | null | undefined
        numericValue: number | null
        readOnlyTime: boolean
        email: string
        phone: string
        amount: string
        limitedAmount: string
        username: string
        money: string
        password: string
        message: string
        appointmentTime: string
        otpDigits: string[]
        otpStatus: OtpInputStatus
    }
    setter: {
        setNumericValue: Dispatch<SetStateAction<number | null>>
        setEmail: Dispatch<SetStateAction<string>>
        setPhone: Dispatch<SetStateAction<string>>
        setAmount: Dispatch<SetStateAction<string>>
        setLimitedAmount: Dispatch<SetStateAction<string>>
        setUsername: Dispatch<SetStateAction<string>>
        setMoney: Dispatch<SetStateAction<string>>
        setPassword: Dispatch<SetStateAction<string>>
        setMessage: Dispatch<SetStateAction<string>>
        setAppointmentTime: Dispatch<SetStateAction<string>>
        setOtpDigits: Dispatch<SetStateAction<string[]>>
        setOtpStatus: Dispatch<SetStateAction<OtpInputStatus>>
    }
    handler: {
        handleTimeBlur: import('react').FocusEventHandler<HTMLInputElement>
        handleSubmit: (event: FormEvent<HTMLFormElement>) => void
        handleOtpChange: (digits: string[]) => void
        handleOtpError: () => void
        handleOtpSuccess: () => void
        handleOtpReset: () => void
    }
}
