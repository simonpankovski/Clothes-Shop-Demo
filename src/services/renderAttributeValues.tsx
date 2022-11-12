import AttributeSet from "../types/AttributeSet"
import { selectItem } from "./selectItem";
export function renderAttributeValues(attribute: AttributeSet, selectedAttributes: Object, setSelectedAttributes: Function) {
    let attributeValues = attribute.items.map((item, index) => {
        return (
            <button
                role="radio"
                aria-checked="false"
                onClick={(event) => {
                    selectItem(event, index, selectedAttributes, setSelectedAttributes);
                }}
                key={index}
                style={
                    attribute.type === "text"
                        ? {}
                        : {
                              background: item.value,
                              border: "1px solid",
                              aspectRatio: "1/1",
                              borderColor: "var(--primary-text-color)",
                          }
                }
                data-value={item.value}
                data-attribute-id={attribute.id}
                data-item-id={item.id}
            >
                {attribute.type === "text" ? item.value : ""}
            </button>
        );
    });
    return attributeValues;
}
