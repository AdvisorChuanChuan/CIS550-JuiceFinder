import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Autocomplete,
  FormControl,
  FormHelperText,
  Button,
} from "@mui/material";

import chargingLevelArr from "../assets/charging_levels.json";
import stationPortArr from "../assets/port_types.json";

export default function PathInput({
  startAddress,
  setStartAddress,
  endAddress,
  setEndAddress,
  // maxDistance,
  // setMaxDistance,
  chargingLevels,
  setChargingLevels,
  preferredStationPorts,
  setPreferredStationPorts,
  adapters,
  setAdapters,
  formError,
  setFormError,
  formErrorText,
  setFormErrorText,
  handlePathInputSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startAddress || !endAddress) {
      setFormError(true);
      setFormErrorText("Please enter a starting and ending address.");
    } else {
      setFormError(false);
      handlePathInputSubmit();
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ width: "min-content" }}>
        <Box
          sx={{
            "& .MuiTextField-root": {
              my: 1,
              width: "30ch",
            },
          }}
        >
          <FormControl error={formError} fullWidth>
            <h3>Locations</h3>
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Starting Address"
              placeholder="123 Main St, San Francisco, CA 94105"
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
            />
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Ending Address"
              placeholder="123 Main St, San Francisco, CA 94105"
              value={endAddress}
              onChange={(e) => setEndAddress(e.target.value)}
            />
            {formError && <FormHelperText>{formErrorText}</FormHelperText>}
          </FormControl>
        </Box>
        <Box
          sx={{
            "& .MuiTextField-root": { my: 1, width: "30ch" },
          }}
        >
          <h3>Advanced</h3>
          <Autocomplete
            multiple
            disableCloseOnSelect
            id="charging-levels"
            options={chargingLevelArr}
            defaultValue={[]}
            value={chargingLevels}
            filterSelectedOptions
            onChange={(e, value) => setChargingLevels(value)}
            renderInput={(params) => (
              <TextField {...params} label="Charging Level" />
            )}
          />
          <Autocomplete
            multiple
            disableCloseOnSelect
            id="station-port-types"
            options={stationPortArr}
            defaultValue={[]}
            value={preferredStationPorts}
            filterSelectedOptions
            onChange={(e, value) => setPreferredStationPorts(value)}
            renderInput={(params) => (
              <TextField {...params} label="Station Port Type(s)" />
            )}
          />
          <Autocomplete
            multiple
            disableCloseOnSelect
            id="adapter-types"
            options={[]}
            // https://stackoverflow.com/a/74913444
            getOptionLabel={(option) => {
              return `${option?.vehiclePort} to ${option?.stationPort}`;
            }}
            defaultValue={[]}
            value={adapters}
            filterSelectedOptions
            onChange={(e, value) => setAdapters(value)}
            renderInput={(params) => (
              <TextField {...params} label="Adapters at Hand" />
            )}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{ py: 1, my: 3, width: "100%" }}
            onClick={handleSubmit}
          >
            Show My Juice Track
          </Button>
        </Box>
      </Box>
    </form>
  );
}

PathInput.propTypes = {
  startAddress: PropTypes.string.isRequired,
  setStartAddress: PropTypes.func.isRequired,
  endAddress: PropTypes.string.isRequired,
  setEndAddress: PropTypes.func.isRequired,
  maxDistance: PropTypes.number.isRequired,
  setMaxDistance: PropTypes.func.isRequired,
  chargingLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
  setChargingLevels: PropTypes.func.isRequired,
  preferredStationPorts: PropTypes.arrayOf(PropTypes.string).isRequired,
  setPreferredStationPorts: PropTypes.func.isRequired,
  adapters: PropTypes.arrayOf(
    PropTypes.shape({
      vehiclePort: PropTypes.string.isRequired,
      stationPort: PropTypes.string.isRequired,
    })
  ).isRequired,
  setAdapters: PropTypes.func.isRequired,
  formError: PropTypes.bool.isRequired,
  setFormError: PropTypes.func.isRequired,
  formErrorText: PropTypes.string.isRequired,
  setFormErrorText: PropTypes.func.isRequired,
  handlePathInputSubmit: PropTypes.func.isRequired,
};
