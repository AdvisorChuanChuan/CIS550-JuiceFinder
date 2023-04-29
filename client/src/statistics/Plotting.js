/* eslint-disable func-names */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Container } from "@mui/material";
import USAMap from "react-usa-map";
import * as d3 from "d3";
import rd3 from "react-d3-library";
import { Column, Pie } from "@ant-design/plots";

import serverConfig from "../config.json";

/* Setup colorbar using d3 */
const nColors = 101;
const colorArray = [];
const colorScaler = d3
  .scaleLinear()
  .range(["#F0F3BD", "#02C39A"])
  .domain([0, nColors - 1]);

for (let i = 0; i < nColors; i += 1) {
  colorArray[i] = colorScaler(i);
}

/* Maps number to color with color step of 200 */
const numberToColor = (number) => {
  // return closest color by calculating index
  return colorArray[Math.floor(number / 200)];
};
// discrete legend value
const legend = [
  "0",
  "2000",
  "4000",
  "6000",
  "8000",
  "10000",
  "12000",
  "14000",
  "16000",
  "18000",
  "20000",
];
// discrete legend colors
const colorRank = [
  colorArray[0],
  colorArray[10],
  colorArray[20],
  colorArray[30],
  colorArray[40],
  colorArray[50],
  colorArray[60],
  colorArray[70],
  colorArray[80],
  colorArray[90],
  colorArray[100],
];
// legend value
const node = document.createElement("div");
const svgLegend = d3
  .select(node)
  .append("svg")
  .attr("id", "usmapLegend")
  .attr("width", 300)
  .attr("height", 550);
// concat colorArray required by legend setup
const colorArrConcat = d3.range(11).reduce(function (arr, elem) {
  return arr.concat(
    d3.range(11).map(function () {
      return {
        col: elem,
      };
    })
  );
}, []);
// legend setup: rectangular color block
svgLegend
  .selectAll(null)
  .data(colorArrConcat)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", (d) => d.col * 50)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", function (d) {
    return colorRank[d.col];
  });
// legend setup: text
svgLegend
  .selectAll(null)
  .data(colorArrConcat)
  .enter()
  .append("text")
  .attr("x", 40)
  .attr("y", (d) => d.col * 50 + 15)
  .text(function (d) {
    return legend[d.col];
  });
// create class for USMap legend rendering */
const RD3Component = rd3.Component;
class CategoricalMapLegend extends React.Component {
  constructor(props) {
    super(props);
    this.state = { d3: "" };
  }

  componentDidMount() {
    this.setState({ d3: svgLegend.node() });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    return <RD3Component data={this.state.d3} />;
  }
}

// Stats-Fig #1
function afsByTypePie() {
  const [data, setData] = useState([]);

  const asyncFetch = () => {
    fetch(
      `http://${serverConfig.server_host}:${serverConfig.server_port}/stats/overview/afsByType`
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("fetch data failed", error);
      });
  };

  useEffect(() => {
    asyncFetch();
  }, []);

  const config = {
    appendPadding: 10,
    data,
    angleField: "numStations",
    colorField: "fuelType",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-15%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    legend: {
      position: "bottom",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Pie {...config} />;
}
// Stats-Fig #2
function afsByStateMap() {
  const [mapData, setMapData] = useState([]);

  const asyncFetch = () => {
    fetch(
      `http://${serverConfig.server_host}:${serverConfig.server_port}/stats/overview/afsByState`
    )
      .then((response) => response.json())
      .then((json) => {
        // JSON format needed for the map
        const usmapJson = {};
        // mappings numStations to colors and assign color
        json.forEach(function (obj) {
          // eslint-disable-next-line dot-notation, no-unused-vars
          usmapJson[obj.state] = {
            val: obj.numStations,
            fill: numberToColor(obj.numStations),
          };
        });
        setMapData(usmapJson);
        // eslint-disable-next-line no-console
        console.log(typeof mapData);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log("fetch data failed", error);
      });
  };

  useEffect(() => {
    asyncFetch();
  }, []);

  return (
    <Container>
      <USAMap customize={mapData} />
    </Container>
  );
}
afsByStateMap.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mapData: PropTypes.object.isRequired,
};
// Stats-Fig #2 USA map legend
function mapLegend() {
  return (
    <Container>
      <CategoricalMapLegend />
    </Container>
  );
}

