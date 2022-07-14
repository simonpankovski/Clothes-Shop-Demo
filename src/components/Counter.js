import React from "react";
import { connect } from "react-redux";
import { INCREMENT } from "../redux/actions/counter";

class Counter extends React.Component {
  handleIncrement() {
    this.props.INCREMENT();
  }

  render() {
    return <button onClick={() => this.handleIncrement()}>Increase</button>;
  }
}

export default connect(null, { INCREMENT })(Counter);
