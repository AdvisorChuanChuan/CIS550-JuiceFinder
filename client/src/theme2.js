import { createTheme } from "@mui/material/styles";

const lightThemeOptions = {
  palette: {
    type: "light",
    primary: {
      // main: "#05668D",
      main: "#014781",
    },
    secondary: {
      // main: "#F0F3BD",
      main: "#ffffff",
    },
    success: {
      main: "#02C39A",
    },
    info: {
      main: "#028090",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
      landing: "#f3f3ff",
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
      // main: "#F0F3BD",
      main: "#f7f097",
    },
    secondary: {
      main: "#000000",
      // main: "#f5f5f5",
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
      // default: "#121212",
      default: "#000000",
      // paper: "#1f1f1f",
      paper: "#0c0c00",
      landing: "#121212",
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
