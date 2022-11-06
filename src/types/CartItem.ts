import { DeepReadonlyArray } from "@tilework/opus";
import Attribute from "./Attribute";
import AttributeSet from "./AttributeSet";
import Price from "./Price";

export default interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: [string];
  description?: string;
  category?: string;
  attributes: DeepReadonlyArray<AttributeSet>;
  prices: Array<Price>;
  brand: string;
  selectedGalleryIndex?: number;
  selectedAttributes?: Array<Attribute>;
  quantity?: number;
}
