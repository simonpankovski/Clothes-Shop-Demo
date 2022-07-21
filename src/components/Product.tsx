import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/Products/Product.scss';
import cartIcon from "../assets/cart-icon.svg";
import { client, DataType, Field, Query } from '@tilework/opus';
import { connect } from 'react-redux';
import { ADD_TO_CART } from '../redux/actions/cart';
class Product extends Component<{}, {
    attributes: Array<any>,
    selectedAttributes: Object,
    displayAddToCartPrompt: boolean,
    quantity: Number
}> {
    constructor(props) {
        super(props);
        this.state = {
            attributes: [],
            selectedAttributes: {},
            displayAddToCartPrompt: false,
            quantity: 1
        }
        this.addProductToCart = this.addProductToCart.bind(this);
    }
    isProductInStock() {
        return this.props.product.inStock;
    }
    showCurrencyForProduct(currency) {
        return this.props.product.prices.find(price => price.currency.label === this.props.currency.label).amount + " " + this.props.currency.symbol;
    }
    handleRedirect(ev, id) {
        ev.preventDefault();
        ev.stopPropagation();
        if (Array.from(ev.target.classList).includes("class-icon-identifier")) {
            this.setState({
                displayAddToCartPrompt: !this.state.displayAddToCartPrompt
            })
        }
        else if (Array.from(ev.currentTarget.classList).includes("add-to-cart-prompt")) {
            if (Array.from(ev?.target.classList).includes("close-cart-overlay")) {
                this.setState({
                    displayAddToCartPrompt: !this.state.displayAddToCartPrompt
                })
            }
        }
        else {
            window.location.href = "/product/" + id;
        }
    }
    addProductToCart() {
        const product = {
            ...this.props.product,
            selectedAttributes: this.state.selectedAttributes,
            quantity: this.state.quantity
        };
        console.log(product)
        if (Object.keys(product.selectedAttributes).length !== Object.keys(this.props.product.attributes).length) return;

        // this.setState({
        //   promptMessage: "Added item to cart!",
        //   showPrompt: true
        // });
        this.props.ADD_TO_CART(product);
        // setTimeout(() => {
        //   this.setState({
        //     promptMessage: "",
        //     showPrompt: false
        //   });
        // }, 3000)
    }
    async componentDidMount() {
        const attributes = this.props.product.attributes;
        this.setState({
            attributes: attributes
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
        //console.log(attribute)
        let attributeValues = attribute.items.map((item, i) => {
            return <li onClick={(ev) => { this.selectItem(ev, i) }} key={i} style={attribute.type === "swatch" ?
                { background: item.value, border: "1px solid", aspectRatio: "1/1", borderColor: "var(--main-text-color)" } :
                {}} data-value={item.value} data-attribute-id={attribute.id} data-item-id={item.id}>{attribute.type === "swatch" ? "" : item.value}</li>
        })
        return attributeValues;
    }
    render() {
        return (
            <Link to={"/product/" + this.props.product.id} className="product-component" onClick={ev => { this.handleRedirect(ev, this.props.product.id) }}>
                {this.state.displayAddToCartPrompt ?
                    <div className='add-to-cart-prompt' onClick={ev => { this.handleRedirect(ev, this.props.product.id) }}>
                        <div className='product-attributes'>
                            {this.state.attributes.map((attribute, index) =>
                                <div className='product-attribute' key={index}>
                                    <p className='attribute-name' key={index}>{attribute.name.toUpperCase() + ":"}</p>
                                    <ul className='attribute-values' data-type={attribute.type}>
                                        {this.renderAttributeValues(attribute)}
                                    </ul>
                                </div>
                            )}

                        </div>
                        <div className="cart-overlay-controls">
                            <button className='close-cart-overlay'>X</button>
                            <button className='add-to-cart-button' onClick={this.addProductToCart}>ADD TO CART</button>
                        </div>
                    </div> : ""
                }
                <div className='product'>
                    <div className='product-image-wrapper'>
                        <img className='product-thumbnail' src={this.props.product.gallery[0]} alt="" />
                        <div className={'product-out-of-stock ' + (this.isProductInStock() ? "hidden" : "")}>OUT OF STOCK</div>
                        {this.props.product.inStock ? <div className='cart-icon-wrapper class-icon-identifier'><img src={cartIcon} className="class-icon-identifier" alt="Cart icon" /></div> : ""}
                    </div>
                    <div className="product-text-wrapper">
                        <p className={'product-title ' + (this.isProductInStock() ? "" : "out-of-stock-text")}>{this.props.product.brand + " " + this.props.product.name}</p>
                        <p className={'product-price ' + (this.isProductInStock() ? "" : "out-of-stock-text")}>{this.showCurrencyForProduct()}</p>
                    </div>
                </div>
            </Link>
        )
    }
}
const mapDispatchToProps = {
    ADD_TO_CART
};
export default connect(null, mapDispatchToProps)(Product);