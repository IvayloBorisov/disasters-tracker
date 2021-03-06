import { useState, useEffect, useRef } from "react";
import ReactMapGL, { FlyToInterpolator } from "react-map-gl";
import * as d3 from "d3-ease";
import {
  LocationMarker,
  PopupComponent,
  Header,
  NavControl,
  ErrorMessage,
  Button,
} from "../index";
import styles from "./Map.module.css";
import mapboxgl from "mapbox-gl";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const API_KEY = process.env.REACT_APP_GEOCAGE_API_KEY;

const MapComponent = ({ eventData }) => {
  const inputValue = useRef(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [inputAddress, setInputAddress] = useState(null);
  const [longitudeAddress, setLongitudeAddress] = useState(null);
  const [latitudeAddress, setLatitudeAddress] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "92vh",
    latitude: 39.7837304,
    longitude: -100.4458825,
    zoom: 4,
  });

  const markers = eventData.map((event) => {
    const { geometries, categories, title } = event;
    const longitude = geometries[0].coordinates[0];
    const latitude = geometries[0].coordinates[1];
    const disasterCategory = categories[0].title;
    const eventInfo = {
      longitude,
      latitude,
      disasterCategory,
      title,
    };
    return (
      <LocationMarker
        key={event.id}
        {...eventInfo}
        onClick={() => setLocationInfo({ ...eventInfo })}
      />
    );
  });

  const goToAddress = (latitude, longitude) => {
    setViewport({
      ...viewport,
      latitude,
      longitude,
      zoom: 6,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    });
  };

  useEffect(() => {
    if (inputAddress) {
      const getCoordinates = async () => {
        try {
          const fetchCoordinates = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${inputAddress}&key=${API_KEY}`
          );
          const { results } = await fetchCoordinates.json();
          setLatitudeAddress(results[0].geometry.lat);
          setLongitudeAddress(results[0].geometry.lng);

        } catch (error) {
          setHasError(true);
        }
      };
      getCoordinates();

      if (latitudeAddress && longitudeAddress) {
        goToAddress(latitudeAddress, longitudeAddress);
      }
    }
  }, [inputAddress, latitudeAddress, longitudeAddress]);

  const handleClick = (event) => {
    if (event.target.name === "error") {
      return setHasError(false);
    }
    if (event.target.name === "location" || event.key === "Enter") {
      const input = inputValue.current;
      setInputAddress(input.value);
      input.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Header className={ hasError ? "hidden" : null } />
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/ivoborisov/ckktptabb2du117qkyo4jg5tq"
        onViewportChange={(viewport) => setViewport(viewport)}
      >
        {markers}
        <NavControl />
        {hasError && <ErrorMessage onClick={handleClick} />}
        {locationInfo && (
          <PopupComponent
            {...locationInfo}
            onClick={() => setLocationInfo(null)}
          />
        )}
        {!hasError && (
          <div className={styles.container}>
            <form onSubmit={handleSubmit}>
              <div className={styles["form-fields-container"]}>
                <label className={styles["form-label"]}>Address:</label>
                <input
                  ref={inputValue}
                  className={styles["form-input"]}
                  name={"address"}
                  placeholder={"Berlin Germany"}
                  onKeyDown={handleClick}
                />
              </div>
            </form>
            <Button
              onClick={handleClick}
              name={"location"}
              content={"Get location"}
            />
          </div>
        )}
      </ReactMapGL>
    </div>
  );
};

export default MapComponent;
