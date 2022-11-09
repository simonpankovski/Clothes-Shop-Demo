import React, {
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { DeepReadonlyArray, Query } from "@tilework/opus";
import type { DataType } from "@tilework/opus";
import { client } from "@tilework/opus";
import "../styles/NavBar/NavBar.scss";
import logo from "../assets/a-logo.svg";
import arrow from "../assets/dropdown-arrow.svg";
import Sun from "../assets/sun.svg";
import Moon from "../assets/moon.svg";
import cartIcon from "../assets/cart-icon.svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { SET_CURRENCY } from "../redux/actions/currency";
import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    TOGGLE_CART_MENU,
    CLOSE_CART_MENU,
} from "../redux/actions/cart";
import Cart from "./Cart";
import { Currency } from "../types/Category";
import CartItem from "../types/CartItem";
import { TOGGLE_THEME } from "../redux/actions/theme";
const closeCurrencyMenyStyles = {
    opacity: "1",
    visibility: "visible",
    display: "block",
};
const openCurrencyMenyStyles: React.CSSProperties = {
    opacity: "0",
    visibility: "hidden",
    display: "none",
};
interface Props {
    cart: CartItem;
    SET_CURRENCY: Function;
    TOGGLE_CART_MENU: Function;
    quantity: number;
    currency: Currency;
    isCartMenuOpen: boolean;
    isLightMode: boolean;
    CLOSE_CART_MENU: Function;
    TOGGLE_THEME: Function;
}
interface CategoryNames {
    name: string;
}
interface State {
    cartReducer: { cart: CartItem; quantity: number; isCartMenuOpen: boolean };
    currencyReducer: { currency: Currency };
    themeReducer: { isLightMode: boolean };
}

function setStylesOnElement(styles: Object, element: HTMLElement) {
    Object.assign(element.style, styles);
}

