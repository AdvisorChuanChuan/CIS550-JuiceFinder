import { createTheme } from "@mui/material/styles";

const lightThemeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#090088",
    },
    secondary: {
      main: "#ecb939",
    },
    success: {
      main: "#02C39A",
    },
    info: {
      main: "#028090",
    },
    background: {
      // default: "#ffffff",
      default: "#f5f5fa",
      paper: "#FFFFF0",
      landing: "#f3f3ff",
      header: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Raleway",
    h1: {
      fontWeight: 400,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 5,
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiRadio: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
  },
};

const darkThemeOptions = {
  palette: {
    type: "dark",
    primary: {
      main: "#a8e6cf",
    },
    secondary: {
      main: "#ff8b94",
    },
    success: {
      main: "#02C39A",
    },
    info: {
      main: "#028090",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "rgba(222,222,222,0.7)",
    },
    background: {
      default: "#121212",
      paper: "#282b30",
      landing: "#121212",
      header: "#121212",
    },
  },
  typography: {
    fontFamily: "Raleway",
    h1: {
      fontWeight: 400,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 5,
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiRadio: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
  },
};

const lightTheme = createTheme(lightThemeOptions);
const darkTheme = createTheme(darkThemeOptions);

export { lightTheme, darkTheme };
