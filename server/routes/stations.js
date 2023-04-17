const express = require("express");

const router = express.Router();
const connection = require("../db");
const { getWhereClause } = require("../services/stationService");

// Route: GET /stations
router.get("/", async (req, res) => {
  console.log(`/stations, filters=${JSON.stringify(req.query)}`);
  const { orderBy } = req.query;
  const page = Math.max(0, req.query.page);
  const pageSize = Math.max(0, req.query.pageSize) || 50;
  const validFilters = [
    "state",
    "city",
    "zip",
    "streetAddress",
    "accessCode",
    "private",
    "alwaysOpen",
    "latitude",
    "longitude",
    "mileDistance",
  ];
  const receivedFilters = {};
  for (let i = 0; i < validFilters.length; i += 1) {
    const key = validFilters[i];
    const value = req.query[key];
    if (value || value === "") {
      receivedFilters[key] = value;
    }
  }

  const whereClause = await getWhereClause(receivedFilters, false);
  let orderByObject = "sid";
  const additionalSelectAttrs = [];
  if (whereClause.includes("ST_Distance_Sphere")) {
    const result = whereClause.match(
      /ST_Distance_Sphere.*?(?=\s*<=?\s*[\d\\.]+)/
    );
    if (result) {
      additionalSelectAttrs.push(`${result[0]} AS meter_distance`);
    }
    if (!orderBy || orderBy === "distance") {
      orderByObject = "meter_distance ASC";
    }
  }

  const query = `
    SELECT * 
        ${
          additionalSelectAttrs.length > 0
            ? ", ".concat(additionalSelectAttrs.join(", "))
            : ""
        }
    FROM stations
    ${whereClause}
    ORDER BY ${orderByObject}
    LIMIT ${pageSize}
    ${page ? `OFFSET ${(page - 1) * pageSize}` : ""}
  `;

  console.log(query);

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({});
    } else if (data.length === 0) {
      res.status(404).json({});
    } else {
      res.status(200).json(data);
    }
  });
});

// Route: GET /stations/electric
router.get("/electric", async (req, res) => {
  console.log(`/stations/electric, filters=${JSON.stringify(req.query)}`);
  const { orderBy } = req.query;
  const page = Math.max(0, req.query.page);
  const pageSize = Math.max(0, req.query.pageSize) || 50;
  const validFilters = [
    "state",
    "city",
    "zip",
    "streetAddress",
    "accessCode",
    "private",
    "alwaysOpen",
    "latitude",
    "longitude",
    "mileDistance",
    "stationPorts",
    // "vehiclePorts", // move the adaptor logic to the client
    // "adapters",
    "chargeLevel",
  ];
  const receivedFilters = {};
  for (let i = 0; i < validFilters.length; i += 1) {
    const key = validFilters[i];
    const value = req.query[key];
    if (value || value === "") {
      receivedFilters[key] = value;
    }
  }

  const whereClause = await getWhereClause(receivedFilters, true);
  let orderByObject = "sid";
  const additionalSelectAttrs = [];
  if (whereClause.includes("ST_Distance_Sphere")) {
    const result = whereClause.match(
      /ST_Distance_Sphere.*?(?=\s*<=?\s*[\d\\.]+)/
    );
    if (result) {
      additionalSelectAttrs.push(`${result[0]} AS meter_distance`);
    }
    if (!orderBy || orderBy === "distance") {
      orderByObject = "meter_distance ASC";
    }
  }
  if (orderBy === "num_ports") {
    orderByObject = "num_ports DESC";
    additionalSelectAttrs.push(
      "E.ev_level1_evse_num + E.ev_level2_evse_num + E.ev_dc_fast_num AS num_ports"
    );
  }

  const query = `
    SELECT *, GROUP_CONCAT(port) AS port 
        ${
          additionalSelectAttrs.length > 0
            ? ", ".concat(additionalSelectAttrs.join(", "))
            : ""
        }
    FROM stations S NATURAL JOIN electric_stations E NATURAL JOIN station_ports SP
    ${whereClause}
    GROUP BY sid
    ORDER BY ${orderByObject}
    LIMIT ${pageSize}
    ${page ? `OFFSET ${(page - 1) * pageSize}` : ""}
  `;

  console.log(query);

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({});
    } else if (data.length === 0) {
      res.status(404).json({});
    } else {
      res.status(200).json(data);
    }
  });
});

// Route: GET /stations/:id
router.get("/:id", (req, res) => {
  const query = `
        SELECT *
        FROM stations
        WHERE sid='${req.params.id}'
    `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({});
    } else if (data.length === 0) {
      res.status(404).json({});
    } else {
      res.status(200).json(data[0]);
    }
  });
});

// Route: GET /stations/electric/:id
router.get("/electric/:id", (req, res) => {
  const query = `
        SELECT *, GROUP_CONCAT(port) AS port
        FROM stations NATURAL JOIN electric_stations NATURAL JOIN station_ports
        WHERE sid='${req.params.id}'
        GROUP BY sid
    `;

  console.log(query);

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({});
    } else if (data.length === 0) {
      res.status(404).json({});
    } else {
      res.status(200).json(data[0]);
    }
  });
});

module.exports = router;
