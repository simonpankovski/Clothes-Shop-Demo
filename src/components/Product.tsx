import { Link, useNavigate } from "react-router-dom";
import "../styles/Products/Product.scss";
import cartIcon from "../assets/cart-icon.svg";
import { connect } from "react-redux";
import { ADD_TO_CART } from "../redux/actions/cart";
import Prompt from "../components/Prompt";
import { MouseEvent, useEffect, useState } from "react";
import CartItem from "../types/CartItem";
import { Currency } from "../types/Category";
import PromptType from "../types/Prompt";
import AttributeSet from "../types/AttributeSet";
import { DeepReadonlyArray } from "@tilework/opus";
import showCurrencyForProduct from "../services/showCurrencyForProduct";
import { renderAttributeValues } from "../services/renderAttributeValues";
import addProductToCart from "../services/addProductToCart";

interface Props {
  product: CartItem;
  propsObject: any;
  ADD_TO_CART: Function;
  selectedCurrency: Currency;
}
interface State {
  currencyReducer: {
    currency: Currency;
  };
}
function Product(props: Props) {
  let navigate = useNavigate();
  const [attributes, setAttributes] = useState<DeepReadonlyArray<AttributeSet>>(
    []
  );
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [displayAddToCartOverlay, setDisplayAddToCartOverlay] = useState(false);
  const [promptValues, setPromptValues] = useState<PromptType>({
    showPrompt: false,
    promptMessage: "",
  });

  useEffect(() => {
    setAttributes(props.product.attributes);
  }, [props.product.attributes]);

  function isProductInStock() {
    return props.product.inStock;
  }
  function handleRedirect(ev: MouseEvent, id: String) {
    ev.preventDefault();
    ev.stopPropagation();
    const eventTarget = ev.target as HTMLElement;
    const currentTarget = ev.currentTarget as HTMLElement;
    if (Array.from(eventTarget.classList).includes("class-icon-identifier")) {
      setDisplayAddToCartOverlay((prev) => !prev); // Check logic -----------------------------------
    } else if (
      Array.from(currentTarget.classList).includes("add-to-cart-prompt")
    ) {
      if (Array.from(eventTarget.classList).includes("close-cart-overlay")) {
        setDisplayAddToCartOverlay((prev) => !prev);
      }
    } else {
      navigate("/product/" + id);
    }
  }
  
  return (
    <Link
      to={"/product/" + props.product.id}
      className="product-component"
      onClick={(ev) => {
        handleRedirect(ev, props.product.id);
      }}
    >
      <Prompt prompt={promptValues} className="product-prompt" />
      {displayAddToCartOverlay ? (
        <div
          className="add-to-cart-prompt"
          onClick={(ev) => {
            handleRedirect(ev, props.product.id);
          }}
        >
          <div className="product-attributes">
            {attributes.map((attribute, index) => (
              <div className="product-attribute" key={index}>
                <p className="attribute-name" key={index}>
                  {attribute.name.toUpperCase() + ":"}
                </p>
                <ul className="attribute-values" data-type={attribute.type}>
                  {renderAttributeValues(attribute as AttributeSet, selectedAttributes, setSelectedAttributes)}
                </ul>
              </div>
            ))}
          </div>
          <div className="cart-overlay-controls">
            <button className="close-cart-overlay">X</button>
            <button className="add-to-cart-button" onClick={() => {addProductToCart(true, setPromptValues, props.product, selectedAttributes, props.ADD_TO_CART)}}>
              ADD TO CART
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="product">
        <div className="product-image-wrapper">
          <img
            className="product-thumbnail"
            src={props.product.gallery[0].toString()}
            alt={"Product thumbnail for " + props.product.name}
          />
          <div
            className={
              "product-out-of-stock " + (isProductInStock() ? "hidden" : "")
            }
          >
            OUT OF STOCK
          </div>
          {props.product.inStock ? (
            <div className="cart-icon-wrapper class-icon-identifier">
              <img
                src={cartIcon}
                className="class-icon-identifier"
                alt="Cart icon"
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="product-text-wrapper">
          <p
            className={
              "product-title " + (isProductInStock() ? "" : "out-of-stock-text")
            }
          >
            {props.product.brand + " " + props.product.name}
          </p>
          <p
            className={
              "product-price " + (isProductInStock() ? "" : "out-of-stock-text")
            }
          >
            {showCurrencyForProduct(props?.product?.prices, props.selectedCurrency.label, props.selectedCurrency.symbol)}
          </p>
        </div>
      </div>
    </Link>
  );
}

const mapStateToProps = (state: State) => {
  return {
    currency: state.currencyReducer.currency,
  };
};
const mapDispatchToProps = {
  ADD_TO_CART,
};
export default connect(mapStateToProps, mapDispatchToProps)(Product);
