import CartItem from "../types/CartItem";

export default function getPriceAmountForProductPerLabel(product: CartItem, currencyLabel: string) {
    const prod = product.prices.find(
        (price) => price.currency.label === currencyLabel
    );
    return prod?.amount ?? 0;
}