// Stats-Fig #3
function afsByTypeStateBar(data) {
  const config = {
    data,
    xField: "state",
    yField: "numStations",
    isGroup: true,
    isStack: false,
    seriesField: "stype",
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
      offsetY: 8,
      formatter: ({ value }) => value,
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: "top",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    slider: {
      start: 0,
      end: 1.0,
    },
    minColumnWidth: 10,
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Column {...config} />;
}
// Stats-Fig #4
function vehicleByTypeStateBar(data) {
  const config = {
    data,
    xField: "state",
    yField: "numVehicle",
    isGroup: true,
    isStack: false,
    seriesField: "vtype",
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    // label: {
    //   position: "middle",
    //   style: {
    //     fill: "#FFFFFF",
    //     opacity: 0.6,
    //   },
    //   offsetY: 8,
    //   formatter: ({ value }) => value,
    // },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: "top",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    slider: {
      start: 0,
      end: 1.0,
    },
    minColumnWidth: 10,
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Column {...config} />;
}

// Stats-Fig #5
function stationCountByPortStateBar(data) {
  const config = {
    data,
    xField: "state",
    yField: "numStations",
    isGroup: false,
    isStack: true,
    seriesField: "portType",
    columnStyle: {
      radius: [0, 0, 0, 0],
    },
    // label: {
    //   position: "top",
    //   style: {
    //     fill: "#FFFFFF",
    //     opacity: 0.8,

    //   },
    //   offsetY: 8,
    //   formatter: ({ numStations }) => numStations,
    // },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: "top",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    slider: {
      start: 0,
      end: 1.0,
    },
    minColumnWidth: 10,
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Column {...config} />;
}
// Stats-Fig #6
function stationCountBySpeedStateBar(data) {
  const config = {
    data,
    xField: "state",
    yField: "numPort",
    isGroup: false,
    isStack: true,
    seriesField: "speedLevel",
    columnStyle: {
      radius: [0, 0, 0, 0],
    },
    // label: {
    //   position: "middle",
    //   style: {
    //     fill: "#FFFFFF",
    //     opacity: 0.6,
    //   },
    //   offsetY: 8,
    //   formatter: ({ value }) => value,
    // },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: "top",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    slider: {
      start: 0,
      end: 1.0,
    },
    minColumnWidth: 10,
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Column {...config} />;
}
// Stats-Fig #7
function stationCountByNetworkStateBar(data) {
  const config = {
    data,
    xField: "state",
    yField: "numStations",
    isGroup: false,
    isStack: true,
    seriesField: "network",
    columnStyle: {
      radius: [0, 0, 0, 0],
    },
    // label: {
    //   position: "middle",
    //   style: {
    //     fill: "#FFFFFF",
    //     opacity: 0.6,
    //   },
    //   offsetY: 8,
    //   formatter: ({ value }) => value,
    // },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: "top",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    slider: {
      start: 0,
      end: 1.0,
    },
    minColumnWidth: 10,
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Column {...config} />;
}
// Stats-Fig #8
function stationToVehicleBar(data) {
  const config = {
    data,
    xField: "state",
    yField: "nunberOf",
    isGroup: true,
    isStack: false,
    seriesField: "type",
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
      offsetY: 8,
      formatter: ({ stationToVehicleRatio }) => stationToVehicleRatio,
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: "top",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    slider: {
      start: 0,
      end: 1.0,
    },
    minColumnWidth: 10,
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Column {...config} />;
}
// Stats-Fig #9
function restaurantToStationBar(data) {
  const config = {
    data,
    xField: "state",
    yField: "nunberOf",
    isGroup: true,
    isStack: false,
    seriesField: "type",
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
      offsetY: 8,
      formatter: ({ value }) => value,
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: "top",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    slider: {
      start: 0,
      end: 1.0,
    },
    minColumnWidth: 10,
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Column {...config} />;
}
export {
  afsByTypePie,
  afsByStateMap,
  mapLegend,
  afsByTypeStateBar,
  vehicleByTypeStateBar,
  stationCountByPortStateBar,
  stationCountBySpeedStateBar,
  stationCountByNetworkStateBar,
  stationToVehicleBar,
  restaurantToStationBar,
};
