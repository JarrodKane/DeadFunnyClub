// Helper to normalize strings for comparison (e.g. "Fitzroy North" -> "fitzroy-north")
export const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');