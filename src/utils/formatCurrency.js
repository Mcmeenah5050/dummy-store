const currencyFMT= new Intl.NumberFormat(undefined, {
    currency: "GBP",
    style: "currency",
// maximumFractionDigits: 0,
});

export function formatCurrency(price) {
    return currencyFMT.format(price);
}
