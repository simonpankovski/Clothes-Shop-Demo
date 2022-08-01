import { Component } from 'react';
import { INCREMENT } from './redux/actions/counter';
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from './components/NavBar.tsx';
import ProductsView from './views/ProductsView.tsx';
import ProductDisplayView from './views/ProductView.tsx';
import Cart from './views/CartView.tsx';
class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <NavBar />
        </header>
        <main>
          <div className={(this.props.isCartMenuOpen ? 'cart-content-overlay' : '')}></div>
          <Switch>
            <Route exact path="/">
              <Redirect to="/all" />
            </Route>
            <Route path="/cart" component={Cart}/>
            <Route path="/product/:id" ><ProductDisplayView /></Route>
            <Route path="/:category" component={ProductsView} />
          </Switch>
        </main>
      </div >
    );
  }
}
const mapStateToProps = (state) => {
  return {
    count: state.counterReducer.count,
    isCartMenuOpen: state.cartReducer.isCartMenuOpen
  };
};
const mapDispatchToProps = {
  INCREMENT
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
