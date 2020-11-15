import React, { Component, createRef } from "react";
import { withRouter } from "react-router";
import { IoMdCloseCircle } from "react-icons/io";
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

  closeModal = () => {
    TweenMax.to(this.container, 2, {
      opacity: 0,
      x: 250,
      ease: "expo.inOut",
    });
  };

  renderProtests = () => {
    let { protests } = this.props;
    protests.sort((a, b) => (a.number_of_people < b.number_of_people ? 1 : -1));

    return protests.map((protest, i) => {
      const { name, id, number_of_people, county_name, state } = protest;
      let interested = `${number_of_people} Interested`;

      if (i === 0) {
        interested = `${number_of_people} Interested 🔥`;
      }
      return (
        <div
          key={i}
          className="protest-container"
          onClick={() => {
            this.props.history.push(`protest/${id}`);
          }}
        >
          <p className="card-name">{`${name}`}</p>
          <p className="card-location">{`${county_name} County, ${state}`}</p>
          <p className="card-interested">{interested}</p>
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
        <IoMdCloseCircle
          className="card-close-icon"
          onClick={() => {
            this.closeModal();
          }}
        />
        <h3 className="card-header">Protests</h3>
        {this.renderProtests()}
      </div>
    );
  }
}

Protests = withRouter(Protests);

export { Protests };
