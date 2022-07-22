import React, { Component } from "react";
import { DeepReadonlyArray, Query } from "@tilework/opus";
import type { DataType } from "@tilework/opus";
import { client } from "@tilework/opus";
import "../styles/NavBar/NavBar.scss";
import logo from "../assets/a-logo.svg";
import arrow from "../assets/dropdown-arrow.svg";
import cartIcon from "../assets/cart-icon.svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { SET_CURRENCY } from '../redux/actions/currency';
import { ADD_TO_CART, REMOVE_FROM_CART } from "../redux/actions/cart";
import Cart from "./Cart.tsx";
import { Category, CategoryShape, Currency } from "../types/Category";
const closeCurrencyMenyStyles = {
  opacity: "1",
  visibility: "visible",
  "box-shadow": "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.06) 0px 0px 8px",
}
const openCurrencyMenyStyles = {
  opacity: "0",
  visibility: "hidden"
}

class NavBar extends React.Component<
  {
    SET_CURRENCY: Function,
    quantity: Number,
    currency: Currency
  },
  {
    currencies: DeepReadonlyArray<Currency>;
    categories: DeepReadonlyArray<CategoryShape>,
    isCurrencyMenuOpen: Boolean,
    cartCount: Number,
    isCartMenuOpen: boolean
  }
> {
  constructor(props: any) {
    super(props);
    this.handleCurrenciesMenu = this.handleCurrenciesMenu.bind(this);
    this.toggleCartMenu = this.toggleCartMenu.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.state = {
      currencies: [],
      categories: [],
      isCurrencyMenuOpen: false,
      isCartMenuOpen: false,
      cartCount: 0
    };
  }
  async fetchCurrencies() {
    const query = new Query("currencies", true).addFieldList([
      "label",
      "symbol",
    ]);
    let result: DataType<typeof query>;
    client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
    result = await client.post(query);
    return result;
  }
  async fetchCategories() {
    const query = new Query("categories", true).addField("name");
    let result: DataType<typeof query>;
    client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
    result = await client.post(query);
    return result;
  }
  setStylesOnElement(styles, element) {
    Object.assign(element.style, styles);
  }
  toggleCurrenciesMenu() {
    let currencyMenu = document.querySelector(".currencies");
    let arrowIcon = document.querySelector(".dropdown-arrow");

    if (currencyMenu === null || arrowIcon === null) return;
    if (!this.state.isCurrencyMenuOpen) {
      this.setStylesOnElement(closeCurrencyMenyStyles, currencyMenu)
      arrowIcon['style'].transform = "scale(1, -1)"
    }
    else {
      this.setStylesOnElement(openCurrencyMenyStyles, currencyMenu)
      arrowIcon['style'].transform = "";
    }
  }
  async handleCurrenciesMenu(ev) {
    const res = await this.fetchCurrencies();
    let currencies = res.currencies;
    this.setState({
      currencies,
      isCurrencyMenuOpen: !this.state.isCurrencyMenuOpen
    });
    ev.stopPropagation();
    this.toggleCurrenciesMenu();
  }
  toggleCartMenu() {
    let cartMenu = document.querySelector(".cart-products");
    if (cartMenu === null) return;
    if (!this.state.isCartMenuOpen) {
      this.setStylesOnElement(closeCurrencyMenyStyles, cartMenu)
    }
    else {
      this.setStylesOnElement(openCurrencyMenyStyles, cartMenu)
    }
    this.setState({
      isCartMenuOpen: !this.state.isCartMenuOpen
    });
  }
  closeCurrencyMenuOnDocumentClick() {
    document.addEventListener("click", (ev) => {
      if (this.state.isCurrencyMenuOpen && (ev.target as HTMLElement)?.closest(".dropdown-button") == null) {
        let currencyMenu = document.querySelector(".currencies");
        this.setStylesOnElement(openCurrencyMenyStyles, currencyMenu)
        this.setState({
          isCurrencyMenuOpen: false
        });
        let arrow = document.querySelector(".dropdown-arrow") as HTMLElement;
        arrow['style'].transform = "";
      }
      else if(this.state.isCartMenuOpen && (ev.target as HTMLElement)?.closest(".cart-icon") == null){
        let cartMenu = document.querySelector(".cart-products");
        this.setStylesOnElement(openCurrencyMenyStyles, cartMenu)
        this.setState({
          iscartMenuOpen: false
        });
      }
    })
  }
  changeCurrency(ev, el) {
    this.props.SET_CURRENCY(el);
  }
  isLinkSelected(category: CategoryShape) {
    const search = window.location.pathname;
    return search.includes(category?.name);
  }
  componentDidUpdate() {
    const quantity = this.props.quantity;
    if (quantity !== this.state.cartCount) {
      this.setState({
        cartCount: quantity
      });
    }
  }
  async componentDidMount() {
    console.log(this.props.currency)
    let categories = await this.fetchCategories();
    this.closeCurrencyMenuOnDocumentClick()
    categories = categories.categories;
    this.setState({
      categories,
      cartCount: this.props.quantity
    });
  }
  toggleSelectedClass(ev) {
    document.querySelectorAll(".navbar-links a").forEach(el => {
      el.classList.remove("selected-link");
    })
    ev.target.classList.add("selected-link");
  }

  render() {
    return (
      <div className="app-navbar d-flex ai-c jc-space-between">
        <div className="navbar-links">
          {this.state.categories.map((category, index) => (
            <Link key={index} onClick={ev => this.toggleSelectedClass(ev)} className={this.isLinkSelected(category) ? "selected-link" : ""} to={"/" + category.name}>
              {category.name.toUpperCase()}</Link>
          ))}
        </div>
        <div className="navbar-logo">
          <img src={logo} alt="Brand icon" />
        </div>
        <div className="navbar-utils d-flex">
          <div
            className="d-flex dropdown-button ai-c"
            onClick={this.handleCurrenciesMenu}
          >
            <p className="dollar-icon">$</p>
            <img className="dropdown-arrow" src={arrow} alt="Dropdown arrow icon" height="11" width="11" />
            <div className="currencies">
              {this.state.currencies.map((el, index) => (
                <li className={"d-flex jc-space-between " + (this.props.currency.label === el.label ? "selected-currency" : "")} onClick={(ev) => { this.changeCurrency(ev, el) }} key={index}>
                  <span>{el.symbol}</span>
                  <span>{el.label}</span>
                </li>
              ))}
            </div>
          </div>
          <div className="cart-icon" onClick={this.toggleCartMenu}>
            <img
              src={cartIcon}
              alt="Cart icon"
              height="20"
              width="20"
            />
            <div className="cart-count"><p>{(this.state.cartCount) > 0 ? this.state.cartCount : ""}</p></div>
            <div className="cart-products">
              <p>My Bag. <span>{this.state.cartCount + " Items"}</span></p>
              <Cart classToSelect={""}/>
              <div className="cart-buttons d-flex">
                <Link to={"/cart"} className="view-bag-button">VIEW BAG</Link>
                <button className="view-bag-button">CHECKOUT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
  REMOVE_FROM_CART,
  SET_CURRENCY
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);