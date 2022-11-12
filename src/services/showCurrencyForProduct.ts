import Price from "../types/Price";

export default function showCurrencyForProduct(prices: Array<Price>, currencyLabel: string, currencySymbol: string) {
    const currentProductPrice = prices.find(
      (price) => price.currency.label ===  currencyLabel
    );
    const amount = currentProductPrice?.amount ?? 0;
    return  amount + " " +  currencySymbol;
  }