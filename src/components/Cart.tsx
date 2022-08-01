import React, { Component, DOMElement } from 'react'
import { connect } from 'react-redux';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../redux/actions/cart';
import CartItem from "../types/CartItem";
import { Currency } from '../types/Category.ts';
class Cart extends Component<{
    classToSelect: String,
    ADD_TO_CART: Function,
    REMOVE_FROM_CART: Function,
    currency: Currency,
    quantity: Number,
    cart: CartItem
}, {
    cartItems: Array<CartItem>,
    total: Number,
    quantity: Number
}> {
    constructor(props) {
        super(props);
        this.cartAttributes = new Array(Object.values(this.props.cart).length).fill(React.createRef());
        this.cartListItems = {};
        this.state = {
            cartItems: [],
            total: 0,
            quantity: 0
        }
    }
    updateSelectedAttributeListItems(selectedAttributes) {
        let cartItems = this.cartAttributes;
        Object.values(this.cartListItems).forEach(item => {
            if(!item) return;
            if (item.attributes.getNamedItem("data-item-type")?.nodeValue === "text") {
                item['style'].background = "white";
                item['style'].color = "var(--main-text-color)";
            } else {
                item['style'].border = "1px solid" + item['style'].background;
            }
        })
        selectedAttributes.forEach((item, index) => {
            Array.from(cartItems[index].children).forEach((element: Element) => {
                const attributeType = element.attributes[1].nodeValue;
                const attributeIndex = item[element.attributes[2].nodeValue];
                const selectedElement = element.children[1].children[attributeIndex];
                if (attributeType === "text") {
                    selectedElement['style'].background = "var(--main-text-color)";
                    selectedElement['style'].color = "white";
                }
                else {
                    selectedElement['style'].border = "1px solid var(--main-green-color)";
                }
            });
        })
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
            return <li key={i} ref={ref => this.cartListItems[item.id] = ref} style={attribute.type === "swatch" ?
                { background: item.value, border: "1px solid", aspectRatio: "1/1", borderColor: "var(--main-text-color)" } :
                {}} data-value={item.value} data-item-type={attribute.type} data-attribute-id={attribute.id}
                data-item-id={item.id}>{attribute.type === "swatch" ? "" : item.value}</li>
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
    componentDidUpdate(prevProps) {
        if (Object.keys(prevProps.cart).length !== Object.keys(this.props.cart).length || prevProps.quantity !== this.props.quantity) {
            const selectedAttributes = Object.keys(this.props.cart).map(item =>
                JSON.parse(item.slice(1, item.length - 1))
            )
            const cartItems = Object.values(this.props.cart);
            const total = cartItems.reduce((previousValue, currentValue) => {
                return previousValue + this.getPriceAmountForProductPerLabel(currentValue)
            }, 0);
            this.setState({
                cartItems: Object.values(this.props.cart),
                total
            }, () => this.updateSelectedAttributeListItems(selectedAttributes))
        }
        else if (prevProps.currency !== this.props.currency) {
            const cartItems = Object.values(this.props.cart);
            const total = cartItems.reduce((previousValue, currentValue) => {
                return previousValue + this.getPriceAmountForProductPerLabel(currentValue)
            }, 0);
            this.setState({
                total
            })
        }
    }
    componentDidMount() {
        if (this.state.cartItems.length === 0) {
            const selectedAttributes = Object.keys(this.props.cart).map(item =>
                JSON.parse(item.slice(1, item.length - 1))
            )
            Object.values(this.props.cart).forEach(item => {
                item.selectedGalleryIndex = 0
            })
            const cartItems = Object.values(this.props.cart);
            const quantity = this.props.quantity;
            const total = cartItems.reduce((previousValue, currentValue) => {
                return previousValue + this.getPriceAmountForProductPerLabel(currentValue)
            }, 0);
            this.setState({
                cartItems,
                quantity,
                total
            }, () => this.updateSelectedAttributeListItems(selectedAttributes))

        }
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
                                <div className='cart-attributes' ref={ref => this.cartAttributes[index] = ref}>
                                    {item.attributes.map((attribute, index) =>
                                        <div className='product-attribute' key={index}
                                            data-attribute-type={attribute.type} data-attribute-name={attribute.name}>
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
                                <img src={item.gallery[(item.selectedGalleryIndex) ?
                                    item.selectedGalleryIndex : 0]} alt="Cart selected gallery item" />
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
        currency: state.currencyReducer.currency,
        quantity: state.cartReducer.quantity
    };
};
const mapDispatchToProps = {
    ADD_TO_CART,
    REMOVE_FROM_CART
};
export default connect(mapStateToProps, mapDispatchToProps)(Cart);