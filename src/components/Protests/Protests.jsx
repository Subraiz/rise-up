import React, { Component, createRef } from "react";
import { withRouter } from "react-router";
import { TweenMax } from "gsap";
import "./protests.css";

class Protests extends Component {
  constructor(props) {
    super(props);

    this.container = createRef();
  }

  componentDidMount() {
    TweenMax.from(this.container, 2, {
      ease: "expo.inOut",
      opacity: 0,
      x: 250,
    });
  }

  componentDidUpdate() {
    let { protests } = this.props;

    if (protests.length === 0) {
      TweenMax.to(this.container, 2, {
        opacity: 0,
        x: 250,
        ease: "expo.inOut",
      });
    } else {
      TweenMax.to(this.container, 2, {
        opacity: 1,
        x: 0,
        ease: "expo.inOut",
      });
    }
  }

  renderProtests = () => {
    let { protests } = this.props;
    protests.sort((a, b) => (a.number_of_people > b.number_of_people ? 1 : -1));

    return protests.map((protest, i) => {
      const { name, id } = protest;
      return (
        <div
          key={i}
          className="protest-container"
          onClick={() => {
            this.props.history.push(`protest/${id}`);
          }}
        >
          <p>{name}</p>
        </div>
      );
    });
  };

  render() {
    return (
      <div
        className="protests-card-container"
        ref={(el) => (this.container = el)}
      >
        {this.renderProtests()}
      </div>
    );
  }
}

Protests = withRouter(Protests);

export { Protests };
