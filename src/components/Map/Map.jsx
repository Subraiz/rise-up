import React, { Component, createRef } from "react";
import { select, geoPath, geoAlbersUsa, easeCubicInOut } from "d3";
import { TweenMax } from "gsap";
import firebase from "firebase";
import Loader from "react-loader-spinner";
import CountyMapData from "../../map-data/counties.json";
import DummyProtestData from "../../map-data/protests.json";

import "./map.css";

class Map extends Component {
  constructor(props) {
    super(props);

    this.countyMapRef = createRef();

    this.height = 900;
    this.width = 500;
    this.scale = 1.25;
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
      zoomLevel: 6,
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
    const toolTip = select("#tool-tip");

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
        if (
          feature.properties.STATE !== "AK" &&
          feature.properties.STATE !== "HI"
        ) {
          return path(feature);
        }
      })
      .on("mouseover", (d, el) => {
        if (el.active) {
          const state = el.properties.STATE;
          const county = el.properties.NAME;

          toolTip.transition().style("visibility", "visible");

          toolTip.text(`${county}, ${state}`);
        }
      })
      .on("mouseout", (d, el) => {
        toolTip.transition().style("visibility", "hidden");
      })
      .on("click", (d, el) => {
        this.zoom(d, el, path);
        const countyName = el.properties.NAME;
        const state = el.properties.STATE;

        let protests = ProtestData.filter((item) => {
          return item.state === state && item.county_name === countyName;
        });

        if (el.active) {
          if (protests.length > 0) {
            this.props.setProtest(protests);
          } else {
            let dummyProtests = [];
            const randomIndex = Math.floor(
              Math.random() * Math.floor(DummyProtestData.length)
            );
            const dummyProtest = DummyProtestData[randomIndex];
            dummyProtest[`county_name`] = countyName;
            dummyProtest["state"] = state;
            dummyProtests.push(dummyProtest);
            this.props.setProtest(dummyProtests);
          }
        }
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

        const colors = [`#D8D8D8`, `#BAA1BB`, `#A871A9`, `#B156B2`, `#AD2BAF`];
        const randomColors = [
          ...colors,
          "#D8D8D8",
          "#D8D8D8",
          "#D8D8D8",
          "#D8D8D8",
        ];
        const randomIndex = Math.floor(
          Math.random() * Math.floor(randomColors.length)
        );
        const randomColor = randomColors[randomIndex];

        if (protests.length > 0) {
          countyDataItem["active"] = true;
          if (totalNumberOfPeople === 0) {
            return colors[0];
          } else if (totalNumberOfPeople > 0 && totalNumberOfPeople < 50) {
            return colors[1];
          } else if (totalNumberOfPeople > 50 && totalNumberOfPeople < 100) {
            return colors[2];
          } else if (totalNumberOfPeople > 100 && totalNumberOfPeople < 150) {
            return colors[3];
          } else if (totalNumberOfPeople > 150) {
            return colors[4];
          }
        } else {
          if (randomColor !== "#D8D8D8") {
            countyDataItem["active"] = true;
          }
          return randomColor;
          //return colors[0];
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
          <div id="tool-tip"></div>
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
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
