import React, { Component } from "react";
import firebase from "firebase";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import Loader from "react-loader-spinner";
import DateTimePicker from "react-datetime-picker";
import { withRouter } from "react-router";
import "./create-protest.css";

let states = [
  "AK",
  "AL",
  "AR",
  "AS",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "GU",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VI",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY",
];

class CreateProtest extends Component {
  constructor(props) {
    super(props);

    const rawDateTime = new Date();
    let rawDateArray = rawDateTime.toString().split(" ");
    let timeArray = rawDateTime.toString().split(" ")[4].split(":");

    let hour = parseInt(timeArray[0]);
    let minute = timeArray[1];
    let timeOfDay = "PM";

    if (hour < 12 && hour !== 0) {
      timeOfDay = "AM";
    } else if (hour === 0) {
      timeOfDay = "AM";
      hour = 12;
    } else if (hour > 12) {
      hour = hour - 12;
    }

    let start_time = `${hour}:${minute} ${timeOfDay}`;

    this.state = {
      uploading: false,
      address: "",
      rawDateTime: rawDateTime,
      rawStartTime: "",
      name: "",
      county_name: "",
      date: {
        month: rawDateArray[1],
        day: parseInt(rawDateArray[2]),
        dayOfWeek: rawDateArray[0],
        year: parseInt(rawDateArray[3]),
      },
      description: "",
      number_of_people: 1,
      host: "",
      starting_point: {},
      state: "",
      state_name: "",
      start_time: start_time,
    };
  }

  createProtest = async () => {
    const {
      county_name,
      date,
      description,
      host,
      name,
      number_of_people,
      starting_point,
      state,
      state_name,
      start_time,
    } = this.state;

    if (
      name === "" ||
      !starting_point.address ||
      description === "" ||
      host === ""
    ) {
      window.alert("Please complete all fields");
      return;
    }

    const id = Math.random().toString(36).substr(2, 12);

    let protest = {
      id,
      county_name,
      date,
      description,
      host,
      name,
      number_of_people,
      starting_point,
      state,
      state_name,
      start_time,
    };

    this.setState({ uploading: true });

    const db = firebase.firestore();
    const protestRef = db.collection("protests").doc(id);

    protestRef.set(protest).then(() => {
      this.props.history.push("");
    });
  };

  changeDateTime = (rawDateTime) => {
    let dateArrray = rawDateTime.toString().split(" ");
    let timeArray = rawDateTime.toString().split(" ")[4].split(":");

    let hour = parseInt(timeArray[0]);
    let minute = timeArray[1];
    let timeOfDay = "PM";

    if (hour < 12 && hour !== 0) {
      timeOfDay = "AM";
    } else if (hour === 0) {
      timeOfDay = "AM";
      hour = 12;
    } else if (hour > 12) {
      hour = hour - 12;
    }

    let start_time = `${hour}:${minute} ${timeOfDay}`;

    let date = {
      dayOfWeek: dateArrray[0],
      month: dateArrray[1],
      day: parseInt(dateArrray[2]),
      year: parseInt(dateArrray[3]),
    };

    this.setState({ rawDateTime, date, start_time });
  };

  handleChangeAddress = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
    geocodeByAddress(address).then(async (results) => {
      console.log(results);
      const coords = await getLatLng(results[0]);
      let formattedAddress = results[0].formatted_address;
      let county;
      let state;
      let stateName;

      results[0].address_components.some((address) => {
        let name = address.long_name;
        if (name.includes("County")) {
          county = name.split(" ");
          county.pop();
          county = county.join(" ").trim();
          return true;
        }
      });

      results[0].address_components.some((address) => {
        let stateAbbrev = address.short_name;
        if (states.indexOf(stateAbbrev) >= 0) {
          state = stateAbbrev;
          stateName = address.long_name;
          return true;
        }
      });

      let starting_point = {
        address: formattedAddress,
        lat: coords.lat,
        lng: coords.lng,
      };

      let state_name = stateName;
      let county_name = county;

      this.setState({ starting_point, state_name, county_name, state });
    });
  };

  render() {
    const { uploading } = this.state;

    return (
      <div className="create-protest-container">
        <div className="form-container">
          <h1 className="title">Rise Up</h1>
          <p className="subtitle">Join the Fight</p>

          <h3>Create a Protest</h3>
          <input
            className="input"
            placeholder="Name of Protest"
            value={this.state.name}
            onChange={(e) => {
              this.setState({ name: e.target.value });
            }}
          />
          <input
            className="input"
            placeholder="Host Name"
            value={this.state.host}
            onChange={(e) => {
              this.setState({ host: e.target.value });
            }}
          />
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChangeAddress}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Address",
                    className: "location-search-input",
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion, i) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";

                    const style = suggestion.active
                      ? { backgroundColor: "#fafafa", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <div
                        key={i}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <DateTimePicker
            className="date-input"
            calendarClassName=""
            onChange={this.changeDateTime}
            value={this.state.rawDateTime}
            clearIcon={null}
          />

          <textarea
            value={this.state.description}
            onChange={(e) => {
              this.setState({ description: e.target.value });
            }}
            className="input"
            placeholder="Description"
            cols="40"
            rows="7"
          ></textarea>

          {!uploading ? (
            <button
              className="submit-protest"
              onClick={() => {
                this.createProtest();
              }}
            >
              Create Protest
            </button>
          ) : (
            <div className="loader-container">
              <Loader
                type="Puff"
                color="#C1399B"
                height={100}
                width={100}
                timeout={3000} //3 secs
              />
            </div>
          )}
        </div>
        <div className="box-color" />
      </div>
    );
  }
}

CreateProtest = withRouter(CreateProtest);

export { CreateProtest };
