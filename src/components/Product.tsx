import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/Products/Product.css';
import cartIcon from "../assets/cart-icon.svg";
export default class Product extends Component {
    isProductInStock() {
        return this.props.product.inStock;
    }
    showCurrencyForProduct(currency) {
        return this.props.product.prices.find(price => price.currency.label === this.props.currency.label).amount + " " + this.props.currency.symbol;
    }
    handleRedirect(ev, id) {
        window.location.href = "/product/" + id;
    }
    render() {
        return (
            <Link to={"/product/" + this.props.product.id} onClick={ev => {this.handleRedirect(ev,this.props.product.id)}}>
                <div className='product'>
                    <div className='product-image-wrapper'>
                        <img className='product-thumbnail' src={this.props.product.gallery[0]} alt="" />
                        <div className={'product-out-of-stock ' + (this.isProductInStock() ? "hidden" : "")}>OUT OF STOCK</div>
                        <div className='cart-icon-wrapper'><img src={cartIcon} alt="Cart icon" /></div>
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
