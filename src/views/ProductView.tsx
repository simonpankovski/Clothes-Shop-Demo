import React, { Component } from 'react'
import { client, DataType, Field, Query } from '@tilework/opus';
import { connect } from "react-redux";
import '../styles/Products/ProductView.css'
class ProductView extends Component<
  {},
  {
    productId: String,
    product: Object,
    selectedImageIndex: Number,
    price: { label: String, amount: Number, symbol: String }
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      productId: "",
      product: { gallery: [""], attributes: [] },
      selectedImageIndex: 0,
      price: { label: "USD", amount: 0, symbol: "$" }
    }
  }
  async fetchProductById(id: String) {
    const query = new Query("product").addArgument("id", "String!", id)
      .addFieldList(["name", "description", "brand", "gallery", "inStock"])
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
  selectItem(ev) {
    const targetedElement = ev.target;
    const targetElementClasses = targetedElement.classList;
    if (targetElementClasses.contains("selected-text-attribute") ||
      targetElementClasses.contains("selected-swatch-attribute")) {
      targetElementClasses.remove("selected-text-attribute");
      targetElementClasses.remove("selected-swatch-attribute");
      return;
    }

    const targetParent = targetedElement.parentNode;
    const parentNodeType = targetParent.attributes['data-type'].nodeValue;
    if (parentNodeType === "text") {
      Array.from(targetParent.children).forEach((child, index) => {
        child.classList.remove("selected-text-attribute");
      })
      targetElementClasses.add("selected-text-attribute")
    }
    else {
      Array.from(targetParent.children).forEach((child, index) => {
        child.classList.remove("selected-swatch-attribute");
      })
      targetElementClasses.add("selected-swatch-attribute")
    }
  }
  renderAttributeValues(attribute) {
    let attributeValues = attribute.items.map((item, i) => {
      return <li onClick={this.selectItem} key={i} style={attribute.type === "swatch" ?
        { background: item.value, fontSize: 0, aspectRatio: "1/1", borderColor: "var(--main-text-color)" } :
        {}} data-value={item.value}>{item.displayValue}</li>
    })
    return attributeValues;
  }
  render() {
    return (
      <div className='product-display-page'>
        <div className='row'>
          <div className="col">
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
            <div className="product-price">
              <div className='product-attributes'>
                <p className='attribute-name'>PRICE:</p>
              </div>
              <p>{this.state.price.amount + " " + this.state.price.symbol}</p>
            </div>
            <div>
              <button className='add-to-cart-button'>ADD TO CART</button>
            </div>
            {/* Could add a sanitizer for the description, as its set with innerHTML */}
            <div className='product-description' dangerouslySetInnerHTML={{ __html: this.state.product.description }} />
          </div>
          <div className="col">
            <div className='gallery-images'>
              {this.state.product.gallery.map((image, index) =>
                <img src={image} alt="Gallery Item" key={index}
                  onClick={(ev) => { this.updateSelectedProductImage(ev, index) }} />
              )}
            </div>
            <img className='selected-product-image'
              src={this.state.product.gallery[this.state.selectedImageIndex]} alt="Selected Product" />
          </div>

        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currencyReducer.currency
  };
};
export default connect(mapStateToProps, null)(ProductView)