import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import firebase from "firebase";
import "./protest.css";

class Protest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: null,
      protest: null,
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
        const { lng, lat } = protest.starting_point;
        this.setState({
          viewport: {
            width: 400,
            height: 300,
            latitude: lat,
            longitude: lng,
            zoom: 12,
          },
          protest,
        });
      });
  }

  render() {
    const { protest } = this.state;

    if (protest) {
      const { name } = protest;
      const { lat, lng } = protest.starting_point;
      return (
        <div>
          <h1>{name}</h1>
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
      );
    } else {
      return <div>Loading</div>;
    }
  }
}

export { Protest };
