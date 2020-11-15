import React, { Component, createRef } from "react";
import { TweenMax } from "gsap";
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

  componentDidMount() {
    TweenMax.from(".legend", 2, { y: 40, opacity: 0, ease: "expo.inOut" });
  }

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
          <a
            href="https://blacklivesmatter.com/"
            target="_blank"
            rel="noreferrer"
            className="cause"
          >
            Black Lives Matter
          </a>
          <a
            href="https://www.amnesty.org/en/donate/"
            target="_blank"
            rel="noreferrer"
            className="cause"
          >
            Human Rights
          </a>
          <a
            href="https://care.org/our-work/disaster-response/emergencies/sudan-humanitarian-crisis/"
            target="_blank"
            rel="noreferrer"
            className="cause"
          >
            Human Rights: Sudan
          </a>
          <a
            href="https://wegotthevote.org/freethevote/"
            target="_blank"
            rel="noreferrer"
            className="cause"
          >
            Free The Vote
          </a>
          <a
            href="https://mothersagainstpolicebrutality.org/donate/"
            target="_blank"
            rel="noreferrer"
            className="cause"
          >
            Police Brutality
          </a>
          <a
            href="https://www.joincampaignzero.org/#vision"
            target="_blank"
            rel="noreferrer"
            className="cause"
          >
            Police Reform
          </a>
          <a
            href="https://fairfight.com/"
            target="_blank"
            rel="noreferrer"
            className="cause"
          >
            Voting Rights
          </a>
          <a
            href="https://www.aclu.org/know-your-rights/protesters-rights/"
            target="_blank"
            rel="noreferrer"
            className="create-protest-btn rights"
          >
            Know Your Rights
          </a>

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
          <div className="legend">
            <p className="legend-title">Protest Activity</p>
            <div className="legend-data">
              <div className="data">
                <div className="color-box first-box"></div>
                <p className="color-number">0</p>
              </div>
              <div className="data">
                <div className="color-box second-box"></div>
                <p className="color-number">1-50</p>
              </div>
              <div className="data">
                <div className="color-box third-box"></div>
                <p className="color-number">51-100</p>
              </div>
              <div className="data">
                <div className="color-box fourth-box"></div>
                <p className="color-number">101-150</p>
              </div>
              <div className="data">
                <div className="color-box fifth-box"></div>
                <p className="color-number">150+</p>
              </div>
            </div>
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
