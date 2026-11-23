const NUMERIC_DRAFT_REGEX = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/

/** Empty is null; incomplete, non-decimal, and non-finite drafts never become zero. */
export function parseNumericDraft(draft: string): number | null | undefined {
    const trimmed = draft.trim()
    if (trimmed === '') return null
    const value = trimmed.includes(',') ? trimmed.replace(',', '.') : trimmed
    if (!NUMERIC_DRAFT_REGEX.test(value)) return undefined
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}
