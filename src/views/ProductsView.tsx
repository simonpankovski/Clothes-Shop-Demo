import { client, DataType, Field, Query } from '@tilework/opus';
import React, { Component } from 'react';
import Product from '../components/Product.tsx';
import "../styles/Products/ProductsView.css";
import arrow from "../assets/dropdown-arrow.svg";
import capitalizeFirstLetter from '../components/capitalizeFirstLetter.ts';
import { connect } from 'react-redux';
import { SET_CURRENCY } from '../redux/actions/currency.js';
class ProductsView extends Component<
    {},
    {
        products: Array<any>,
        category: String,
        currencyIndex: Number,
        currency: Object
    }
> {
    constructor(props: any) {
        super(props);
        this.state = {
            products: [],
            category: "",
            currencyIndex: 0,
            currency: { label: "USD", symbol: "$" }
        };
    }
    async fetchProductsPerCategory() {
        const query = new Query("categories", true).addField("name").addField(new Field("products", true).addFieldList(["id", "name", "gallery", "inStock", "brand"])
            .addField(new Field("prices", true).addField(new Field("currency", true)
                .addFieldList(["label", "symbol"])).addField("amount")));

        let result: DataType<typeof query>;
        client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
        result = await client.post(query);
        return result;
    }
    async componentDidMount() {
        const productsPerCategory = await this.fetchProductsPerCategory();
        const category = window.location.pathname.split("/")[1]
        const products = productsPerCategory.categories.filter(cat => category.includes(cat.name))[0].products;
        const currency = this.props.currency;
        this.setState({
            products,
            category,
            currency
        });
    }
    componentDidUpdate(prevProps) {
        const propsCurrency = this.props.currency;
        if (prevProps.currency != propsCurrency) {
            this.setState({
                currency: propsCurrency
            })
            console.log(this.state)
        }
        console.log("update")
    }
    scrollToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    render() {
        return (
            <section className='main-content'>
                <h1 className='products-category'>{capitalizeFirstLetter(this.state.category)}</h1>
                <div className='catalog'>
                    {this.state.products.map((product, index) =>
                        <Product key={index} product={product} currency={this.state.currency} />
                    )}
                    <div className='scroll-to-top-button' onClick={this.scrollToTop}><img src={arrow} alt="Dropdown arrow icon" height="11" width="11" /></div>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        currency: state.currencyReducer.currency
    };
};
const mapDispatchToProps = {
    SET_CURRENCY
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductsView);