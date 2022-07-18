import { combineReducers } from "redux";
import counterReducer from "./counter";
import currencyReducer from "./currency";

export default combineReducers({ currencyReducer, counterReducer  });
