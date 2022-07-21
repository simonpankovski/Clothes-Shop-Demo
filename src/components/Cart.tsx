import React, { Component } from 'react'
import { connect } from 'react-redux';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../redux/actions/cart';

class Cart extends Component<{},{
    cartItems: Array<Object>,
    total: Number
}> {
    constructor(props){
        super(props);
        this.state = {
            cartItems: [],
            total: 0
        }
    }
    handleProductQuantity(ev, item, action) {
        if (action === "increment") {
            this.props.ADD_TO_CART(item);
        }
        else {
            this.props.REMOVE_FROM_CART(item);
        }
    }
    renderAttributeValues(attribute) {
        let attributeValues = attribute.items.map((item, i) => {
            return <li key={i} style={attribute.type === "swatch" ?
                { background: item.value, border: "1px solid", aspectRatio: "1/1", borderColor: "var(--main-text-color)" } :
                {}} data-value={item.value} data-attribute-id={attribute.id} data-item-id={item.id}>{attribute.type === "swatch" ? "" : item.value}</li>
        })
        return attributeValues;
    }
    getPriceAmountForProductPerLabel(product) {
        return product.prices.find(price => price.currency.label === this.props.currency.label).amount
    }
    showCurrencyForProduct(product) {
        return this.getPriceAmountForProductPerLabel(product) + " " + this.props.currency.symbol;
    }
    handleGalleryImageChange(ev, item) {
        const isIncrement = ev.target.classList[0].includes("next");
        if (isIncrement) {
            if (item.selectedGalleryIndex >= item.gallery.length - 1) item.selectedGalleryIndex = 0;
            else item.selectedGalleryIndex = item.selectedGalleryIndex + 1;
        }
        else {
            if (item.selectedGalleryIndex <= 0) item.selectedGalleryIndex = item.gallery.length - 1;
            else item.selectedGalleryIndex = item.selectedGalleryIndex - 1;
        }
        this.setState({
            cartItems: this.state.cartItems
        })
    }
    componentDidMount() {
        const cartItems = Object.values(this.props.cart);
        const total = cartItems.reduce((previousValue, currentValue) => { return previousValue + this.getPriceAmountForProductPerLabel(currentValue) }, 0);
        this.setState({
            total
        })
        // if(!.selectedGalleryIndex) {
        //     this.props.cart.selectedGalleryIndex = 0;
        // }
    }
    render() {
        return (
            <div>
                {Object.values(this.props.cart).map((item, index) => (
                    <div className="row" key={index}>
                        <div className="col">
                            <div className='cart-item' >
                                <h3>{item.brand}</h3>
                                <h3>{item.name}</h3>
                                <p className='cart-item-price'>{this.showCurrencyForProduct(item)}</p>
                                <div className='cart-attributes'>
                                    {item.attributes.map((attribute, index) =>
                                        <div className='product-attribute' key={index} data-attribute-type={attribute.type} data-attribute-name={attribute.name}>
                                            <p className='attribute-name' key={index}>{attribute.name.toUpperCase() + ":"}</p>
                                            <ul className='attribute-values' data-type={attribute.type}>
                                                {this.renderAttributeValues(attribute)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                        <div className="col">
                            <div className='quantity-selector'>
                                <div className='adjust-quantity' onClick={(ev) => this.handleProductQuantity(ev, item, "increment")}>+</div>
                                <div className='quantity-amount'>{item.quantity}</div>
                                <div className='adjust-quantity' onClick={(ev) => this.handleProductQuantity(ev, item, "decrement")}>-</div>
                            </div>
                            <div className="image-display">
                                <img src={item.gallery[(item.selectedGalleryIndex) ? item.selectedGalleryIndex : 0]} alt="Cart selected gallery item" />
                                {item.gallery.length > 1 ? <div className='cart-image-controls'>
                                    <div className="previous-image" onClick={(ev) => this.handleGalleryImageChange(ev, item)}>{"<"}</div>
                                    <div className="next-image" onClick={(ev) => this.handleGalleryImageChange(ev, item)}>{">"}</div>
                                </div> : ""}

                            </div>

                        </div>
                    </div>
                ))}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.cartReducer.cart,
        currency: state.currencyReducer.currency
    };
};
const mapDispatchToProps = {
    ADD_TO_CART,
    REMOVE_FROM_CART
};
export default connect(mapStateToProps, mapDispatchToProps)(Cart);