import MapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { useState, useRef, useCallback } from "react";

// eslint-disable-next-line no-unused-vars
import pin from "../assets/pin.svg";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Map() {
  // eslint-disable-next-line no-unused-vars
  const [curLocation, setCurLocation] = useState({
    latitude: 39.9524657202615,
    longitude: -75.19028570489878,
  });
  // eslint-disable-next-line no-unused-vars
  const [viewport, setViewport] = useState({
    zoom: 14,
    ...curLocation,
  });
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

  return (
    <MapGL
      ref={mapRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      width="80%"
      height="100%"
      // zoom={zoom}
      // latitude={viewport.latitude}
      // longitude={viewport.longitude}
      onViewStateChange={handleViewportChange}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <Marker
        latitude={curLocation.latitude}
        longitude={curLocation.longitude}
        anchor="center"
      >
        <img
          src={pin}
          alt="pin"
          style={{ transform: "translate(-50%, -85%)" }}
        />
      </Marker>

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
