import React, { Component, createRef } from "react";
import { TweenMax } from "gsap";
import "./modal.css";

class Modal extends Component {
  constructor(props) {
    super(props);

    this.containerRef = createRef();

    this.state = {
      showModal: false,
    };
  }

  toggleModal = () => {
    const { showModal } = this.state;

    if (showModal) {
      TweenMax.to(this.containerRef, 1, {
        bottom: "-100vh",
        ease: "expo.inOut",
        opacity: 0,
      });

      this.setState({ showModal: false });
    } else {
      TweenMax.to(this.containerRef, 1, {
        bottom: "0vh",
        ease: "expo.inOut",
        opacity: 1,
      });
      this.setState({ showModal: true });
    }
  };

  componentDidMount() {
    // this.toggleModal();
  }

  render() {
    return (
      <div
        ref={(el) => (this.containerRef = el)}
        className="modal-outer-container"
      >
        <div className="modal-container">
          <p className="header">Next Steps</p>
          <p className="section-header">
            Please remember follow some basic guidelines.
          </p>
          <div className="guidelines">
            <p>
              • Make sure you are wearing a mask, for your own saftey and for
              others.
            </p>
            <p>• If you are feeling sick it is better to sit this one out.</p>
            <p>• Be respectful to all those around you.</p>
          </div>
          <p className="section-header">Here are some friendly reminders.</p>
          <div className="guidelines">
            <p>
              • There is a 70% chance of showers 🌧 on the day of the protest,
              bring an umbrella!
            </p>
            <p>
              • It looks like it will be pretty cold ❄️, try and dress warm!.
            </p>
          </div>
          <p>
            Please review your{" "}
            <a
              href="https://civilrights.findlaw.com/enforcing-your-civil-rights/protest-laws-by-state.html"
              target="_blank"
              rel="noreferrer"
            >
              state's protest laws
            </a>
            {` before you go. Knowing your rights is very benificial in these
            situations.`}
          </p>
          <div
            className="understand"
            onClick={() => {
              this.toggleModal();
            }}
          >
            <p className="thumb-icon">👍</p>
            <p>I Understand</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
