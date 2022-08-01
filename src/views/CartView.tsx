import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ADD_TO_CART, REMOVE_FROM_CART } from '../redux/actions/cart';
import '../styles/Cart/Cart.scss';
import Cart from '../components/Cart.tsx';
import { Currency } from '../types/Category';
import CartItem from '../types/CartItem';
class CartView extends Component<{
    currency: Currency,
    cart: CartItem,
    quantity: Number
}, {
    cartItems: Array<Object>,
    quantity: Number,
    total: Number
}> {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            quantity: 0,
            total: 0
        }
    }
    getPriceAmountForProductPerLabel(product) {
        const prod = product.prices.find(price => price.currency.label === this.props.currency.label);
        return prod.amount
    }
    showCurrencyForProduct(product) {
        return this.getPriceAmountForProductPerLabel(product) + " " + this.props.currency.symbol;
    }
    updateTotalPriceAndQuantity(){
        const cartItems = Object.values(this.props.cart);
        const quantity = this.props.quantity;
        const total = cartItems.reduce((previousValue, currentValue) => { return previousValue + this.getPriceAmountForProductPerLabel(currentValue) * currentValue.quantity }, 0);
        this.setState({
            quantity,
            total
        })
    }
    componentDidUpdate(prevProps) {
        if(prevProps.quantity !== this.props.quantity || prevProps.currency !== this.props.currency) {
            this.updateTotalPriceAndQuantity()
        }
    }
    componentDidMount() {
        this.updateTotalPriceAndQuantity()
    }
    getTaxValue() {
        const taxValue = 0.21 * this.state.total;
        return this.props.currency.symbol + this.twoDecimalTrunc(taxValue);
    }
    twoDecimalTrunc = num => Math.trunc(num * 100) / 100;
    render() {
        return (
            <div className='main-content cart-content'>
                <h1 className='cart-title'>Cart</h1>
                <Cart classToSelect={".cart-content "}/>
                <div className='add-to-cart-wrapper'>
                    <p>Tax 21%: <span>{this.getTaxValue()}</span></p>
                    <p><>Quantity: <span>{this.state.quantity}</span></></p>
                    <p>Total: <span>{this.props.currency.symbol + this.twoDecimalTrunc(this.state.total)}</span></p>
                    <button className='add-to-cart-button'>ORDER</button>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.cartReducer.cart,
        currency: state.currencyReducer.currency,
        quantity: state.cartReducer.quantity
    };
};
const mapDispatchToProps = {
    ADD_TO_CART,
    REMOVE_FROM_CART
};
export default connect(mapStateToProps, mapDispatchToProps)(CartView);
