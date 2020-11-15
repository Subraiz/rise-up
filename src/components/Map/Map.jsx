import React, { Component, createRef } from "react";
import { select, geoPath, geoAlbersUsa, easeCubicInOut } from "d3";
import { TweenMax } from "gsap";
import firebase from "firebase";
import Loader from "react-loader-spinner";
import CountyMapData from "../../map-data/counties.json";
// import ProtestData from "../../map-data/protests.json";

import "./map.css";

class Map extends Component {
  constructor(props) {
    super(props);

    this.countyMapRef = createRef();

    this.height = 900;
    this.width = 500;
    this.scale = 1.75;
    this.centered = null;

    this.state = {
      ProtestData: [],
    };
  }

  async componentWillMount() {}

  zoom = (d, el, path) => {
    const zoomSettings = {
      duration: 1000,
      ease: easeCubicInOut,
      zoomLevel: 4,
    };

    let x;
    let y;
    let zoomLevel;

    const { duration, ease } = zoomSettings;

    if (el && this.centered !== el) {
      let centroid = path.centroid(el);
      x = centroid[0];
      y = centroid[1] + 40;
      zoomLevel = zoomSettings.zoomLevel;
      this.centered = el;
    } else {
      x = this.width / 2;
      y = this.height / 2;
      zoomLevel = 1;
      this.centered = null;
    }

    this.county
      .transition()
      .duration(duration)
      .ease(ease)
      .attr(
        "transform",
        "translate(" +
          this.width / 2 +
          "," +
          this.height / 2 +
          ")scale(" +
          zoomLevel +
          ")translate(" +
          -x +
          "," +
          -y +
          ")"
      );
  };

  async componentDidMount() {
    const db = firebase.firestore();
    await db
      .collection("protests")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        console.log(data);
        this.setState({ ProtestData: data });
      });

    const countyMap = select(this.countyMapRef);
    const { ProtestData } = this.state;

    TweenMax.from(".map-container", 1, {
      ease: "expo.inOut",
      opacity: 0,
    });

    countyMap.selectAll("g").remove();

    countyMap
      .append("rect")
      .attr("class", "background")
      .attr("width", this.width * this.scale + 40)
      .attr("height", this.height * this.scale)
      .on("click", this.zoom);

    this.county = countyMap.append("g");

    this.county.selectAll("path").remove();

    const projection = geoAlbersUsa().scale(1000);
    const path = geoPath().projection(projection);

    const countyNodes = this.county
      .append("g")
      .selectAll("path")
      .data(CountyMapData.features);

    countyNodes
      .enter()
      .append("path")
      .attr("d", (feature) => {
        return path(feature);
      })
      .on("click", (d, el) => {
        this.zoom(d, el, path);
        const countyName = el.properties.NAME;
        const state = el.properties.STATE;

        let protests = ProtestData.filter((item) => {
          return item.state === state && item.county_name === countyName;
        });

        this.props.setProtest(protests);
      })
      .attr("fill", (countyDataItem) => {
        const countyName = countyDataItem.properties.NAME;
        const state = countyDataItem.properties.STATE;

        let protests = ProtestData.filter((item) => {
          return item.state === state && item.county_name === countyName;
        });

        let totalNumberOfPeople = 0;
        protests.forEach((protest) => {
          totalNumberOfPeople += protest.number_of_people;
        });

        if (protests.length > 0) {
          if (totalNumberOfPeople === 0) {
            return "rgba(173,43,175, .2)";
          } else if (totalNumberOfPeople > 0 && totalNumberOfPeople < 50) {
            return "rgba(173,43,175, 1)";
          }
        } else {
          return "#e7e7e7";
        }
      })
      .attr("stroke", (countyDataItem) => {
        const countyName = countyDataItem.properties.NAME;
        const state = countyDataItem.properties.STATE;

        let protests = ProtestData.filter((item) => {
          return item.state === state && item.county_name === countyName;
        });

        const protest = protests[0];

        if (protest) {
          const numOfPeople = protest.number_of_people;
          if (numOfPeople === 0) {
            return "#e1e1e1";
          } else if (numOfPeople > 0) {
            return "#c1399b";
          }
        } else {
          return "#e1e1e1";
        }
      })
      .attr("cursor", "pointer")
      .attr("class", "county");
  }

  render() {
    const { ProtestData } = this.state;
    if (ProtestData.length !== 0) {
      return (
        <div className="map-container">
          <svg
            id="county-map"
            ref={(el) => (this.countyMapRef = el)}
            width="900"
            height="500"
          ></svg>
        </div>
      );
    } else {
      return (
        <div>
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

export { Map };
