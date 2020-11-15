import React, { Component, createRef } from "react";
import { withRouter } from "react-router";
import { BsPeopleFill, BsCalendar } from "react-icons/bs";
import { GrMapLocation } from "react-icons/gr";
import { BiArrowBack } from "react-icons/bi";
import { SiFacebook, SiLinkedin } from "react-icons/si";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaReddit } from "react-icons/fa";
import ReactMapGL, { Marker } from "react-map-gl";
import Loader from "react-loader-spinner";
import firebase from "firebase";
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from "react-share";
import Modal from "./Modal";
import "./protest.css";

class Protest extends Component {
  constructor(props) {
    super(props);

    this.modalRef = createRef();

    this.state = {
      viewport: null,
      protest: null,
      error: false,
    };
  }

  async componentWillMount() {
    const id = window.location.href.split("/").pop();
    const db = firebase.firestore();
    await db
      .collection("protests")
      .doc(id)
      .get()
      .then((doc) => {
        const protest = doc.data();
        console.log(protest);

        if (protest) {
          const { lng, lat } = protest.starting_point;
          this.setState({
            viewport: {
              width: "100%",
              height: "100%",
              latitude: lat,
              longitude: lng,
              zoom: 13,
            },
            protest,
          });
        } else {
          this.setState({ error: true });
        }
      });
  }

  rsvp = async () => {
    const id = window.location.href.split("/").pop();

    const db = firebase.firestore();
    const protestRef = db.collection("protests").doc(id);
    await protestRef.get().then(async (doc) => {
      let protest = doc.data();
      protest.number_of_people = protest.number_of_people + 1;

      this.setState({ protest });

      await protestRef.set(protest).then(() => {
        this.modalRef.toggleModal();
      });
    });
  };

  render() {
    const { protest, error } = this.state;

    if (error) {
      return (
        <div className="error-container">
          <p>{`We are having some trouble fetching data for this protest 🙁`}</p>
          <p>{`Please try again later.`}</p>
        </div>
      );
    }

    if (protest) {
      const { name, host, start_time, description, number_of_people } = protest;
      const { address } = protest.starting_point;
      const { month, day, year, dayOfWeek } = protest.date;

      const { lat, lng } = protest.starting_point;
      return (
        <div className="protest-details-container">
          <BiArrowBack
            className="return-icon"
            onClick={() => {
              this.props.history.push("");
            }}
          />
          <div className="protest-details">
            <h1 className="p-name">{name}</h1>
            <p className="p-host">{`Hosted by ${host}`}</p>

            <div className="p-interested p-row">
              <BsPeopleFill className="row-icon" />
              <p>{`${number_of_people} People are Attending`}</p>
            </div>
            <div className="p-date p-row">
              <BsCalendar className="row-icon" />
              <p>{`${dayOfWeek} - ${month} ${day}, ${year} @ ${start_time}`}</p>
            </div>
            <div className="p-address p-row">
              <GrMapLocation className="row-icon" />
              <p>{`${address}`}</p>
            </div>

            <p className="p-description">{description}</p>

            <button
              className="p-button"
              onClick={() => {
                this.rsvp();
              }}
            >
              RSVP
            </button>

            <div className="p-divider">
              <div className="child-divider">
                <div />
                <p>SHARE</p>
                <div />
              </div>
            </div>

            <div className="p-social">
              <div className="child-social">
                <FacebookShareButton
                  url={`https://riseup.subraiz.com/protest/${protest.id}`}
                >
                  <SiFacebook className="social-icon" />
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://riseup.subraiz.com/protest/${protest.id}`}
                >
                  <AiFillTwitterCircle className="social-icon" />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={`https://riseup.subraiz.com/protest/${protest.id}`}
                >
                  <SiLinkedin className="social-icon" />
                </LinkedinShareButton>
                <RedditShareButton
                  url={`https://riseup.subraiz.com/protest/${protest.id}`}
                >
                  <FaReddit className="social-icon" />
                </RedditShareButton>
              </div>
            </div>
          </div>

          <div className="protest-map">
            <ReactMapGL
              {...this.state.viewport}
              onViewportChange={(viewport) => this.setState({ viewport })}
              mapStyle="mapbox://styles/subraiz/ckhilbz521cbx19qofn56saxq"
              mapboxApiAccessToken="pk.eyJ1Ijoic3VicmFpeiIsImEiOiJja2hpa2o1cm8wZG9zMnFwaGc0MjYwcm14In0.ONf67_wEvd2086CdptcrNA"
            >
              <Marker latitude={lat} longitude={lng}>
                <button className="marker-button">
                  <img src="/start.svg" alt="Starting Point" />
                </button>
              </Marker>
            </ReactMapGL>
          </div>
          <Modal ref={(el) => (this.modalRef = el)} />
        </div>
      );
    } else {
      return (
        <div className="p-loader-container">
          <Loader
            type="Puff"
            color="#C1399B"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      );
    }
  }
}

Protest = withRouter(Protest);

export { Protest };
