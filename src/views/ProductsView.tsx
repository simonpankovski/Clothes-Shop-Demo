import {
  client,
  DataType,
  DeepReadonlyArray,
  Field,
  Query,
} from "@tilework/opus";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import "../styles/Products/ProductsView.scss";
import arrow from "../assets/dropdown-arrow.svg";
import capitalizeFirstLetter from "../components/capitalizeFirstLetter";
import { connect } from "react-redux";
import { SET_CURRENCY } from "../redux/actions/currency.js";
import { Currency } from "../types/Category";
import CartItem from "../types/CartItem";
import { useLocation } from "react-router-dom";
interface Props {
  selectedCurrency: Currency;
}
interface State {
  currencyReducer: { currency: Currency };
}
function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function ProductsView({ selectedCurrency }: Props) {
  let location = useLocation();
  const [products, setProducts] = useState<DeepReadonlyArray<any>>([]); // Update the any type
  const [category, setCategory] = useState<String>("");
  const [currency, setCurrency] = useState<Currency>({
    label: "USD",
    symbol: "$",
  });

  useEffect(() => {
    async function fetchProductsPerCategory(category: String) {
      const query = new Query("category")
        .addArgument("input", "CategoryInput", { title: category })
        .addField("name")
        .addField(
          new Field("products", true)
            .addFieldList(["id", "name", "gallery", "inStock", "brand"])
            .addField(
              new Field("attributes", true)
                .addFieldList(["id", "name", "type"])
                .addField(
                  new Field("items", true).addFieldList([
                    "value",
                    "displayValue",
                    "id",
                  ])
                )
            )
            .addField(
              new Field("prices", true)
                .addField(
                  new Field("currency", true).addFieldList(["label", "symbol"])
                )
                .addField("amount")
            )
        );

      let result: DataType<typeof query>;
      client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
      result = await client.post(query);
      setProducts(result.category.products);
    }
    const categoryParam = window.location.pathname.split("/")[1];
    fetchProductsPerCategory(category);
    setCategory(categoryParam);
    setCurrency(selectedCurrency);
  }, [category, location, selectedCurrency]);

  useEffect(() => {
    setCurrency(selectedCurrency);
  }, [selectedCurrency]);

  const props = { selectedCurrency };
  return (
    <section className="main-content">
      <h1 className="products-category">{capitalizeFirstLetter(category)}</h1>
      <div className="catalog">
        {products.map((product, index) => (
          <Product
            key={index}
            selectedCurrency={currency}
            product={product as CartItem}
            propsObject={props}
          />
        ))}
        <div className="scroll-to-top-button" onClick={scrollToTop}>
          <img src={arrow} alt="Dropdown arrow icon" height="11" width="11" />
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {
    selectedCurrency: state.currencyReducer.currency,
  };
};
const mapDispatchToProps = {
  SET_CURRENCY,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductsView);
