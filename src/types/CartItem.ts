import Attribute from "./Attribute";
import AttributeSet from "./AttributeSet";
import Price from "./Price";

export default interface Product {
    id: String
    name: String
    inStock: Boolean
    gallery: [String]
    description: String
    category: String
    attributes: [AttributeSet]
    prices: [Price]
    brand: String,
    selectedGalleryIndex?: Number,
    selectedAttributes?: Array<Attribute>,
    quantity?: Number
}