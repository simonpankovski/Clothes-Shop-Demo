import { useState } from "react";
import { connect } from "react-redux";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../redux/actions/cart";
import "../styles/Cart/Cart.scss";
import Cart from "../components/Cart";
import { Currency } from "../types/Category";
import CartItem from "../types/CartItem";
import { useEffect } from "react";
import getPriceAmountForProductPerLabel from "../services/getPriceAmountForProductPerLabel";
interface Props {
  currency: Currency;
  cart: CartItem;
  quantity: Number;
}
interface State {
  cartReducer: { cart: CartItem; quantity: Number; isCartMenuOpen: Boolean };
  currencyReducer: { currency: Currency };
}
function CartView(props: Props) {
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    function updateTotalPriceAndQuantity() {
      const cartItems = Object.values(props.cart);
      const propsQuantity = props.quantity;
      const propsTotal = cartItems.reduce((previousValue, currentValue) => {
        const priceAmount = +getPriceAmountForProductPerLabel(currentValue, props.currency.label);
        return previousValue + priceAmount * currentValue.quantity;
      }, 0);
      setQuantity(+propsQuantity);
      setTotal(propsTotal);
    }
    updateTotalPriceAndQuantity();
  }, [props.cart, props.currency.label, props.quantity]);
  function getTaxValue() {
    const taxValue = 0.21 * total;
    return props?.currency?.symbol + twoDecimalTrunc(taxValue);
  }
  const twoDecimalTrunc = (num: number) => Math.trunc(num * 100) / 100;

  return (
    <main className="main-content cart-content">
      <h1 className="cart-title">Cart</h1>
      <Cart classToSelect={".cart-content "} />
      <div className="add-to-cart-wrapper">
        <p>
          Tax 21%: <span>{getTaxValue()}</span>
        </p>
        <p>
          <>
            Quantity: <span>{quantity}</span>
          </>
        </p>
        <p>
          Total:{" "}
          <span>{props?.currency?.symbol + twoDecimalTrunc(total)}</span>
        </p>
        <button className="add-to-cart-button">ORDER</button>
      </div>
    </main>
  );
}

const mapStateToProps = (state: State) => {
  return {
    cart: state.cartReducer.cart,
    currency: state.currencyReducer.currency,
    quantity: state.cartReducer.quantity,
  };
};
const mapDispatchToProps = {
  ADD_TO_CART,
  REMOVE_FROM_CART,
};
export default connect(mapStateToProps, mapDispatchToProps)(CartView);
