import React, { useState, useEffect } from "react";
import csvtojson from "csvtojson";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
} from "@mui/material";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import { styled } from "@mui/system";
import { useAuth } from "../auth/AuthContext";
import config from "../config.json";

const StyledContainer = styled(Container)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

function Settings() {
  const theme = useTheme();

  const { currentUser } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const [vehicleId, setVehicleId] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState(null);

  // Popup
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMsgPopup, setErrorMsgPopup] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [releaseYear, setReleaseYear] = useState(9999);
  const [variant, setVariant] = useState("");
  const [availableVariants, setAvailableVariants] = useState([]);

  const [dataArray, setDataArray] = useState([]);

  // Fetch EV data (~200 rows stored as csv)
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("data/electric_vehicles.csv");
        const csvData = await response.text();
        const jsonData = await csvtojson().fromString(csvData);
        setDataArray(jsonData);

        // Set default values after fetching the data
        if (jsonData.length > 0) {
          setBrand(jsonData[0].brand);
          setModel(jsonData[0].model);
          setReleaseYear(jsonData[0].release_year);
          setVariant(jsonData[0].variant);
        }
      } catch (error) {
        console.error("Error loading CSV data:", error);
      }
    }
    fetchData();
  }, []);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    if (brand) {
      setModel("");
      setReleaseYear(9999);
      setVariant("");
      const availableModels = Array.from(
        new Set(
          dataArray
            .filter((item) => item.brand === brand)
            .map((item) => item.model)
        )
      );
      setModel(availableModels[0]);
    }
  }, [brand, dataArray]);

  useEffect(() => {
    if (model) {
      setReleaseYear(9999);
      setVariant("");
      const firstReleaseYear = dataArray
        .filter((item) => item.brand === brand && item.model === model)
        .map((item) => item.release_year)[0];

      setReleaseYear(firstReleaseYear);
    }
  }, [model, dataArray]);

  useEffect(() => {
    const newAvailableVariants = Array.from(
      new Set(
        dataArray
          .filter((item) => item.brand === brand && item.model === model)
          .map((item) => item.variant)
      )
    );

    setAvailableVariants(newAvailableVariants);
    setVariant(newAvailableVariants[0]);
  }, [releaseYear, dataArray]);

  // Filter vid
  const getVid = (_brand, _model, _releaseYear, _variant) => {
    const items = dataArray.filter(
      (dataItem) => dataItem.brand === _brand && dataItem.model === _model
    );

    if (!items.length) {
      return null;
    }

    let bestMatch = items[0];

    items.forEach((item) => {
      const releaseYearMatches = _releaseYear
        ? item.release_year === parseFloat(_releaseYear)
        : true;
      const variantMatches = _variant ? item.variant === _variant : true;

      if (releaseYearMatches && variantMatches) {
        bestMatch = item;
      }
    });

    return bestMatch.id;
  };

  const fetchVehicleInfo = async () => {
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
        setVehicleInfo(data);
      } else {
        setVehicleInfo(null);
        setErrorMsg("Vehicle info is empty");
      }
    } catch (error) {
      setErrorMsg("Error fetching vehicle info:", error);
      setVehicleInfo(null);
    }
  };

  // Fetch vehicle information when the component mounts or the vehicleId changes
  useEffect(() => {
    fetchVehicleInfo();
  }, [currentUser, vehicleId]);

  // Update the vehicle information based on the provided vehicle ID and re-fetch the updated information
  const updateVehicle = async () => {
    setErrorMsgPopup("");
    const vid = getVid(brand, model, releaseYear, variant);

    if (!vid) {
      setErrorMsgPopup(
        "Failed to update your saved vehicle. Please fill in all feasible fields in the form."
      );
      return;
    }

    setVehicleId(vid);

    try {
      const token = await currentUser.getIdToken(/* forceRefresh */ true);
      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/users/updateInfo/${vid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // const data = await response.json();
        // console.log(data);
        fetchVehicleInfo(); // Re-fetch the updated vehicle information
      } else {
        setErrorMsg("Error updating vehicle info:", response.statusText);
      }
    } catch (error) {
      setErrorMsg("Error updating vehicle info:", error);
    }
    setOpenPopup(false); // Close the popup window
  };

  const handleUpdateVehicle = () => {
    updateVehicle(vehicleId);
  };

  return (
    <StyledContainer
      maxWidth="md"
      sx={{
        marginTop: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(10),
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
        boxShadow: theme.shadows[3],
      }}
    >
      <Typography
        component="h1"
        variant="h3"
        color="primary"
        sx={{ textAlign: "center" }}
      >
        JuiceFinder
      </Typography>
      <Avatar
        sx={{
          margin: theme.spacing(1),
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <OfflineBoltIcon />
      </Avatar>
      <div>
        {errorMsg && (
          <Box>
            <Typography color="error">{errorMsg}</Typography>
          </Box>
        )}
        <Box sx={{ fontWeight: "Bold", marginTop: theme.spacing(3) }}>
          <Typography variant="h4">Account Information</Typography>
        </Box>
        <Typography>
          <b>Email:</b> {currentUser.email}
        </Typography>
        {/* <Typography>
          <b>User ID:</b> {currentUser.uid}
        </Typography> */}

        {vehicleInfo && (
          <div style={{ marginTop: theme.spacing(3) }}>
            <Box sx={{ fontWeight: "Bold" }}>
              <Typography variant="h4">Saved Vehicle Information</Typography>
            </Box>
            {/* <Typography>
              <b>Vehicle ID:</b> {vehicleInfo.id}
            </Typography> */}
            <Typography>
              <b>Brand:</b> {vehicleInfo.brand}
            </Typography>
            <Typography>
              <b>Type:</b> {vehicleInfo.vehicle_type}
            </Typography>
            <Typography>
              <b>Model:</b> {vehicleInfo.model}
            </Typography>
            <Typography>
              <b>Release Year:</b> {vehicleInfo.release_year}
            </Typography>
            {vehicleInfo.variant && (
              <Typography>
                <b>Variant:</b> {vehicleInfo.variant}
              </Typography>
            )}
            <Typography>
              <b>Vehicle Type:</b> {vehicleInfo.type}
            </Typography>
            {vehicleInfo.usable_battery_size && (
              <Typography>
                <b>Usable Battery Size:</b> {vehicleInfo.usable_battery_size}
              </Typography>
            )}
            {vehicleInfo.energy_consumption && (
              <Typography>
                <b>Energy Consumption:</b> {vehicleInfo.energy_consumption}
              </Typography>
            )}
            {vehicleInfo.port && (
              <Typography>
                <b>Port(s):</b> {vehicleInfo.port}
              </Typography>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: theme.spacing(1) }}>
        <Button onClick={handleOpenPopup} variant="contained" color="primary">
          Update Saved Vehicle
        </Button>
        <Dialog open={openPopup} onClose={handleClosePopup}>
          <DialogTitle>
            <Box sx={{ fontWeight: "Bold" }}>
              <Typography variant="h4">Save a new vehicle</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {errorMsgPopup && (
              <Box>
                <Typography color="error">{errorMsgPopup}</Typography>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
            >
              {/* Brand Text Field */}
              <TextField
                select
                variant="outlined"
                color="primary"
                label="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {Array.from(new Set(dataArray.map((item) => item.brand))).map(
                  (option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )
                )}
              </TextField>

              {/* Model Text Field */}
              <TextField
                select
                variant="outlined"
                color="primary"
                label="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {Array.from(
                  new Set(
                    dataArray
                      .filter((item) => item.brand === brand)
                      .map((item) => item.model)
                  )
                ).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              {/* Release Year Text Field */}
              {Array.from(
                new Set(
                  dataArray
                    .filter(
                      (item) => item.brand === brand && item.model === model
                    )
                    .map((item) => item.release_year)
                )
              ).length > 0 && (
                <Box>
                  <TextField
                    select
                    variant="outlined"
                    color="primary"
                    label="Release Year"
                    value={parseFloat(releaseYear)}
                    onChange={(e) => {
                      setReleaseYear(e.target.value);
                    }}
                  >
                    {Array.from(
                      new Set(
                        dataArray
                          .filter(
                            (item) =>
                              item.brand === brand && item.model === model
                          )
                          .map((item) => parseInt(item.release_year, 10))
                      )
                    ).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
              {/* Variant Text Field */}
              {availableVariants[0] !== "" && (
                <Box>
                  <TextField
                    select
                    variant="outlined"
                    color="primary"
                    label="Variant"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                  >
                    {availableVariants.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: "auto",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateVehicle}
                >
                  Update Vehicle
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    </StyledContainer>
  );
}

export default Settings;
