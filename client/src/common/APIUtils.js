import axios from "axios";

const config = require("../config.json");

// eslint-disable-next-line import/prefer-default-export
export const getNearbyStations = async (
  location,
  maxDistance,
  chargeLevels,
  stationPorts,
  isElectric = false
) => {
  if (!location || !location.latitude || !location.longitude) {
    return [];
  }

  try {
    const response = await axios.get(
      `http://${config.server_host}:${config.server_port}/stations/` +
        `${isElectric ? "electric/" : ""}` +
        `?latitude=${location.latitude}&longitude=${location.longitude}` +
        `&mileDistance=${maxDistance}&pageSize=${150}&orderBy=sid` +
        `${chargeLevels ? `&chargeLevels=${chargeLevels}` : ""}` +
        `${stationPorts ? `&stationPorts=${stationPorts}` : ""}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await axios.get(
      `http://${config.server_host}:${config.server_port}/paths/geocode/${address}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const getPath = async (start, end) => {
  try {
    const response = await axios.get(
      `http://${config.server_host}:${config.server_port}/paths/plan` +
        `/${start.longitude}/${start.latitude}/${end.longitude}/${end.latitude}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// This retrieves the path as well as the stations near the path
export const getStationsNearPath = async (
  start,
  end,
  maxDistance,
  chargeLevels,
  stationPorts
) => {
  try {
    const response = await axios.get(
      encodeURI(
        `http://${config.server_host}:${config.server_port}/paths/stationsNearPath` +
          `/${start}/${end}` +
          `?maxDistMile=${maxDistance}` +
          `${chargeLevels ? `&chargeLevels=${chargeLevels}` : ""}` +
          `${stationPorts ? `&stationPorts=${stationPorts}` : ""}`
      )
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchVehicleInfo = async (currentUser) => {
  try {
    const token = await currentUser.getIdToken(/* forceRefresh */ true);

    const response = await fetch(
      `http://${config.server_host}:${config.server_port}/users/info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    console.error("Vehicle info is empty");
    return {};
  } catch (error) {
    console.error("Error fetching vehicle info:", error);
    return {};
  }
};
