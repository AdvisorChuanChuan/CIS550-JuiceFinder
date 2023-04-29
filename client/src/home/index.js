import React, { useEffect, useState } from "react";
import { Box, Backdrop, CircularProgress } from "@mui/material";
import Map from "./Map";
import InputTabs from "./InputTabs";
import {
  getNearbyStations,
  getCoordinatesFromAddress,
  getStationsNearPath,
  fetchVehicleInfo,
} from "../common/APIUtils";
import { useHasMapGL } from "../common/HasMapGLContext";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
  const { setHasMapGL } = useHasMapGL();

  useEffect(() => {
    setHasMapGL(true);
    return () => {
      setHasMapGL(false);
    };
  }, [setHasMapGL]);

  const DEFAULT_LOCATION = {
    latitude: 39.9524657202615,
    longitude: -75.19028570489878,
  };
  const [curLocation, setCurLocation] = useState(DEFAULT_LOCATION);
  const [srcLocation, setSrcLocation] = useState({});
  const [destLocation, setDestLocation] = useState({});

  // Props for StationInput
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [stationDistance, setStationDistance] = useState(1);
  const [chargingLevels, setChargingLevels] = useState([]);
  const [preferredStationPorts, setPreferredStationPorts] = useState([]);
  const [adapters, setAdapters] = useState([]);
  const [stationFormError, setStationFormError] = useState(false);
  const [stationFormErrorText, setStationFormErrorText] = useState("");

  // Props for PathInput
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [pathDistance, setPathDistance] = useState(0.1);
  const [pathFormError, setPathFormError] = useState(false);
  const [pathFormErrorText, setPathFormErrorText] = useState("");

  // Props for Map
  const [stations, setStations] = useState([]);
  const [path, setPath] = useState([]);

  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const [vehiclePorts, setVehiclePorts] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchVehicleInfo(currentUser).then((response) => {
        if (response && response.port) {
          setVehiclePorts(response.port);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (curLocation && curLocation.latitude && curLocation.longitude) {
      getNearbyStations(
        curLocation,
        stationDistance,
        chargingLevels,
        preferredStationPorts,
        { isElectric: true }
      ).then((response) => {
        setStations(response);
        if (!response || response.length === 0) {
          setStationFormError(true);
          setStationFormErrorText(
            "No stations found within the specified distance and location. Please try again with a different distance or location."
          );
        }
      });
    }
  }, [curLocation]);

  const handleStationInputSubmit = async () => {
    setLoading(true);
    setPath([]);
    setSrcLocation({});
    setDestLocation({});

    getCoordinatesFromAddress(`${streetAddress} ${state} ${city} ${zip}`).then(
      (response) => {
        if (response && response.latitude && response.longitude) {
          setCurLocation(response);
          setStations([]);
        } else {
          setStationFormError(true);
          setStationFormErrorText(
            "Input location not recognized. Please try again with another address, preferably with city and state, or zip code. Alternatively, check server status."
          );
        }
        setLoading(false);
      }
    );
  };

  const handlePathInputSubmit = async () => {
    setLoading(true);
    setCurLocation({});
    setPath([]);
    setStations([]);

    Promise.all([
      getCoordinatesFromAddress(startAddress),
      getCoordinatesFromAddress(endAddress),
    ]).then(([srcCoor, destCoor]) => {
      if (
        srcCoor &&
        srcCoor.latitude &&
        srcCoor.longitude &&
        destCoor &&
        destCoor.latitude &&
        destCoor.longitude
      ) {
        setSrcLocation(srcCoor);
        setDestLocation(destCoor);
      } else {
        setPathFormError(true);
        setPathFormErrorText(
          "Invalid address(es). Please try again with more specific address(es), preferably with city and state or zip code. Alternatively, check server status."
        );
      }
    });

    getStationsNearPath(
      startAddress,
      endAddress,
      pathDistance,
      chargingLevels,
      preferredStationPorts
    ).then((response) => {
      if (!response || response.length === 0) {
        setPathFormError(true);
        setPathFormErrorText(
          "No stations found given the specified distance and locations. Please try again with different distance or locations."
        );
      } else {
        setPath(response.waypoints);
        const stationData = response.stations.map((station) => {
          return {
            sid: station.sid,
            location: {
              y: station.latitude,
              x: station.longitude,
            },
          };
        });
        setStations(stationData);
      }
      setLoading(false);
    });
  };

  return (
    <div style={{ width: "100vw", height: "100%" }}>
      <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr",
          height: "100%",
        }}
      >
        <div>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              height: "100%",
              overflowY: "visible",
            }}
          >
            <InputTabs
              state={state}
              setState={setState}
              city={city}
              setCity={setCity}
              zip={zip}
              setZip={setZip}
              streetAddress={streetAddress}
              setStreetAddress={setStreetAddress}
              stationDistance={stationDistance}
              setStationDistance={setStationDistance}
              chargingLevels={chargingLevels}
              setChargingLevels={setChargingLevels}
              preferredStationPorts={preferredStationPorts}
              setPreferredStationPorts={setPreferredStationPorts}
              adapters={adapters}
              setAdapters={setAdapters}
              stationFormError={stationFormError}
              setStationFormError={setStationFormError}
              stationFormErrorText={stationFormErrorText}
              setStationFormErrorText={setStationFormErrorText}
              handleStationInputSubmit={handleStationInputSubmit}
              startAddress={startAddress}
              setStartAddress={setStartAddress}
              endAddress={endAddress}
              setEndAddress={setEndAddress}
              pathDistance={pathDistance}
              setPathDistance={setPathDistance}
              pathFormError={pathFormError}
              setPathFormError={setPathFormError}
              pathFormErrorText={pathFormErrorText}
              setPathFormErrorText={setPathFormErrorText}
              handlePathInputSubmit={handlePathInputSubmit}
            />
          </Box>
        </div>
        <Box>
          <Map
            curLocation={curLocation}
            setCurLocation={setCurLocation}
            srcLocation={srcLocation}
            setSrcLocation={setSrcLocation}
            destLocation={destLocation}
            setDestLocation={setDestLocation}
            stations={stations}
            setStations={setStations}
            radius={stationDistance}
            path={path}
            setPath={setPath}
          />
        </Box>
      </Box>
    </div>
  );
}
