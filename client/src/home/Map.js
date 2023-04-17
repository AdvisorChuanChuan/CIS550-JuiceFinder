import MapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { getNearbyStations } from "../common/APIUtils";

// eslint-disable-next-line no-unused-vars
import pin from "../assets/pin.svg";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Map({ curLocation, maxDistance }) {
  // eslint-disable-next-line no-unused-vars
  const [viewport, setViewport] = useState({
    zoom: 11,
    ...curLocation,
  });
  const [stations, setStations] = useState([]);
  // eslint-disable-next-line no-unused-vars
  // const [zoom, setZoom] = useState(14);
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // eslint-disable-next-line no-unused-vars
  const handleGeocoderViewportChange = useCallback((newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);

  useEffect(() => {
    getNearbyStations(curLocation, maxDistance).then((response) => {
      // console.log(response);
      setStations(response);
    });
  }, [curLocation, maxDistance]);

  return (
    <MapGL
      ref={mapRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      width="100%"
      height="100%"
      // zoom={zoom}
      // latitude={viewport.latitude}
      // longitude={viewport.longitude}
      onViewStateChange={handleViewportChange}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      {curLocation && (
        <Marker
          latitude={curLocation.latitude}
          longitude={curLocation.longitude}
          draggable
        >
          <img
            src={pin}
            alt="pin"
            style={{ transform: "translate(-50%, -85%)" }}
          />
        </Marker>
      )}
      {stations?.map((station) => (
        <Marker
          latitude={station.location.y}
          longitude={station.location.x}
          key={station.sid}
        >
          <img
            src={pin}
            alt="pin"
            style={{ transform: "translate(-50%, -85%)" }}
          />
        </Marker>
      ))}
      <Geocoder
        mapRef={mapRef}
        onViewportChange={handleGeocoderViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        position="top-left"
        countries="us"
      />
    </MapGL>
  );
}

Map.propTypes = {
  curLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  maxDistance: PropTypes.number.isRequired,
};

Map.defaultProps = { curLocation: {} };
