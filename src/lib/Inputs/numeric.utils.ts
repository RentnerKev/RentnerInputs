/** Empty is null; incomplete, non-decimal, and non-finite drafts never become zero. */
export function parseNumericDraft(draft: string): number | null | undefined {
    const value = draft.trim().replace(',', '.')
    if (value === '') return null
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return undefined
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}
