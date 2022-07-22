
import Price from "./price";
import AttributeSet from "./AttributeSet";
import { Category } from "./Category";

interface Product {
    prices: Array<Price>;
    category: Category;
    description: String;
    gallery: Array<String>;
    attributes: Array<AttributeSet>;
    inStock: Boolean;
    brand: String;
    id: String;

}

export default Product;
