import React, { Component } from 'react'
import { connect } from 'react-redux'

class CartView extends Component<{}, {
    cartItems: Array<Object>
}> {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: []
        }
    }
    componentDidMount() {
        if (this.state.cartItems.length === 0) {
            this.setState({
                cartItems: Object.values(this.props.cart)
            })
        }
    }
    render() {
        return (
            <div>
                <h1>Cart</h1>
                {this.state.cartItems.map((item, index) =>
                    <div key={index}>{item.quantity}</div>
                )}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.cartReducer.cart
    };
};
export default connect(mapStateToProps, null)(CartView);
