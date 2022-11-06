import { INCREMENT } from "./redux/actions/counter";
import { connect } from "react-redux";
import NavBar from "./components/NavBar";
import ProductsView from "./views/ProductsView";
import ProductDisplayView from "./views/ProductView";
import Cart from "./views/CartView";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

interface CounterReducer {
  count: Number;
}
interface CartReducer {
  isCartMenuOpen: Boolean;
}
interface StateType {
  counterReducer: CounterReducer;
  cartReducer: CartReducer;
}
interface Props {
  isCartMenuOpen: Boolean;
  count: Number;
}
function App({ isCartMenuOpen }: Props) {
  return (
    <main className="App">
      <div className={isCartMenuOpen ? "cart-content-overlay" : ""}></div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to={"/all"} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDisplayView />} />
          <Route path="/:category" element={<ProductsView />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}
const mapStateToProps = (state: StateType) => {
  return {
    count: state.counterReducer.count,
    isCartMenuOpen: state.cartReducer.isCartMenuOpen,
  };
};
const mapDispatchToProps = {
  INCREMENT,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
