const express = require("express");

const router = express.Router();
const bodyParser = require("body-parser");
const simplify = require("simplify-js");
const connection = require("../db");
const { getWhereClause } = require("../services/stationService");
const {
  getCoordinatesFromAddress,
  getPlannedPathFromCoordinates,
} = require("../services/locationService");

router.use(bodyParser.json());

function toMercator([longitude, latitude]) {
  const R = 6378137; // Earth's radius in meters
  const x = R * ((longitude * Math.PI) / 180);
  const y = R * Math.log(Math.tan(((90 + latitude) * Math.PI) / 360));
  return { x, y };
}

function fromMercator({ x, y }) {
  const R = 6378137; // Earth's radius in meters
  const longitude = x / ((R * Math.PI) / 180);
  const latitude = (360 / Math.PI) * Math.atan(Math.exp(y / R)) - 90;
  return [longitude, latitude];
}

// Route 1: GET /paths/geocode/:fullAddress
router.get("/geocode/:fullAddress", async (req, res) => {
  const fullAddress = req.params.fullAddress;
  try {
    const coordinate = await getCoordinatesFromAddress(fullAddress);
    res.status(200).json(coordinate);
  } catch (err) {
    console.log(err);
    res.status(500).json({});
  }
});

// Route 2: GET /paths/plan/:startLng/:startLat/:destLng/:destLat
router.get("/plan/:startLng/:startLat/:destLng/:destLat", async (req, res) => {
  const { startLng, startLat, destLng, destLat } = req.params;
  try {
    const coordinates = await getPlannedPathFromCoordinates(
      startLng,
      startLat,
      destLng,
      destLat
    );
    res.status(200).json(coordinates);
  } catch (err) {
    console.log(err);
    res.status(500).json({});
  }
});

// Route 3: POST /paths/nearbyStations
router.post("/nearbyStations", async (req, res) => {
  const maxDistMile = req.query.maxDistMile ?? 10;
  const coordinates = req.body.coordinates;
  const stationLocationColName = "location";

  // Get the regular attributes' constraints
  const validFilters = [
    "state",
    "city",
    "zip",
    "streetAddress",
    "accessCode",
    "alwaysOpen",
    // Ignore location-related constraints for now
    // "latitude",
    // "longitude",
    // "meterDistance",
  ];
  const receivedFilters = {};
  validFilters.forEach((validKeyName) => {
    const value = req.query[validKeyName];
    if (value || value === "") {
      receivedFilters[validKeyName] = value;
    }
  });

  const whereClause = getWhereClause(receivedFilters);
  // whereClause = "WHERE state = 'CA' AND city = 'San Francisco'"
  //               or an empty string if no constraints are given

  // Handle the distance constraint along the path
  const distConstraints = [];
  coordinates.forEach((coordinate) => {
    distConstraints.push(
      `ST_Distance_Sphere(${stationLocationColName}, ST_SRID(ST_GEOMFROMTEXT('POINT(${
        coordinate[0]
      } ${coordinate[1]})'), 4326)) < ${maxDistMile * 1609.34}`
    );
  });
  const distConstraintString = distConstraints.join(" OR ");

  // Combine the queries
  const query = `
    SELECT DISTINCT sid, ST_Y(${stationLocationColName}) AS longitude, ST_X(${stationLocationColName}) AS latitude
    FROM stations
    ${
      whereClause === "" ? "WHERE" : `${whereClause} AND`
    } (${distConstraintString})
  `;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.status(500).json({});
    } else {
      res.status(200).json(data);
    }
  });
});

// Route 4: GET /paths/stationsNearPath/:startAddress/:destAddress
// Query parameters: maxDistMile, [attributes specified in getWhereClause]
// Return {waypoints: <a waypoint list>, stations: <a list of {sid, longitude, latitude}>}
router.get("/stationsNearPath/:startAddress/:destAddress", async (req, res) => {
  const startTime = performance.now();
  // Get the coordinates of the start and destination addresses
  const { startAddress, destAddress } = req.params;
  const startPromise = getCoordinatesFromAddress(startAddress);
  const destPromise = getCoordinatesFromAddress(destAddress);
  let startCoordinate;
  let destCoordinate;
  try {
    [startCoordinate, destCoordinate] = await Promise.all([
      startPromise,
      destPromise,
    ]);
  } catch (err) {
    console.log(err);
    res.status(500).json({});
  }

  // Get the coordinates of the waypoints along the path
  let waypoints;
  try {
    waypoints = await getPlannedPathFromCoordinates(
      startCoordinate.longitude,
      startCoordinate.latitude,
      destCoordinate.longitude,
      destCoordinate.latitude
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({});
  }

  // Do distance- and attribute-based filtering on the stations
  const maxDistMile = req.query.maxDistMile ?? 10;

  const whereClause = await getWhereClause(req.query, true);
  // whereClause contains charging attributes

  const cartesianWaypoints = waypoints.map(toMercator);
  const simplifiedCartesianWaypoints = simplify(
    cartesianWaypoints,
    waypoints.length,
    false
  );
  const simplifiedWaypoints = simplifiedCartesianWaypoints.map(fromMercator); // [[lng,lat]...]
  console.log(
    `Waypoints: ${waypoints.length} -> ${simplifiedWaypoints.length} points\n`
  );
  const linestringArr = simplifiedWaypoints
    .map((waypoint) => waypoint.join(" "))
    .join(", ");

  // Combine the queries
  const query = `
    SELECT DISTINCT sid, ST_Y(location) AS longitude, ST_X(location) AS latitude
    FROM stations S NATURAL JOIN electric_stations E NATURAL JOIN station_ports SP
    WHERE ST_DISTANCE(
      location,
      ST_SRID(ST_GEOMFROMTEXT('LINESTRING(${linestringArr})'), 4326)
    ) < ${maxDistMile * 1609.34}
    AND ${whereClause === "" ? "TRUE" : whereClause.substring(6)}
  `;
  const queryStartTime = performance.now();
  connection.query(query, (err, data) => {
    const queryEndTime = performance.now();
    console.log(
      `[stationsNearPath] Query time: ${queryEndTime - queryStartTime}ms\n` +
        `Total time: ${queryEndTime - startTime}ms\n`
    );
    if (err || data.length === 0) {
      console.log(err);
      res.status(500).json({});
    } else {
      res.status(200).json({ waypoints, stations: data });
    }
  });
});

module.exports = router;
