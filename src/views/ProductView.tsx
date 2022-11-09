import React, { Component, useState } from "react";
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
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");
  const [promptValues, setPromptValues] = useState<PromptType>({
    showPrompt: false,
    promptMessage: "",
  });
  function renderAttributeValues(attribute: AttributeSet) {
    let attributeValues = attribute.items.map((item, index) => {
      return (
        <li
          onClick={(event) => {
            selectItem(event, index);
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
        </li>
      );
    });
    return attributeValues;
  }
  function selectItem(
    ev: React.MouseEvent<Element, MouseEvent>,
    index: number
  ) {
    const targetedElement = ev.target as HTMLElement;
    const key =
      targetedElement.attributes.getNamedItem("data-attribute-id")?.nodeValue ??
      "";
    const targetElementClasses = targetedElement.classList;
    if (
      targetElementClasses.contains("selected-text-attribute") ||
      targetElementClasses.contains("selected-swatch-attribute")
    ) {
      targetElementClasses.remove("selected-text-attribute");
      targetElementClasses.remove("selected-swatch-attribute");
      let selectedAttributesClone: any = structuredClone(selectedAttributes);
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
      Array.from(targetParent.children).forEach((child: any, index) => {
        child.classList.remove("selected-text-attribute");
      });
      targetElementClasses.add("selected-text-attribute");
    } else {
      Array.from(targetParent.children).forEach((child: any, index) => {
        child.classList.remove("selected-swatch-attribute");
      });
      targetElementClasses.add("selected-swatch-attribute");
    }
  }
  function updateSelectedProductImage(index: number) {
    setSelectedImageIndex(index);
  }
  function addProductToCart() {
    if (!product?.inStock) {
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
    props.ADD_TO_CART(productClone);
    setTimeout(() => {
      setPromptValues({
        promptMessage: "",
        showPrompt: false,
      });
    }, 3000);
  }

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
        (element, index) => element.currency.label === props.currency.label
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
          <div className="product-attributes">
            {product?.attributes.map((attribute, index) => (
              <div className="product-attribute" key={index}>
                <p className="attribute-name" key={index}>
                  {attribute.name.toUpperCase() + ":"}
                </p>
                <ul className="attribute-values" data-type={attribute.type}>
                  {renderAttributeValues(attribute as AttributeSet)}
                </ul>
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
                (product?.inStock ? "" : "cart-button-out-of-stock")
              }
              onClick={addProductToCart}
            >
              {product?.inStock ? "ADD TO CART" : "OUT OF STOCK"}
            </button>
          </div>
          {/* Could add a sanitizer for the description, as its set with innerHTML */}
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
                  updateSelectedProductImage(index);
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
            <div
              className={
                "product-view-out-of-stock " +
                (product?.inStock ? "hidden" : "")
              }
            >
              OUT OF STOCK
            </div>
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
