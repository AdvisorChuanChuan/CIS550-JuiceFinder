import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import MUI icons
import EvStationIcon from "@mui/icons-material/EvStation";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import FastfoodIcon from "@mui/icons-material/Fastfood";
// import plotting functions
import * as plt from "./Plotting";
import serverConfig from "../config.json";

function EVFriendlinessTab() {
  // use theme for this page
  const theme = useTheme();

  // state variable for fetched data
  const [stationToVehicle, setStationToVehicleData] = useState([]);
  const [restaurantToStation, setRestaurantToStationData] = useState([]);

  // transform the json data for plotting
  function transformVehicle(data) {
    // processing data for plotting
    const plotData = [];
    // explode data and add type
    const len = Object.keys(data).length;
    if (len !== 0) {
      for (let i = 0; i < len; i += 1) {
        plotData.push(
          {
            state: data[i].state,
            nunberOf: data[i].numStations,
            type: "Electric Charging Stations",
          },
          {
            state: data[i].state,
            nunberOf: data[i].numVehicles,
            type: "Electric Vehicles",
          },
          {
            state: data[i].state,
            nunberOf: data[i].numStations / data[i].numVehicles,
            type: "StationToVehicleRatio",
          }
        );
      }
    }
    return plotData;
  }
  function transformRestaurant(data) {
    // processing data for plotting
    const plotData = [];
    // explode data and add type
    const len = Object.keys(data).length;
    if (len !== 0) {
      for (let i = 0; i < len; i += 1) {
        plotData.push(
          {
            state: data[i].state,
            nunberOf: data[i].numStations,
            type: "Electric Charging Stations",
          },
          {
            state: data[i].state,
            nunberOf: data[i].numRestaurants,
            type: "Restaurants",
          },
          {
            state: data[i].state,
            nunberOf: data[i].numRestaurants / data[i].numStations,
            type: "RestaurantToStationRatio",
          }
        );
      }
    }
    return plotData;
  }
  // fetchers
  /*  #8
      Route: /stats/friendliness/stationToVehicle
      Description: Returns the electric station count, electric vehicle count, and the ratio of the station to vehicle aggregate by state, ordered by ratio(descending)
      Route Parameter(s): None
      Query Parameter(s): None
      Route Handler: stationToVehicle(req, res)
      Return Type: JSON Array
      Return Parameters:
          {results (JSON array of {state(string), numStations(int), numVehicles(int), stationToVehicleRatio(float)} )}
      Expected (Output) Behavior:
          - Example: results = [ {“CA”, 15, 30, 0.5},  {“CA”, 20, 60, 0.33}, {“PA”, 25, 100, 0.25},  {“NY”, 6,  60, 0.1},...]
  */
  const getStationToVehicle = () => {
    fetch(
      `http://${serverConfig.server_host}:${serverConfig.server_port}/stats/friendliness/stationToVehicle`
    )
      .then((response) => response.json())
      .then((json) => setStationToVehicleData(transformVehicle(json)))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("fetch data failed", error);
      });
  };
  /*  #9
    Route: /stats/friendliness/restaurantToStation
    Description: Returns the restaurant count, the electric station count, and the ratio of the restaurant to station aggregate by state, ordered by ratio(descending)
    Route Parameter(s): None
    Query Parameter(s): None
    Route Handler: restaurantToStation(req, res)
    Return Type: JSON Array
    Return Parameters:
        {results (JSON array of {state(string), numStations(int), numRestaurants(int), restaurantToStationRatio(float)} )}
    Expected (Output) Behavior:
        -  Example: results = [ {“CA”, 30, 165, 5.5 },  {“NY”, 70, 20, 3.5}, {“PA”, 25, 10, 2.5},  {“NY”, 25, 25, 1},...]
  */
  const getRestaurantToStation = () => {
    fetch(
      `http://${serverConfig.server_host}:${serverConfig.server_port}/stats/friendliness/restaurantToStation`
    )
      .then((response) => response.json())
      .then((json) => setRestaurantToStationData(transformRestaurant(json)))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("fetch data failed", error);
      });
  };
  // render
  useEffect(() => {
    getStationToVehicle();
    getRestaurantToStation();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                direction: "row",
                alignItems: "center",
                color: theme.palette.primary.main,
              }}
            >
              <EvStationIcon fontSize="large" />
              <ElectricCarIcon fontSize="large" />
              <Typography
                variant="h6"
                sx={{ color: theme.palette.primary.main }}
              >
                How hard to find a charging stations?
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Container>{plt.stationToVehicleBar(stationToVehicle)}</Container>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                direction: "row",
                alignItems: "center",
                color: theme.palette.primary.main,
              }}
            >
              <FastfoodIcon fontSize="large" />
              <EvStationIcon fontSize="large" />
              <Typography
                variant="h6"
                sx={{ color: theme.palette.primary.main }}
              >
                Charge yourself when you are charging your car!
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Container>
              {plt.restaurantToStationBar(restaurantToStation)}
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default EVFriendlinessTab;
