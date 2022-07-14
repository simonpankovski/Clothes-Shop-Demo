import { combineReducers } from "redux";
import counterReducer from "./counter";
import testReducer from "./testReducer";

export default combineReducers({ counterReducer, testReducer });
