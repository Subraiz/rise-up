import React, { Component, createRef } from "react";
import { withRouter } from "react-router";
import { IoMdLocate } from "react-icons/io";
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
    this.setState({ protests });
  };

  render() {
    return (
      <div className="home-container">
        <div className="nav-container">
          <h1 className="title">Rise Up</h1>
          <p className="subtitle">Join the Fight</p>
          <p
            className="create-protest-btn"
            onClick={() => {
              this.props.history.push("create-protest");
            }}
          >
            Create a Protest
          </p>
          <p className="nav-header">Donate To Your Cause</p>
          <p className="cause">Police Brutality</p>
          <p className="cause">Black Lives Matter</p>
          <p className="cause">Civil Unrest in Sudan</p>
          <p className="create-protest-btn rights">Know Your Rights</p>

          <p className="version">Alpha v0.0.1 - Hack The Heights Prototype</p>
        </div>
        <div className="second-container">
          <div className="reset-map">
            <IoMdLocate
              className="locate-icon"
              onClick={() => {
                this.mapRef.zoom();
              }}
            />
          </div>
          <Map ref={(el) => (this.mapRef = el)} setProtest={this.setProtest} />
        </div>

        {this.state.protests ? (
          <Protests protests={this.state.protests} />
        ) : null}
      </div>
    );
  }
}

Home = withRouter(Home);

export { Home };
