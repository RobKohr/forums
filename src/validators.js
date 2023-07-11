export const required = (value) => (value.length === 0 ? { isMissing: true } : null);
