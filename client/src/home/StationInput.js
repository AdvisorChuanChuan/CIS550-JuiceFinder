import { React } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Autocomplete,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Button,
  Checkbox,
} from "@mui/material";

import stateDict from "../assets/states_hash.json";
import chargingLevelArr from "../assets/charging_levels.json";
import stationPortArr from "../assets/port_types.json";

export default function StationInput({
  state,
  setState,
  city,
  setCity,
  zip,
  setZip,
  streetAddress,
  setStreetAddress,
  stationDistance,
  setStationDistance,
  chargingLevels,
  setChargingLevels,
  preferredStationPorts,
  setPreferredStationPorts,
  adapters,
  setAdapters,
  vehiclePorts,
  matchVehicle,
  setMatchVehicle,
  formError,
  setFormError,
  formErrorText,
  setFormErrorText,
  handleStationInputSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state && !city && !streetAddress && !zip) {
      setFormError(true);
      setFormErrorText("At least one field must be non-empty.");
    } else {
      setFormError(false);
      handleStationInputSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl error={formError} fullWidth>
        <Box sx={{ width: "min-content" }}>
          <Box
            sx={{
              "& .MuiTextField-root": {
                my: 1,
                width: "30ch",
              },
            }}
          >
            <h3>Location</h3>
            <TextField
              select
              variant="outlined"
              color="secondary"
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              {Object.entries(stateDict).map(([abbrev, full]) => (
                <MenuItem key={full} value={abbrev}>
                  {abbrev}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Street Address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Zip Code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            {formError && <FormHelperText>{formErrorText}</FormHelperText>}
            <FormControl>
              <FormLabel id="distance-radio-buttons-group-label">
                Max Distance
              </FormLabel>
              <RadioGroup
                row
                defaultValue={1}
                value={stationDistance}
                onChange={(e) =>
                  setStationDistance(parseInt(e.target.value, 10))
                }
                aria-labelledby="distance-radio-buttons-group-label"
                name="distance-row-radio-buttons-group"
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="1 mile"
                />
                <FormControlLabel
                  value={5}
                  control={<Radio />}
                  label="5 miles"
                />
                <FormControlLabel
                  value={10}
                  control={<Radio />}
                  label="10 miles"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box
            sx={{
              "& .MuiTextField-root": { my: 1, width: "30ch" },
            }}
          >
            <h3>Advanced</h3>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={!vehiclePorts}
                  checked={matchVehicle}
                  onChange={(e) => setMatchVehicle(e.target.checked)}
                  icon={
                    <span
                      style={{
                        borderRadius: 2,
                        border: "1px solid #000",
                        width: 16,
                        height: 16,
                      }}
                    />
                  }
                  checkedIcon={
                    <span
                      style={{
                        borderRadius: 2,
                        border: "1px solid #000",
                        width: 16,
                        height: 16,
                        backgroundColor: "#000",
                      }}
                    />
                  }
                />
              }
              label="Match My Vehicle's Ports"
            />
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
              disabled={matchVehicle}
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
              // eslint-disable-next-line no-unused-vars
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
              Find Juice
            </Button>
          </Box>
        </Box>
      </FormControl>
    </form>
  );
}

StationInput.propTypes = {
  state: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  city: PropTypes.string.isRequired,
  setCity: PropTypes.func.isRequired,
  zip: PropTypes.string.isRequired,
  setZip: PropTypes.func.isRequired,
  streetAddress: PropTypes.string.isRequired,
  setStreetAddress: PropTypes.func.isRequired,
  stationDistance: PropTypes.number.isRequired,
  setStationDistance: PropTypes.func.isRequired,
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
  vehiclePorts: PropTypes.string.isRequired,
  matchVehicle: PropTypes.bool.isRequired,
  setMatchVehicle: PropTypes.func.isRequired,
  formError: PropTypes.bool.isRequired,
  setFormError: PropTypes.func.isRequired,
  formErrorText: PropTypes.string.isRequired,
  setFormErrorText: PropTypes.func.isRequired,
  handleStationInputSubmit: PropTypes.func.isRequired,
};
