const { camelToSnakeCase, escapeForSql } = require("./commonService");
const {
  getCoordinates: getCoordinatesFromAddress,
} = require("./locationService");

const METER_PER_MILE = 1609.34;

/* Generate and returns an array of WHERE predicates applicable only to electric stations in MySQL */
let parseElectricFilters;

/* Generate the WHERE clause for filtering stations (general or electric stations) in MySQL 
  e.g. WHERE city='Philadelpha' AND state='PA'
*/
const getWhereClause = async (filters, isElectric = false) => {
  const whereArr = [];
  const unsupportedFilters = {};
  let latitude;
  let longitude;
  const meterDistance = (filters.mileDistance || 5) * METER_PER_MILE;

  // generate filter predicate based on street address or coordinates
  // if both street address and coordinates are provided, use the coordinates
  if (
    Object.prototype.hasOwnProperty.call(filters, "latitude") &&
    Object.prototype.hasOwnProperty.call(filters, "longitude")
  ) {
    latitude = filters.latitude;
    longitude = filters.longitude;
  } else if (filters.streetAddress) {
    ({ latitude, longitude } = await getCoordinatesFromAddress());
  }

  if (latitude && longitude) {
    whereArr.push(
      `ST_Distance_Sphere(location, ST_SRID(ST_GEOMFROMTEXT('POINT(${longitude} ${latitude})'), 4326)) <= ${meterDistance}`
    );
  }

  if (!filters.private) {
    whereArr.push("access_code='public'");
  }

  Object.keys(filters).forEach((key) => {
    const sqlColName = camelToSnakeCase(key); // default column names in MySQL if not specified
    const sqlColValue = escapeForSql(filters[key]);
    switch (key) {
      // filters that requires exact match
      case "state":
      case "city":
      case "zip":
      case "accessCode":
        whereArr.push(`${sqlColName}='${sqlColValue}'`);
        break;
      case "alwaysOpen":
        whereArr.push("access_days_time='24 hours daily'");
        break;
      // special filters that requires separate processing
      case "latitude":
      case "longitude":
      case "mileDistance":
      case "streetAddress":
      case "private":
        break;
      default:
        unsupportedFilters[key] = filters[key];
        break;
    }
  });

  let resultArr;
  if (isElectric) {
    resultArr = whereArr.concat(parseElectricFilters(unsupportedFilters));
  } else {
    resultArr = whereArr;
    Object.entries(unsupportedFilters).forEach(([key, value]) => {
      console.log(
        `Station filter recognized but not supported yet: {"${key}":"${value}"}`
      );
    });
  }

  return resultArr.length > 0 ? `WHERE ${resultArr.join(" AND ")}` : "";
};

parseElectricFilters = (filters) => {
  const { stationPorts, chargeLevel } = filters;
  const electricWhereArr = [];

  let portArr;
  if (stationPorts) {
    portArr = stationPorts.split(",");
    if (portArr.length > 0) {
      const stationPortSql = `('${portArr.join("', '")}')`;
      electricWhereArr.push(`
      sid in (
        select sid 
        from station_ports
        where port in ${stationPortSql}
      )
    `);
    }
  }

  if (chargeLevel) {
    const chargeLevelPredicateArr = [];
    chargeLevel.split(",").forEach((level) => {
      if (level === "dc_fast") {
        chargeLevelPredicateArr.push(`CLE.ev_dc_fast_num > 0`);
      } else if (level === "level1") {
        chargeLevelPredicateArr.push(`CLE.ev_level1_evse_num > 0`);
      } else if (level === "level2") {
        chargeLevelPredicateArr.push(`CLE.ev_level2_evse_num > 0`);
      } else {
        console.log(`Unrecognized charging level: ${level}`);
      }
    });
    // optimization: use view to filter level 1, level 2, dc_fast stations first
    const chargeLevelSql =
      chargeLevelPredicateArr.length > 0
        ? `(${chargeLevelPredicateArr.join(" OR ")})`
        : "";
    electricWhereArr.push(`
    exists (
      select * FROM electric_stations CLE 
      where CLE.sid=E.sid 
        AND ${chargeLevelSql}
    )
  `);
  }

  Object.keys(filters).forEach((key) => {
    switch (key) {
      case "stationPorts":
      case "chargeLevel":
        break;
      default:
        console.log(
          `Station filter recognized but not supported yet: {"${key}":"${filters[key]}"}`
        );
        break;
    }
  });

  return electricWhereArr;
};

module.exports = { getWhereClause };
