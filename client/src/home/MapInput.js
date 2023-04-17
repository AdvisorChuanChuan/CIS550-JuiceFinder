// import PropTypes from "prop-types";
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Autocomplete,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import stateDict from "../assets/states_hash.json";
import chargingLevelArr from "../assets/charging_levels.json";
import stationPortArr from "../assets/port_types.json";

export default function MapInput({
  state,
  setState,
  city,
  setCity,
  zip,
  setZip,
  streetAddress,
  setStreetAddress,
  maxDistance,
  setMaxDistance,
  brand,
  setBrand,
  model,
  setModel,
  releaseYear,
  setReleaseYear,
  variant,
  setVariant,
  chargingLevels,
  setChargingLevels,
  preferredStationPorts,
  setPreferredStationPorts,
  adapters,
  setAdapters,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("submitted");
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
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
        <FormControl>
          <FormLabel id="distance-radio-buttons-group-label">
            Max Distance
          </FormLabel>
          <RadioGroup
            row
            defaultValue={1}
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseInt(e.target.value, 10))}
            aria-labelledby="distance-radio-buttons-group-label"
            name="distance-row-radio-buttons-group"
          >
            <FormControlLabel value={1} control={<Radio />} label="1 mile" />
            <FormControlLabel value={5} control={<Radio />} label="5 miles" />
            <FormControlLabel value={10} control={<Radio />} label="10 miles" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
      >
        <h3>My Vehicle</h3>
        <TextField
          select
          variant="outlined"
          color="secondary"
          label="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          {[""]?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="outlined"
          color="secondary"
          label="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {[""]?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="outlined"
          color="secondary"
          label="Release Year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        >
          {[""]?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="outlined"
          color="secondary"
          label="Variant"
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
        >
          {[""]?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "50ch" },
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
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Charging Level"
              // placeholder="Favorites"
            />
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
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Station Port Type(s)"
            />
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
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Adapters at Hand"
            />
          )}
        />
      </Box>
    </form>
  );
}

MapInput.propTypes = {
  state: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  city: PropTypes.string.isRequired,
  setCity: PropTypes.func.isRequired,
  zip: PropTypes.string.isRequired,
  setZip: PropTypes.func.isRequired,
  streetAddress: PropTypes.string.isRequired,
  setStreetAddress: PropTypes.func.isRequired,
  maxDistance: PropTypes.number.isRequired,
  setMaxDistance: PropTypes.func.isRequired,
  brand: PropTypes.string.isRequired,
  setBrand: PropTypes.func.isRequired,
  model: PropTypes.string.isRequired,
  setModel: PropTypes.func.isRequired,
  releaseYear: PropTypes.string.isRequired,
  setReleaseYear: PropTypes.func.isRequired,
  variant: PropTypes.string.isRequired,
  setVariant: PropTypes.func.isRequired,
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
};
