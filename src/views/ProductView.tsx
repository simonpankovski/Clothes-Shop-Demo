import { useState } from "react";
import {
    client,
    DataType,
    DeepReadonlyObject,
    Field,
    Query,
} from "@tilework/opus";
import { connect } from "react-redux";
import "../styles/Products/ProductView.scss";
import { ADD_TO_CART } from "../redux/actions/cart";
import Prompt from "../components/Prompt";
import { Currency } from "../types/Category";
import CartItem from "../types/CartItem";
import { Markup } from "interweave";
import PromptType from "../types/Prompt";
import { useEffect } from "react";
import AttributeSet from "../types/AttributeSet";
import { renderAttributeValues } from "../services/renderAttributeValues";
import addProductToCart from "../services/addProductToCart";
interface State {
    cartReducer: { cart: CartItem; quantity: Number; isCartMenuOpen: Boolean };
    currencyReducer: { currency: Currency };
}
interface Props {
    currency: Currency;
    ADD_TO_CART: Function;
}
interface Price {
    label: string;
    amount: number;
    symbol?: string;
}

function ProductView(props: Props) {
    const [product, setProduct] = useState<DeepReadonlyObject<CartItem> | null>(
        null
    );
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState<Object>({});
    const [price, setPrice] = useState<Price>({
        label: "USD",
        amount: 0,
        symbol: "$",
    });
    const [promptValues, setPromptValues] = useState<PromptType>({
        showPrompt: false,
        promptMessage: "",
    });


    useEffect(() => {
        const productPrice =
            product?.prices.find(
                (element) => element.currency.label === props.currency.label
            )?.amount ?? 0;
        setPrice({
            amount: +productPrice,
            label: props.currency.label ?? "$",
            symbol: props.currency.symbol,
        });
    }, [product?.prices, props.currency.label, props.currency.symbol]);
    useEffect(() => {
        const productId = window.location.pathname.split("/")[2];
        async function fetchProductById(id: String) {
            const query = new Query("product")
                .addArgument("id", "String!", id)
                .addFieldList([
                    "id",
                    "name",
                    "description",
                    "brand",
                    "gallery",
                    "inStock",
                ])
                .addField(
                    new Field("prices", true)
                        .addField(new Field("currency").addField("label"))
                        .addField("amount")
                )
                .addField(
                    new Field("attributes", true)
                        .addFieldList(["id", "name", "type"])
                        .addField(
                            new Field("items", true).addFieldList([
                                "value",
                                "displayValue",
                                "id",
                            ])
                        )
                );
            let result: DataType<typeof query>;
            client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
            result = await client.post(query);
            const productObject = result.product;

            const productPrice = productObject.prices.find(
                (element) =>
                    element.currency.label === props.currency.label
            )?.amount;
            setPrice(productPrice);
            setProduct(productObject as CartItem);
        }
        fetchProductById(productId);
    }, [props.currency.label]);

    return (
        <div className="product-display-page">
            <Prompt prompt={promptValues} />
            <div className="row">
                <div className="col-first">
                    <div className="product-title">
                        <h3>{product?.brand}</h3>
                        <h3>{product?.name}</h3>
                    </div>
                    <div className="product-attributes" role="radiogroup">
                        {product?.attributes.map((attribute, index) => (
                            <div className="product-attribute" key={index}>
                                <p className="attribute-name" key={index}>
                                    {attribute.name.toUpperCase() + ":"}
                                </p>
                                <div
                                    className="attribute-values"
                                    data-type={attribute.type}
                                >
                                    {renderAttributeValues(
                                        attribute as AttributeSet,
                                        selectedAttributes,
                                        setSelectedAttributes
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="product-attributes product-price">
                        <p className="attribute-name">PRICE:</p>
                        <div className="product-amount">
                            <p>{price.amount + " " + price.symbol}</p>
                        </div>
                    </div>
                    <div className="add-to-cart-wrapper">
                        <button
                            className={
                                "add-to-cart-button " +
                                (product?.inStock
                                    ? ""
                                    : "cart-button-out-of-stock")
                            }
                            onClick={() => {addProductToCart(product?.inStock, setPromptValues, product as CartItem, selectedAttributes, props.ADD_TO_CART)}}
                        >
                            {product?.inStock ? "ADD TO CART" : "OUT OF STOCK"}
                        </button>
                    </div>
                    <div className="product-description">
                        <Markup content={product?.description} />
                    </div>
                </div>
                <div className="col-last">
                    <div className="gallery-images">
                        {product?.gallery.map((image, index) => (
                            <img
                                src={image}
                                alt="Gallery Item"
                                key={index}
                                onClick={() => {
                                    setSelectedImageIndex(index);
                                }}
                            />
                        ))}
                    </div>
                    <div className="product-view-image-wrapper">
                        <img
                            className="main-product-image"
                            src={product?.gallery[selectedImageIndex]}
                            alt="Selected Product"
                        />
                        {!product?.inStock && (
                            <div
                                className={
                                    (product?.inStock ? "hidden" : "") +
                                    " product-view-out-of-stock "
                                }
                            >
                                OUT OF STOCK
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: State) => {
    return {
        currency: state.currencyReducer.currency,
        cart: state.cartReducer,
    };
};
const mapDispatchToProps = {
    ADD_TO_CART,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductView);