function NavBar(props: Props) {
    const [currencies, setCurrencies] = useState<DeepReadonlyArray<Currency>>(
        []
    );
    const [categories, setCategories] = useState<
        DeepReadonlyArray<CategoryNames>
    >([]);
    const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
    const [total, setTotal] = useState(0);
    const currencyMenuRef = useRef(null);
    const themeToggleRef = useRef(null);
    const dropdownArrowRef = useRef(null);
    const dropdownButtonRef = useRef(null);
    const cartProductsRef = useRef(null);
    const navbarLinksRef = useRef(null);
    function isKeyBoardEvent(
        event: React.MouseEvent<Element> | React.KeyboardEvent<Element>
    ): event is React.KeyboardEvent {
        return (event as React.KeyboardEvent).key !== undefined;
    }
    function openCurrenciesMenu(
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.KeyboardEvent<HTMLDivElement>
    ) {
        let currencyMenu = currencyMenuRef.current as unknown as HTMLElement;
        let arrowIcon = dropdownArrowRef.current as unknown as HTMLElement;
        if (
            currencyMenu === null ||
            arrowIcon === null ||
            (isKeyBoardEvent(event) && event.key !== "Enter")
        )
            return;
        setStylesOnElement(closeCurrencyMenyStyles, currencyMenu);
        arrowIcon["style"].transform = "scale(1, -1)";
        setIsCurrencyMenuOpen(true);
    }

    const toggleTheme = () => {
        props.TOGGLE_THEME();
    };
    const pointerDownListener = useCallback(
        (ev: PointerEvent) => {
            if (
                isCurrencyMenuOpen &&
                (ev.target as HTMLElement)?.closest(".dropdown-button") === null
            ) {
                let currencyMenu =
                    currencyMenuRef.current as unknown as HTMLElement;
                setStylesOnElement(openCurrencyMenyStyles, currencyMenu);
                setIsCurrencyMenuOpen(false);
                let arrow = dropdownArrowRef.current as unknown as HTMLElement;
                arrow["style"].transform = "";
            }
            if (
                props.isCartMenuOpen &&
                (ev.target as HTMLElement)?.closest(".cart-icon") === null
            ) {
                console.log("cart");
                let cartMenu =
                    cartProductsRef.current as unknown as HTMLElement;
                document.body.style.overflowY = "auto";
                props.CLOSE_CART_MENU();
                setStylesOnElement(openCurrencyMenyStyles, cartMenu);
            }
        },
        [isCurrencyMenuOpen, props]
    );
    function changeCurrency(
        selectedCurrency: Currency,
        event?: React.KeyboardEvent | React.MouseEvent
    ) {
        event?.stopPropagation();
        event?.nativeEvent.stopImmediatePropagation();
        const isMouseEvent = event?.nativeEvent instanceof MouseEvent;
        if (
            !isMouseEvent &&
            (event as unknown as KeyboardEvent).key !== "Enter"
        ) {
            return;
        }
        props.SET_CURRENCY(selectedCurrency);
        closeCurrencyMenu();
    }
    function closeCurrencyMenu() {
        let dropdownButton = dropdownButtonRef.current;
        let currencyMenu = currencyMenuRef.current as unknown as HTMLElement;
        let arrowIcon = dropdownArrowRef.current as unknown as HTMLElement;
        if (
            dropdownButton === null ||
            arrowIcon === null ||
            currencyMenu === null
        )
            return false;
        setStylesOnElement(openCurrencyMenyStyles, currencyMenu);
        arrowIcon["style"].transform = "";
        setIsCurrencyMenuOpen(false);
        (dropdownButton as HTMLElement).focus();
    }
    function isLinkSelected(category: CategoryNames) {
        const search = window.location.pathname;
        return search.includes(category?.name);
    }
    const memoizedGetCartTotalPrice = useCallback(getCartTotalPrice, [
        getCartTotalPrice,
    ]);
    function getCartTotalPrice() {
        const cartItemsClone = Object.values(props.cart);
        return cartItemsClone.reduce((previousValue, currentValue) => {
            return (
                previousValue +
                +getPriceAmountForProductPerLabel(currentValue) *
                    currentValue.quantity
            );
        }, 0);
    }
    function getPriceAmountForProductPerLabel(product: CartItem) {
        const prod = product.prices.find(
            (price) => price.currency.label === props.currency.label
        );
        return prod?.amount ?? 0;
    }
    const twoDecimalTrunc = (num: number): number =>
        Math.trunc(num * 100) / 100;
    useEffect(() => {
        async function fetchCategories() {
            const query = new Query("categories", true).addField("name");
            let result: DataType<typeof query>;
            client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
            result = await client.post(query);
            setCategories(await result.categories);
        }
        fetchCategories();
        async function fetchCurrencies() {
            const query = new Query("currencies", true).addFieldList([
                "label",
                "symbol",
            ]);
            let result: DataType<typeof query>;
            client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
            result = await client.post(query);
            setCurrencies(result.currencies);
        }
        fetchCurrencies();
    }, []);

    useEffect(() => {
        let prevTarget = null;
        function focusHandler(event: FocusEvent) {
            console.log(event.target);
            if (
                (event.target as HTMLElement).classList.contains("focus-out") &&
                !(event.relatedTarget as HTMLElement).classList.contains(
                    "currency-item"
                )
            ) {
                closeCurrencyMenu();
            }
            if (isCurrencyMenuOpen) closeCurrencyMenu()
        }
        document.addEventListener("focusout", focusHandler);
    }, []);

    useEffect(() => {
        document.addEventListener("pointerdown", pointerDownListener);
        return () =>
            document.removeEventListener("pointerdown", pointerDownListener);
    }, [pointerDownListener]);
    const toggleCartMenu = useCallback(
        (event?: React.MouseEvent<Element, MouseEvent>) => {
            let cartMenu = cartProductsRef.current as unknown as HTMLElement;
            const containsAdjustQuantity =
                event !== undefined &&
                (event?.target as HTMLElement).classList.contains(
                    "adjust-quantity"
                );
            if (cartMenu === null || containsAdjustQuantity) return;
            props.TOGGLE_CART_MENU();

            if (!props.isCartMenuOpen) {
                setStylesOnElement(closeCurrencyMenyStyles, cartMenu);
                document.body.style.overflowY = "hidden";
            } else {
                setStylesOnElement(openCurrencyMenyStyles, cartMenu);
                document.body.style.overflowY = "auto";
            }
        },
        [props]
    );
    useEffect(() => {
        setTotal(memoizedGetCartTotalPrice());
        //toggleCartMenu();
    }, [
        memoizedGetCartTotalPrice,
        props,
        props.cart,
        props.isCartMenuOpen,
        toggleCartMenu,
    ]);
    function toggleSelectedClass(event: React.MouseEvent<Element, MouseEvent>) {
        Array.from(
            (navbarLinksRef.current as unknown as HTMLElement).children
        ).forEach((el) => {
            el.classList.remove("selected-link");
        });
        (event.target as HTMLElement).classList.add("selected-link");
    }
    const cartCount = +props.quantity;
    return (
        <header className="app-navbar d-flex ai-c jc-space-between">
            <div className="navbar-links" ref={navbarLinksRef}>
                {categories.map((category, index) => (
                    <Link
                        key={index}
                        onClick={(ev) => toggleSelectedClass(ev)}
                        className={
                            isLinkSelected(category) ? "selected-link" : ""
                        }
                        to={"/" + category.name}
                    >
                        {category.name.toUpperCase()}
                    </Link>
                ))}
            </div>
            <div className="navbar-logo">
                <img src={logo} alt="Brand icon" />
            </div>
            <div className="navbar-utils d-flex">
                <button
                    aria-label="Toggle dark mode"
                    className={"d-flex ai-c toggle-theme-button mx-1"}
                    onClick={toggleTheme}
                >
                    <img
                        className={
                            props.isLightMode ? "" : "animate-icon-toggle"
                        }
                        src={props.isLightMode ? Moon : Sun}
                        ref={themeToggleRef}
                        alt="Toggle dark mode icon"
                        height="16"
                        width="16"
                    />
                </button>
                <div
                    tabIndex={0}
                    className="d-flex dropdown-button ai-c"
                    onClick={openCurrenciesMenu}
                    onKeyDown={openCurrenciesMenu}
                    ref={dropdownButtonRef}
                >
                    <p className="dollar-icon">{props.currency.symbol}</p>
                    <img
                        className="dropdown-arrow"
                        src={arrow}
                        ref={dropdownArrowRef}
                        alt="Dropdown arrow icon"
                        height="11"
                        width="11"
                    />
                    <div
                        className="currencies"
                        style={openCurrencyMenyStyles}
                        ref={currencyMenuRef}
                    >
                        {currencies.map((el, index) => {
                            return (
                                <button
                                    tabIndex={isCurrencyMenuOpen ? 0 : -1}
                                    id={"index"}
                                    className={
                                        "d-flex jc-space-between currency-item " +
                                        (props.currency.label === el.label
                                            ? "selected-currency"
                                            : "") +
                                        (index === 0 ||
                                        index === currencies.length - 1
                                            ? "focus-out"
                                            : "")
                                    }
                                    onClick={(event) => {
                                        changeCurrency(el, event);
                                    }}
                                    key={index}
                                >
                                    <span>{el.symbol}</span>
                                    <span>{el.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <button className="cart-icon mx-1" onClick={toggleCartMenu}>
                    <img
                        src={cartIcon}
                        alt="Cart icon"
                        height="20"
                        width="20"
                    />
                    <div className="cart-count">
                        <p>{cartCount > 0 ? cartCount : ""}</p>
                    </div>
                    <div className="cart-products" ref={cartProductsRef}>
                        <p>
                            My Bag. <span>{cartCount + " Items"}</span>
                        </p>
                        <Cart classToSelect={""} />
                        <p className="navbar-total">
                            Total:{" "}
                            <span>
                                {twoDecimalTrunc(total)}
                                {props.currency.symbol}
                            </span>
                        </p>
                        <div className="cart-buttons d-flex">
                            <Link to={"/cart"} className="view-bag-button">
                                VIEW BAG
                            </Link>
                            <Link to={""} className="view-bag-button">
                                CHECKOUT
                            </Link>
                        </div>
                    </div>
                </button>
            </div>
        </header>
    );
}

const mapStateToProps = (state: State) => {
    return {
        cart: state.cartReducer.cart,
        currency: state.currencyReducer.currency,
        quantity: state.cartReducer.quantity,
        isCartMenuOpen: state.cartReducer.isCartMenuOpen,
        isLightMode: state.themeReducer.isLightMode,
    };
};
const mapDispatchToProps = {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    SET_CURRENCY,
    TOGGLE_CART_MENU,
    CLOSE_CART_MENU,
    TOGGLE_THEME,
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
