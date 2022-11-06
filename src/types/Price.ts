import { Currency } from "./Category";

interface Price {
    currency: Currency,
    amount: Number,
    label: string
}

export default Price;
