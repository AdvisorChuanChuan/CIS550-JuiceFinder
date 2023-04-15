const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const escapeForSql = (str) => str.replace(/'/g, `''`);

const getWhereClause = (filters) => {
  const whereArr = [];
  Object.keys(filters).forEach((key) => {
    const sqlColName = camelToSnakeCase(key); // default column names in MySQL if not specified
    const sqlValue = escapeForSql(filters[key]);
    switch (key) {
      case "state":
      case "city":
      case "zip":
      case "streetAddress":
      case "accessCode":
        whereArr.push(`${sqlColName}='${sqlValue}'`);
        break;
      case "alwaysOpen":
        whereArr.push("access_days_time='24 hours daily'");
        break;
      case "latitude":
      case "longitude":
      case "meterDistance":
        break;
      default: // requires exact match
        console.log(`unsupported filter: ${key}: ${filters[key]}`);
        break;
    }
  });

  console.log(Object.prototype.hasOwnProperty.call(filters, "longitude"));
  if (
    Object.prototype.hasOwnProperty.call(filters, "latitude") &&
    Object.prototype.hasOwnProperty.call(filters, "longitude")
  ) {
    const { latitude, longitude } = filters;
    const meterDistance = filters.meterDistance || 1609;
    whereArr.push(
      `ST_Distance_Sphere(location, ST_SRID(ST_GEOMFROMTEXT('POINT(${longitude} ${latitude})'), 4326)) < ${meterDistance}`
    );
  }

  return whereArr.length > 0 ? `WHERE ${whereArr.join(" AND ")}` : "";
};

module.exports = { getWhereClause };
