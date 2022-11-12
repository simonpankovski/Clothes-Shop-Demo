import React, {
    Key,
    useCallback,
    useEffect,
    useReducer,
    useState,
} from "react";
import { useMemo } from "react";
import { connect } from "react-redux";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../redux/actions/cart";
import showCurrencyForProduct from "../services/showCurrencyForProduct";
import Attribute from "../types/Attribute";
import AttributeSet from "../types/AttributeSet";
import CartItem from "../types/CartItem";
import { Currency } from "../types/Category";

interface Props {
    classToSelect: String;
    ADD_TO_CART: Function;
    REMOVE_FROM_CART: Function;
    currency: Currency;
    quantity: Number;
    cart: CartItem;
}

interface State {
    cartReducer: { cart: CartItem; quantity: Number };
    currencyReducer: { currency: Currency };
}

function Cart(props: Props) {
    const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
    let cartAttributes = useMemo(() => {
        return new Array(Object.values(props.cart).length).fill(
            React.createRef()
        );
    }, [props.cart]);
    let cartListItems: Attribute = useMemo(() => {
        return {};
    }, []);

    function handleProductQuantity(item: CartItem, action: String) {
        if (action === "increment") {
            props.ADD_TO_CART(item);
        } else {
            props.REMOVE_FROM_CART(item);
        }
    }
    function renderAttributeValues(attribute: AttributeSet) {
        let attributeValues = attribute.items.map((item: Attribute, i) => {
            return (
                <button
                    key={item.id}
                    tabIndex={-1}
                    aria-hidden={"true"}
                    ref={(ref) => (cartListItems[item?.id ?? ""] = ref)}
                    style={
                        attribute.type === "text"
                            ? {
                                  background: "var(--inverted-text-color)",
                              }
                            : {
                                  background: item.value,
                                  border: "1px solid",
                                  aspectRatio: "1/1",
                                  borderColor: "var(--primary-text-color)",
                              }
                    }
                    data-value={item.value}
                    data-item-type={attribute.type}
                    data-attribute-id={attribute.id}
                    data-item-id={item.id}
                >
                    {attribute.type === "text" ? item.value : ""}
                </button>
            );
        });
        return attributeValues;
    }

    function handleGalleryImageChange(
        event: React.MouseEvent<Element, MouseEvent>,
        item: CartItem
    ) {
        const eventTarget = event.target as HTMLElement;
        const isIncrement = eventTarget.classList[0].includes("next");
        let selectedGalleryIndex = Number(item?.selectedGalleryIndex ?? 0);
        console.log(
            item.gallery[
                item.selectedGalleryIndex ? item.selectedGalleryIndex : 0
            ]
        );
        if (isIncrement) {
            if (selectedGalleryIndex >= item.gallery.length - 1)
                item.selectedGalleryIndex = 0;
            else item.selectedGalleryIndex = selectedGalleryIndex + 1;
        } else {
            if (selectedGalleryIndex <= 0)
                item.selectedGalleryIndex = item.gallery.length - 1;
            else item.selectedGalleryIndex = selectedGalleryIndex - 1;
        }
        forceUpdate();
    }

    useEffect(() => {
        setCartItems(Object.values(props.cart));
    }, [props.cart]);

    useEffect(() => {
        function updateSelectedAttributeListItems(
            selectedAttributes: Array<Attribute>
        ) {
            let cartAttributesClone = cartAttributes;
            Object.values(cartListItems).forEach((item) => {
                if (!item) return;
                if (
                    item.attributes.getNamedItem("data-item-type")
                        ?.nodeValue === "text"
                ) {
                    item["style"].background = "var(--inverted-text-color)";
                    item["style"].color = "var(--primary-text-color)";
                } else {
                    item["style"].border =
                        "1px solid" + item["style"].background;
                }
            });
            selectedAttributes.forEach((item, index) => {
                Array.from(cartAttributesClone[index].children).forEach(
                    (element: any) => {
                        const attributeType = element.attributes[1].nodeValue;
                        const attributeIndex =
                            item[element.attributes[2].nodeValue];
                        const selectedElement =
                            element.children[1].children[attributeIndex];
                        if (!selectedElement) return;
                        if (attributeType === "text") {
                            selectedElement["style"].background =
                                "var(--icon-dark-color)";
                            selectedElement["style"].color =
                                "var(--light-color)";
                        } else {
                            selectedElement["style"].borderRadius = "50%";
                        }
                    }
                );
            });
        }
        const propsCartItems = Object.values(props.cart);
        const selectedAttributes = Object.keys(props.cart).map((item) =>
            JSON.parse(item.slice(1, item.length - 1))
        );
        setCartItems(propsCartItems);
        updateSelectedAttributeListItems(selectedAttributes);
    }, [cartAttributes, cartItems.length, cartListItems, props.cart]);

    return (
        <div>
            {Object.values(props.cart).map((item, index) => (
                <div className="row" key={index}>
                    <div className="col">
                        <div className="cart-item">
                            <h2>{item.brand}</h2>
                            <h3>{item.name}</h3>
                            <p className="cart-item-price">
                                {showCurrencyForProduct(
                                    item.prices,
                                    props.currency.label,
                                    props.currency.symbol
                                )}
                            </p>
                            <div
                                className="cart-attributes"
                                ref={(ref) => (cartAttributes[index] = ref)}
                            >
                                {(item.attributes as Array<AttributeSet>).map(
                                    (attribute: AttributeSet, index: Key) => (
                                        <div
                                            className="product-attribute"
                                            key={index}
                                            data-attribute-type={attribute.type}
                                            data-attribute-name={attribute.id}
                                        >
                                            <p
                                                className="attribute-name"
                                                key={index}
                                            >
                                                {attribute.id.toUpperCase() +
                                                    ":"}
                                            </p>
                                            <ul
                                                className="attribute-values"
                                                data-type={attribute.type}
                                            >
                                                {renderAttributeValues(
                                                    attribute
                                                )}
                                            </ul>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="quantity-selector">
                            <button
                                className="adjust-quantity"
                                aria-label={"Increment product quantity"}
                                onClick={() =>
                                    handleProductQuantity(item, "increment")
                                }
                            >
                                +
                            </button>
                            <div
                                role="spinbutton"
                                className="quantity-amount"
                                aria-valuenow={item.quantity}
                                aria-valuemin={1}
                                aria-label={"Product quantity"}
                            >
                                {item.quantity}
                            </div>
                            <button
                                className="adjust-quantity"
                                aria-label={"Decrement product quantity"}
                                onClick={() =>
                                    handleProductQuantity(item, "decrement")
                                }
                            >
                                -
                            </button>
                        </div>
                        <div className="image-display" id="image-display"  aria-roledescription="carousel" role={"region"}>
                            <img aria-label="Product preview image"
                                src={
                                    item.gallery[
                                        item.selectedGalleryIndex
                                            ? item.selectedGalleryIndex
                                            : 0
                                    ]
                                }
                                alt="Cart selected gallery item"
                            />
                            {item.gallery.length > 1 ? (
                                <section
                                    className="cart-image-controls"
                                    aria-label="Product preview images"
                                >
                                    <button
                                        className="previous-image"
                                        aria-label="Previous image"
                                        onClick={(ev) =>
                                            handleGalleryImageChange(ev, item)
                                        }
                                    >
                                        {"<"}
                                    </button>
                                    <button
                                        className="next-image"
                                        aria-label="Next image"
                                        onClick={(ev) =>
                                            handleGalleryImageChange(ev, item)
                                        }
                                    >
                                        {">"}
                                    </button>
                                </section>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const mapStateToProps = (state: State) => {
    return {
        cart: state.cartReducer.cart,
        currency: state.currencyReducer.currency,
        quantity: state.cartReducer.quantity,
    };
};
const mapDispatchToProps = {
    ADD_TO_CART,
    REMOVE_FROM_CART,
};
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
