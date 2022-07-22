import React, { Component } from 'react'
import { client, DataType, DeepReadonlyArray, Field, Query } from '@tilework/opus';
import { connect } from "react-redux";
import '../styles/Products/ProductView.scss';
import { ADD_TO_CART } from '../redux/actions/cart';
import Prompt from '../components/Prompt.tsx';
import { Currency } from '../types/Category';
import CartItem from '../types/CartItem';
class ProductView extends Component<
  {
    currency: Currency,
    ADD_TO_CART: Function
  },
  {
    productId: String,
    product: CartItem,
    selectedImageIndex: Number,
    price: { label: String, amount: Number, symbol: String },
    selectedAttributes: Object,
    showPrompt: boolean,
    promptMessage: String,
    promptValues: Object,
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      productId: "",
      product: { gallery: [""], attributes: [], prices: [] },
      selectedImageIndex: 0,
      price: { label: "USD", amount: 0, symbol: "$" },
      selectedAttributes: {},
      showPrompt: false,
      promptMessage: "",
      promptValues: {
        showPrompt: false,
        promptMessage: "",
      }
    }
    this.addProductToCart = this.addProductToCart.bind(this);
  }
  async fetchProductById(id: String) {
    const query = new Query("product").addArgument("id", "String!", id)
      .addFieldList(["id", "name", "description", "brand", "gallery", "inStock"])
      .addField(new Field("prices", true).addField(new Field("currency")
        .addField("label")).addField("amount")).addField(new Field("attributes", true)
          .addFieldList(["id", "name", "type"]).addField(new Field("items", true)
            .addFieldList(["value", "displayValue", "id"])))
    let result: DataType<typeof query>;
    client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
    result = await client.post(query);
    return result;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.currency.label !== this.props.currency.label) {
      const productPrice = this.state.product.prices.find((element, index) =>
        element.currency.label === this.props.currency.label)?.amount;
      this.setState({
        price:
        {
          amount: productPrice,
          label: this.props.currency.label,
          symbol: this.props.currency.symbol
        }
      });
    }
  }
  async componentDidMount() {
    const productId = window.location.pathname.split("/")[2];
    const product = await this.fetchProductById(productId)
    const productObject = product.product;
    const productPrice = productObject.prices.find((element, index) =>
      element.currency.label === this.props.currency.label)?.amount;
    this.setState({
      productId,
      product: productObject,
      attributes: productObject.attributes,
      price: {
        amount: productPrice, label: this.props.currency.label,
        symbol: this.props.currency.symbol
      }
    });
  }
  updateSelectedProductImage(ev, index) {
    this.setState({
      selectedImageIndex: index
    })
  }
  selectItem(ev, index) {
    const targetedElement = ev.target;
    const key = targetedElement.attributes['data-attribute-id'].nodeValue;
    const targetElementClasses = targetedElement.classList;
    if (targetElementClasses.contains("selected-text-attribute") ||
      targetElementClasses.contains("selected-swatch-attribute")) {
      targetElementClasses.remove("selected-text-attribute");
      targetElementClasses.remove("selected-swatch-attribute");
      let selectedAttributes = this.state.selectedAttributes;
      delete selectedAttributes[key];
      this.setState({
        selectedAttributes
      })
      return;
    }
    const selectedAttributes = {
      ...this.state.selectedAttributes, [key]: index
    }
    this.setState({
      selectedAttributes
    })
    const targetParent = targetedElement.parentNode;
    const parentNodeType = targetParent.attributes['data-type'].nodeValue;
    if (parentNodeType === "text") {
      Array.from(targetParent.children).forEach((child: any, index) => {
        child.classList.remove("selected-text-attribute");
      })
      targetElementClasses.add("selected-text-attribute")
    }
    else {
      Array.from(targetParent.children).forEach((child: any, index) => {
        child.classList.remove("selected-swatch-attribute");
      })
      targetElementClasses.add("selected-swatch-attribute")
    }
  }
  renderAttributeValues(attribute) {
    let attributeValues = attribute.items.map((item, i) => {
      return <li onClick={(ev) => { this.selectItem(ev, i) }} key={i} style={attribute.type === "swatch" ?
        { background: item.value, border: "1px solid", aspectRatio: "1/1", borderColor: "var(--main-text-color)" } :
        {}} data-value={item.value} data-attribute-id={attribute.id} data-item-id={item.id}>{attribute.type === "swatch" ? "" : item.value}</li>
    })
    return attributeValues;
  }
  addProductToCart() {
    if (!this.state.product.inStock) {
      this.setState({
        promptValues: {
          promptMessage: "The product is out of stock!",
          showPrompt: true
        }
      });
      setTimeout(() => {
        this.setState({
          promptValues: {
            promptMessage: "",
            showPrompt: false
          }
        });
      }, 3000)

      return;
    }
    const product = {
      ...this.state.product,
      selectedAttributes: this.state.selectedAttributes,
      quantity: 1
    };
    if (Object.keys(product.selectedAttributes).length !== Object.keys(this.state.product.attributes).length) {
      this.setState({
        promptValues: {
          promptMessage: "Please select an option for each attribute!",
          showPrompt: true
        }
      });
      setTimeout(() => {
        this.setState({
          promptValues: {
            promptMessage: "",
            showPrompt: false
          }
        });
      }, 3000)
      return;
    }
    this.setState({
      promptValues: {
        promptMessage: "Added item to cart!",
        showPrompt: true
      }
    });
    this.props.ADD_TO_CART(product);
    setTimeout(() => {
      this.setState({
        promptValues: {
          promptMessage: "",
          showPrompt: false
        }
      });
    }, 3000)
  }
  render() {
    return (
      <div className='product-display-page'>
        <Prompt prompt={this.state.promptValues} />
        <div className='row'>
          <div className="col-first">
            <div className='product-title'>
              <h3>{this.state.product.brand}</h3>
              <h3>{this.state.product.name}</h3>
            </div>
            <div className='product-attributes'>
              {this.state.product.attributes.map((attribute, index) =>
                <div className='product-attribute' key={index}>
                  <p className='attribute-name' key={index}>{attribute.name.toUpperCase() + ":"}</p>
                  <ul className='attribute-values' data-type={attribute.type}>
                    {this.renderAttributeValues(attribute)}
                  </ul>
                </div>
              )}

            </div>
            <div className='product-attributes product-price'>
              <p className='attribute-name'>PRICE:</p>
              <div className='product-amount'>
                <p>{this.state.price.amount + " " + this.state.price.symbol}</p>
              </div>
            </div>
            <div className='add-to-cart-wrapper'>
              <button className={'add-to-cart-button ' + (this.state.product.inStock ? "" : "cart-button-out-of-stock")} onClick={this.addProductToCart}
              >{this.state.product.inStock ? "ADD TO CART" : "OUT OF STOCK"}</button>
            </div>
            {/* Could add a sanitizer for the description, as its set with innerHTML */}
            <div className='product-description' dangerouslySetInnerHTML={{ __html: this.state.product.description }} />
          </div>
          <div className="col-last">
            <div className='gallery-images'>
              {this.state.product.gallery.map((image, index) =>
                <img src={image} alt="Gallery Item" key={index}
                  onClick={(ev) => { this.updateSelectedProductImage(ev, index) }} />
              )}
            </div>
            <div className="product-view-image-wrapper">
              <img className='main-product-image'
                src={this.state.product.gallery[this.state.selectedImageIndex]} alt="Selected Product" />
              <div className={'product-view-out-of-stock ' + (this.state.product.inStock ? "hidden" : "")}>OUT OF STOCK</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currencyReducer.currency,
    cart: state.cartReducer
  };
};
const mapDispatchToProps = {
  ADD_TO_CART
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductView)