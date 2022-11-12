import CartItem from "../types/CartItem";

export default function addProductToCart(inStock: boolean | undefined, setPromptValues: Function, product: CartItem | null, selectedAttributes: Object, propsAddToCart: Function) {
    if(product === null) return;
    if (!inStock) {
        setTimeout(() => {
            setPromptValues({
                promptMessage: "",
                showPrompt: false,
            });
        }, 3000);
        return;
    }
    const productClone = {
        ...product,
        selectedAttributes,
        quantity: 1,
    };
    if (
        Object.keys(productClone.selectedAttributes).length !==
        Object.keys(product.attributes).length
    ) {
        setPromptValues({
            promptMessage: "Please select an option for each attribute!",
            showPrompt: true,
        });
        setTimeout(() => {
            setPromptValues({
                promptMessage: "",
                showPrompt: false,
            });
        }, 3000);
        return;
    }
    setPromptValues({
        promptMessage: "Added item to cart!",
        showPrompt: true,
    });
    propsAddToCart(productClone)
    setTimeout(() => {
        setPromptValues({
            promptMessage: "",
            showPrompt: false,
        });
    }, 3000);
}