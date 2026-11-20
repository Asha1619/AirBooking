export function formatDateTime(value) {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

export function formatCurrency(value) {
    const amount = Number(value);

    if (Number.isNaN(amount)) return '—';

    return `₹${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
