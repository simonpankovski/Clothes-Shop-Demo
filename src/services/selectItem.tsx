import { useState } from "react";

export function selectItem(
    ev: React.MouseEvent<Element, MouseEvent>,
    index: number,
    selectedAttributes: Object, setSelectedAttributes: Function
) {
    const targetedElement = ev.target as HTMLElement;
    const key =
        targetedElement.attributes.getNamedItem("data-attribute-id")
            ?.nodeValue ?? "";
    const targetElementClasses = targetedElement.classList;
    if (
        targetElementClasses.contains("selected-text-attribute") ||
        targetElementClasses.contains("selected-swatch-attribute")
    ) {
        targetElementClasses.remove("selected-text-attribute");
        targetElementClasses.remove("selected-swatch-attribute");
        targetedElement.setAttribute("aria-checked", "false");
        let selectedAttributesClone: any =
            structuredClone(selectedAttributes);
        delete selectedAttributesClone[key];
        setSelectedAttributes(selectedAttributesClone);
        return;
    }
    const selectedAttributesClone = {
        ...selectedAttributes,
        [key]: index,
    };
    setSelectedAttributes(selectedAttributesClone);

    const targetParent = targetedElement.parentNode as HTMLElement;

    const parentNodeType =
        targetParent.attributes.getNamedItem("data-type")?.nodeValue;

    if (parentNodeType === "text") {
        Array.from(targetParent.children).forEach((child: any) => {
            child.classList.remove("selected-text-attribute");
            child.setAttribute("aria-checked", "false");
        });
        targetElementClasses.add("selected-text-attribute");
        targetedElement.setAttribute("aria-checked", "true");
    } else {
        Array.from(targetParent.children).forEach((child: any) => {
            child.classList.remove("selected-swatch-attribute");
            child.setAttribute("aria-checked", "false");
        });
        targetElementClasses.add("selected-swatch-attribute");
        targetedElement.setAttribute("aria-checked", "true");
    }
}