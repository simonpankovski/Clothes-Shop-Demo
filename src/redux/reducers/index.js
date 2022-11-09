import { combineReducers } from "redux";
import counterReducer from "./counter";
import currencyReducer from "./currency";
import cartReducer from "./cart";
import themeReducer from './theme'

export default combineReducers({ currencyReducer, counterReducer, cartReducer, themeReducer });
