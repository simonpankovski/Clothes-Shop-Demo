import React, { Component } from "react";
import { Query } from "@tilework/opus";
import type { DataType } from "@tilework/opus";
import { client } from "@tilework/opus";
import "../styles/NavBar/NavBar.css";
import logo from "../assets/a-logo.svg";
import arrow from "../assets/dropdown-arrow.svg";
import cartIcon from "../assets/cart-icon.svg";
export default class GqlTest extends Component<
  {},
  { currencies: []; categories: [] }
> {
  constructor(props: any) {
    super(props);
    this.toggleCurrenciesMenu = this.toggleCurrenciesMenu.bind(this);
    this.toggleCartMenu = this.toggleCartMenu.bind(this);
    this.state = {
      currencies: [],
      categories: [],
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
    console.log(ev);
    //document.querySelector(".currencies")?.classList.toggle("hidden");
  }

  async toggleCurrenciesMenu(ev) {
    const res = await this.fetchCurrencies();
    let currencies = res.currencies;
    this.setState({
      currencies,
    });
    ev.stopPropagation();
    console.log(ev);
    document.querySelector(".currencies")?.classList.toggle("hidden");
  }
  handleFocusChange() {
    //document.querySelector(".hidden")?.classList.add("hidden");
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  async componentDidMount() {
    let categories = await this.fetchCategories();
    categories = categories.categories;
    this.setState({
      categories,
    });
    console.log(this.state.categories);
  }
  render() {
    return (
      <div className="app-navbar d-flex ai-c jc-space-between">
        <div className="navbar-links">
          {this.state.categories.map((category, index) => (
            <a
              href="#"
              key={index}
              className={index === 0 ? "selected-link" : "not"}
            >
              {this.capitalizeFirstLetter(category.name)}
            </a>
          ))}
        </div>
        <div className="navbar-logo">
          <img src={logo} alt="Brand icon" height="41" width="41" />
        </div>
        <div className="navbar-utils d-flex">
          <div
            className="d-flex dropdown-button ai-c"
            onClick={this.toggleCurrenciesMenu}
          >
            <p className="dollar-icon">$</p>
            <img src={arrow} alt="Dropdown arrow icon" height="11" width="11" />
            <div className="currencies hidden">
              {this.state.currencies.map((el, index) => (
                <li className="d-flex jc-space-between" key={index}>
                  <span>{el.symbol}</span>
                  <span>{el.label}</span>
                </li>
              ))}
            </div>
          </div>
          <div className="cart-icon" onClick={this.toggleCartMenu}>
            <img
              src={cartIcon}
              alt="Dropdown arrow icon"
              height="20"
              width="20"
            />
            <div className="cart-items hidden">
              {this.state.currencies.map((el, index) => (
                <li className="d-flex jc-space-between" key={index}>
                  <span>{el.symbol}</span>
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
