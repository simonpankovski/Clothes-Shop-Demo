
import Price from "./Price";
import AttributeSet from "./AttributeSet";
import { Category } from "./Category";
import { DeepReadonlyArray } from "@tilework/opus";

interface Product {
    prices: Array<Price>;
    description?: string;
    gallery: Array<String>;
    attributes: DeepReadonlyArray<AttributeSet>;
    inStock: Boolean;
    brand: String;
    id: String;
}

export default Product;
