/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import MUI icons
import EqualizerIcon from "@mui/icons-material/Equalizer";
import EvStationIcon from "@mui/icons-material/EvStation";
import MoodIcon from "@mui/icons-material/Mood";
// Import .js files, each page will be rendered when the tab was toggled
import OverviewTab from "./OverviewTab";
import ElectricStationTab from "./ElectricStationTab";
import EVFriendlinessTab from "./EVFriendlinessTab";

// functions required by MUI-tab component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Typography
          component="div"
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          {children}
        </Typography>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// statistics page
function Statistics() {
  // use theme for this page
  const theme = useTheme();

  // state varirable for tab toggling
  const [value, setValue] = React.useState(0);
  // handler for tan toggling
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        maxWidth="1740px"
        disableGutters="true"
        paddingRight="170px"
        sx={{
          borderBottom: 1,
          color: "inherit",
          borderColor: theme.palette.background.default,
          backgroundColor: theme.palette.background.default,
          minwidth: "1740",
        }}
      >
        <Box
          maxWidth="1740px"
          disableGutters="true"
          sx={{
            borderBottom: 1,
            borderColor: theme.palette.background.default,
            color: "inherit",
            minwidth: "1740",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            color="inherit"
          >
            <Tab
              label="AFS Resources Overview"
              {...a11yProps(0)}
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
              icon={<EqualizerIcon fontSize="large" />}
            />
            <Tab
              label="Electric Charging Stations"
              {...a11yProps(1)}
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
              icon={<EvStationIcon fontSize="large" />}
            />
            <Tab
              label="EV Friendliness"
              {...a11yProps(2)}
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
              icon={<MoodIcon fontSize="large" />}
            />
          </Tabs>
        </Box>

        <TabPanel
          value={value}
          index={0}
          sx={{ color: theme.palette.primary.main }}
        >
          <OverviewTab />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          sx={{ color: theme.palette.primary.main }}
        >
          <ElectricStationTab />
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          sx={{ color: theme.palette.primary.main }}
        >
          <EVFriendlinessTab />
        </TabPanel>
      </Box>
    </Box>
  );
}

Statistics.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
};

export default Statistics;
