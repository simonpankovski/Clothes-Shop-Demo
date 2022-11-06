
import Attribute from "./Attribute";

export enum AttributeType {
    text = 'text',
    swatch = 'swatch'
}

export default interface AttributeSet {
    id: String;
    name: String;
    items: Array<Attribute>;
    type: AttributeType.text;
}