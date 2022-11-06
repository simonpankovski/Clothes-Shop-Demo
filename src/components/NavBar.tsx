import React, { useCallback, useEffect, useRef, useState } from "react";
import { DeepReadonlyArray, Query } from "@tilework/opus";
import type { DataType } from "@tilework/opus";
import { client } from "@tilework/opus";
import "../styles/NavBar/NavBar.scss";
import logo from "../assets/a-logo.svg";
import arrow from "../assets/dropdown-arrow.svg";
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
const closeCurrencyMenyStyles = {
  opacity: "1",
  visibility: "visible",
  "box-shadow":
    "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.06) 0px 0px 8px",
};
const openCurrencyMenyStyles = {
  opacity: "0",
  visibility: "hidden",
};
interface Props {
  cart: CartItem;
  SET_CURRENCY: Function;
  TOGGLE_CART_MENU: Function;
  quantity: Number;
  currency: Currency;
  isCartMenuOpen: Boolean;
  CLOSE_CART_MENU: Function;
}
interface CategoryNames {
  name: string;
}
interface State {
  cartReducer: { cart: CartItem; quantity: Number; isCartMenuOpen: Boolean };
  currencyReducer: { currency: Currency };
}
async function fetchCurrencies() {
  const query = new Query("currencies", true).addFieldList(["label", "symbol"]);
  let result: DataType<typeof query>;
  client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
  result = await client.post(query);
  return result;
}

function setStylesOnElement(styles: Object, element: HTMLElement) {
  Object.assign(element.style, styles);
}

function NavBar(props: Props) {
  const [currencies, setCurrencies] = useState<DeepReadonlyArray<Currency>>([]);
  const [categories, setCategories] = useState<
    DeepReadonlyArray<CategoryNames>
  >([]);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const currencyMenuRef = useRef(null);
  const dropdownArrowRef = useRef(null);
  const cartProductsRef = useRef(null);
  const navbarLinksRef = useRef(null);

  function toggleCurrenciesMenu() {
    let currencyMenu = currencyMenuRef.current as unknown as HTMLElement;
    let arrowIcon = dropdownArrowRef.current as unknown as HTMLElement;

    if (currencyMenu === null || arrowIcon === null) return;
    if (!isCurrencyMenuOpen) {
      setStylesOnElement(closeCurrencyMenyStyles, currencyMenu);
      arrowIcon["style"].transform = "scale(1, -1)";
    } else {
      setStylesOnElement(openCurrencyMenyStyles, currencyMenu);
      arrowIcon["style"].transform = "";
    }
  }
  async function handleCurrenciesMenu(
    event: React.MouseEvent<Element, MouseEvent>
  ) {
    event.stopPropagation();
    const response = await fetchCurrencies();
    setCurrencies(response.currencies);
    setIsCurrencyMenuOpen((isCurrencyMenuOpen) => !isCurrencyMenuOpen);
    toggleCurrenciesMenu();
  }
  function toggleCartMenu(event: React.MouseEvent<Element, MouseEvent>) {
    let cartMenu = cartProductsRef.current as unknown as HTMLElement;
    if (
      cartMenu === null ||
      (event.target as HTMLElement).classList.contains("adjust-quantity")
    )
      return;
    props.TOGGLE_CART_MENU();

    if (!props.isCartMenuOpen) {
      setStylesOnElement(closeCurrencyMenyStyles, cartMenu);
      document.body.style.overflowY = "hidden";
    } else {
      setStylesOnElement(openCurrencyMenyStyles, cartMenu);
      document.body.style.overflowY = "auto";
    }
  }
  const pointerDownListener = useCallback((ev: PointerEvent) => {
    if (
      isCurrencyMenuOpen &&
      (ev.target as HTMLElement)?.closest(".dropdown-button") === null
    ) {
      let currencyMenu = currencyMenuRef.current as unknown as HTMLElement;
      setStylesOnElement(openCurrencyMenyStyles, currencyMenu);
      setIsCartMenuOpen(false);
      let arrow = dropdownArrowRef.current as unknown as HTMLElement;
      arrow["style"].transform = "";
    } else if (
      props.isCartMenuOpen &&
      (ev.target as HTMLElement)?.closest(".cart-icon") === null
    ) {
      let cartMenu = cartProductsRef.current as unknown as HTMLElement;
      document.body.style.overflowY = "auto";
      props.CLOSE_CART_MENU();
      setStylesOnElement(openCurrencyMenyStyles, cartMenu);
    }
  }, [isCurrencyMenuOpen, props])
  
  function closeCurrencyMenuOnDocumentClick() {
    document.addEventListener("pointerdown", pointerDownListener);
  }
  function changeCurrency(selectedCurrency: Currency) {
    props.SET_CURRENCY(selectedCurrency);
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
        +getPriceAmountForProductPerLabel(currentValue) * currentValue.quantity
      );
    }, 0);
  }
  function getPriceAmountForProductPerLabel(product: CartItem) {
    const prod = product.prices.find(
      (price) => price.currency.label === props.currency.label
    );
    return prod?.amount ?? 0;
  }
  const twoDecimalTrunc = (num: number): number => Math.trunc(num * 100) / 100;
  useEffect(() => {
    async function fetchCategories() {
      const query = new Query("categories", true).addField("name");
      let result: DataType<typeof query>;
      client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
      result = await client.post(query);
      setCategories(await result.categories);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    document.addEventListener("pointerdown", pointerDownListener);
    return () =>
      document.removeEventListener("pointerdown", pointerDownListener);
  }, [pointerDownListener]);

  useEffect(() => {
    setTotal(memoizedGetCartTotalPrice());
    // setIsCartMenuOpen(!!props.isCartMenuOpen);
    //toggleCartMenu()
  }, [memoizedGetCartTotalPrice, props.cart]);
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
            className={isLinkSelected(category) ? "selected-link" : ""}
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
        <div
          className="d-flex dropdown-button ai-c"
          onClick={handleCurrenciesMenu}
        >
          <p className="dollar-icon">$</p>
          <img
            className="dropdown-arrow"
            src={arrow}
            ref={dropdownArrowRef}
            alt="Dropdown arrow icon"
            height="11"
            width="11"
          />
          <div className="currencies" ref={currencyMenuRef}>
            {currencies.map((el, index) => (
              <li
                className={
                  "d-flex jc-space-between " +
                  (props.currency.label === el.label ? "selected-currency" : "")
                }
                onClick={() => {
                  changeCurrency(el);
                }}
                key={index}
              >
                <span>{el.symbol}</span>
                <span>{el.label}</span>
              </li>
            ))}
          </div>
        </div>
        <div className="cart-icon" 
       onClick={toggleCartMenu}
        >
          <img src={cartIcon} alt="Cart icon" height="20" width="20" />
          <div className="cart-count">
            <p>{cartCount > 0 ? cartCount : ""}</p>
          </div>
          <div className="cart-products" ref={cartProductsRef}
          >
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
              <button className="view-bag-button">CHECKOUT</button>
            </div>
          </div>
        </div>
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
  };
};
const mapDispatchToProps = {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_CURRENCY,
  TOGGLE_CART_MENU,
  CLOSE_CART_MENU,
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
