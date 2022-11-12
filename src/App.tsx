import { INCREMENT } from "./redux/actions/counter";
import { connect } from "react-redux";
import NavBar from "./components/NavBar";
import ProductsView from "./views/ProductsView";
import ProductDisplayView from "./views/ProductView";
import Cart from "./views/CartView";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

interface CounterReducer {
    count: number;
}
interface CartReducer {
    isCartMenuOpen: boolean;
}
interface StateType {
    counterReducer: CounterReducer;
    cartReducer: CartReducer;
    themeReducer: { isLightMode: boolean };
}
interface Props {
    isCartMenuOpen: boolean;
    count: number;
    isLightMode: boolean;
}
function App({ isCartMenuOpen, isLightMode }: Props) {
    useEffect(() => {
        if (isLightMode) {
            document.querySelector("html")?.classList.remove("dark");
        } else {
            document.querySelector("html")?.classList.add("dark");
        }
    }, [isLightMode]);

    return (
        <main className={"App"}>
            <div className={isCartMenuOpen ? "cart-content-overlay" : ""}></div>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Navigate to={"/all"} />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                        path="/product/:id"
                        element={<ProductDisplayView />}
                    />
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
        isLightMode: state.themeReducer.isLightMode,
    };
};
const mapDispatchToProps = {
    INCREMENT,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
