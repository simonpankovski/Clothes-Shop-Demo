import React, { Component } from "react";
import { Query } from "@tilework/opus";
import type { DataType } from "@tilework/opus";
import { client } from "@tilework/opus";
import "../styles/NavBar/NavBar.css";
import logo from "../assets/a-logo.svg";
import arrow from "../assets/dropdown-arrow.svg";
import cartIcon from "../assets/cart-icon.svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { SET_CURRENCY } from '../redux/actions/currency';
class NavBar extends Component<
  {},
  {
    currencies: Array<any>;
    categories: Array<any>,
    isCurrencyMenuOpen: Boolean,
    cartCount: Number
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

  async toggleCartMenu(ev) {
    //document.querySelector(".currencies")?.classList.toggle("hidden");
  }
  toggleCurrenciesMenu() {
    let currencyMenu = document.querySelector(".currencies");
    let arrow = document.querySelector(".dropdown-arrow");
    if (currencyMenu === null || arrow === null) return;
    if (!this.state.isCurrencyMenuOpen) {
      currencyMenu.style.opacity = "1";
      currencyMenu.style.visibility = "visible";
      currencyMenu.style["box-shadow"] = "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.06) 0px 0px 8px";
      arrow.style.transform = "scale(1, -1)"
    }
    else {
      currencyMenu.style.opacity = "0";
      currencyMenu.style.visibility = "hidden";
      arrow.style.transform = "";
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
  closeCurrencyMenuOnDocumentClick() {
    document.addEventListener("click", (ev) => {
      //console.log(ev.target?.closest(".dropdown-button") != null);
      if (this.state.isCurrencyMenuOpen && ev.target?.closest(".dropdown-button") == null) {
        let currencyMenu = document.querySelector(".currencies");
        currencyMenu.style.opacity = "0";
        currencyMenu.style.visibility = "hidden";
        this.setState({
          isCurrencyMenuOpen: false
        });
        let arrow = document.querySelector(".dropdown-arrow");
        arrow.style.transform = "";
      }
    })
  }
  changeCurrency(ev, el) {
    this.props.SET_CURRENCY(el);
  }
  isLinkSelected(category: String) {
    const search = window.location.pathname;
    return search.includes(category?.name);
  }
  componentDidUpdate(prevProps) {
    const cartItems = Object.values(this.props.cart).map(item => item.quantity);
    const prevQuantity = cartItems.reduce((previousValue, currentValue) => { return previousValue + currentValue}, 0)

    if (prevQuantity !== this.state.cartCount) {
      console.log("succ")
      this.setState({
        cartCount: prevQuantity
      });
    }
  }
  async componentDidMount() {
    let categories = await this.fetchCategories();
    this.closeCurrencyMenuOnDocumentClick()
    categories = categories.categories;
    const cartItems = Object.values(this.props.cart).map(item => item.quantity);
    this.setState({
      categories,
      cartCount: cartItems.reduce((previousValue, currentValue) => { return previousValue + currentValue}, 0)
    });
  }
  toggleSelectedClass(ev, category) {
    document.querySelectorAll(".navbar-links a").forEach(el => {
      el.classList.remove("selected-link");
    })
    ev.target.classList.add("selected-link");
    window.location.href = "/" + category.name
  }

  render() {
    return (
      <div className="app-navbar d-flex ai-c jc-space-between">
        <div className="navbar-links">
          {this.state.categories.map((category, index) => (
            <Link key={index} onClick={ev => this.toggleSelectedClass(ev, category)} className={this.isLinkSelected(category) ? "selected-link" : ""} to={"/" + category.name}>
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
                <li className="d-flex jc-space-between" onClick={(ev) => { this.changeCurrency(ev, el) }} key={index}>
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
            <div className="cart-items hidden">
              {this.state.currencies.map((el, index) => (
                <li className="d-flex jc-space-between" key={index} >
                  <span >{el.symbol}</span>
                  <span>{el.label}</span>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cart: state.cartReducer.cart
  };
};
export default connect(mapStateToProps, { SET_CURRENCY })(NavBar);