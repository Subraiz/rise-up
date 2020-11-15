import React, { Component, createRef } from "react";
import { withRouter } from "react-router";
import { Map, Protests } from "../../components";
import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.mapRef = createRef();

    this.state = {
      protests: null,
    };
  }

  setProtest = (protests) => {
    console.log(protests);

    this.setState({ protests });
  };

  render() {
    return (
      <div className="home-container">
        <div className="nav-container">
          <button
            className="create-protest btn"
            onClick={() => {
              this.props.history.push("create-protest");
            }}
          >
            + Create a Protest
          </button>
        </div>
        <Map ref={(el) => (this.mapRef = el)} setProtest={this.setProtest} />
        {this.state.protests ? (
          <Protests protests={this.state.protests} />
        ) : null}
      </div>
    );
  }
}

Home = withRouter(Home);

export { Home };
