import './App.css';
import { Component } from 'react';
import { INCREMENT } from './redux/actions/counter'
import { connect } from "react-redux";
import Counter from './components/Counter';
import GqlTest from './components/GqlTest.tsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">

          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <main>
          <h2>Count: {this.props.count}</h2>
          <Counter />
          <GqlTest />
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
