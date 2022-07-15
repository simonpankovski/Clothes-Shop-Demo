import './App.css';
import { Component } from 'react';
import { INCREMENT } from './redux/actions/counter'
import { connect } from "react-redux";
//import Counter from './components/Counter';
import NavBar from './components/NavBar.tsx';
import ProductsView from './views/ProductsView.tsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <NavBar />
        </header>
        <main>
          {/* <h2>Count: {this.props.count}</h2>
          <Counter /> */}
          <ProductsView />
        </main>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    count: state.counterReducer.count
  };
};
const mapDispatchToProps = {
  INCREMENT
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
