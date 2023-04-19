import React, { useState, useCallback, useEffect } from "react";
import { Card, Col, Row } from "antd";

import SelectComponent from "./SelectComponent";
import * as plt from "./Plotting";
import serverConfig from "../config.json";

function OverviewTab() {
  // State variable for station type select menu

  const [stationType, setStationType] = useState("All");
  const [vehicleType, setVehicleType] = useState("All");

  // Event handler

  const handleStationTypeChange = useCallback((event) => {
    setStationType(event);
  }, []);
  const handleVehicleTypeChange = useCallback((event) => {
    setVehicleType(event);
  }, []);

  // State variable for fetched data

  const [afsByTypeStateData, setAfsByTypeStateData] = useState([]);
  const [vehicleByTypeStateData, setVehicleByTypeStateData] = useState([]);

  // Fetcher for Statistics page

  /* #3 
    Route: /stats/overview/afsByTypeState
    Description: Returns the AFS station count aggregate by type and state, order by numStations(descending)
    Request Method: GET
    Route Parameter(s): None
    Query Parameter(s): stationType(String) (default: All)
    Route Handler: /overview/afsByTypeState(req, res)
    Return Type: JSON Array
    Return Parameters: 
        return {results (JSON array of { state(string), numStations(int), stype(String), …} ) }
        - stype=[“electric”, “e85”, “lpg”, “cng”, “bd”, “rd”, “hy”, “lng”]
    Expected (Output) Behavior:
        - Example: /stats/overview/afsByTypeState
            results = [ {“CA”, 50, ”electric”},  {“CA”, 30, ”lpg”}, {“NY”, 22, ”hy”},  {“WA”, 18, ”rd”},...]
        - Example: /stats/overview/afsByTypeState?stationType=electric
            results = [ {“CA”, 50, ”electric”},  {“PA”, 40, ”electric”}, {“NY”, 30, ”electric”},  {“WA”, 20, ”electric”},...]
*/
  const getAfsByTypeState = (stype) => {
    fetch(
      `http://${serverConfig.server_host}:${serverConfig.server_port}/stats/overview/afsByTypeState?stationType=${stype}`
    )
      .then((response) => response.json())
      .then((json) => setAfsByTypeStateData(json))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("fetch data failed", error);
      });
  };
  /*  #4
  Route: /stats/overview/vehicleByTypeState
  Description: Returns the light-duty vehicle registration count aggregate by given type and state, order by numVehicle(descending)
  Request Method: GET
  Route Parameter(s): None
  Query Parameter(s): vehicleType(String) (default: All)
  Route Handler: /overview/vehicleByTypeState(req, res)
  Return Type: JSON Array
  Return Parameters:  
      return {results (JSON array of { state(string), numVehicle(int), vtype(String), …} ) }
      - vtype=[“ev”, “phev”, “hev”, “biodiesel”, “e85”, “cng”, “propane”, “hydrogen”,”gasoline”,”diesel”]
  Expected (Output) Behavior: 
      - Example: /stats/overview/vehicleByTypeState
          results = [ {“CA”, 50, ”ev”},  {“CA”, 40, ”phev”}, {“NY”, 30, ”e85”},  {“WA”, 20, ”diesel”},...]
      - Example: /stats/overview/vehicleByTypeState?vehicleType=ev
          results = [ {“CA”, 50, ”ev”},  {“PA”, 40, ”ev”}, {“NY”, 30, ”ev”},  {“WA”, 20, ”ev”},...]
*/
  const getVehicleByTypeState = (vtype) => {
    fetch(
      `http://${serverConfig.server_host}:${serverConfig.server_port}/stats/overview/vehicleByTypeState?vehicleType=${vtype}`
    )
      .then((response) => response.json())
      .then((json) => setVehicleByTypeStateData(json))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("fetch data failed", error);
      });
  };

  // render
  useEffect(() => {
    getAfsByTypeState(stationType);
  }, [stationType]);

  useEffect(() => {
    getVehicleByTypeState(vehicleType);
  }, [vehicleType]);

  return (
    <>
      <Row gutter={16} type="flex">
        <Col span={6}>
          <Card title="🏅 US Alternating fueling resources">
            {" "}
            {plt.afsByTypePie()}
          </Card>
        </Col>
        <Col span={18}>
          <Card title="🏅 Energy Resources Heat map">
            {" "}
            {plt.afsByStateMap()}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} type="flex">
        <Col span={6}>
          <Card title="🏅 Title2">
            Paragraph 2
            <div>
              {SelectComponent(
                "stationType",
                "Select AFS station type:",
                "Select station type",
                handleStationTypeChange
              )}
            </div>
          </Card>
        </Col>
        <Col span={18}>
          <Card>Content 2{plt.afsByTypeStateBar(afsByTypeStateData)}</Card>
        </Col>
      </Row>
      <Row gutter={16} type="flex">
        <Col span={6}>
          <Card title="🏅 Title3">
            Paragraph 3
            <div>
              {SelectComponent(
                "vehicleType",
                "Select light-duty vehicle type:",
                "Select vehicle type",
                handleVehicleTypeChange
              )}
            </div>
          </Card>
        </Col>
        <Col span={18}>
          <Card>
            Content 3{plt.vehicleByTypeStateBar(vehicleByTypeStateData)}
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default OverviewTab;
