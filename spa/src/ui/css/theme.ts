import { createMuiTheme } from "@material-ui/core/styles";

/**
 * color theme:
 *
 *  primary: FFC478 (thick orange)
 *  secondary: BBDFC8 (thin green)
 *  third: F0E5D8 (thin orange)
 *  fourth: 75CFB8 (thick green)
 *  fifthColor: b8860b (more thick orange) - use this when you want highlight
 *
 **/
const primeColor = "#FFC478";
const secondaryColor = "#BBDFC8";
const thirdColor = "#F0E5D8";
const fourthColor = "#75CFB8";
const fifthColor = "#B8860B";

/**
 * add additional theme property
 *  - https://material-ui.com/customization/palette/#adding-new-colors
 **/
declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    headerBackground: Palette["background"];
    third: Palette["primary"];
    fourth: Palette["primary"];
    fifth: Palette["primary"];
  }
  interface PaletteOptions {
    headerBackground: PaletteOptions["background"];
    third: PaletteOptions["primary"];
    fourth: PaletteOptions["primary"];
    fifth: PaletteOptions["primary"];
  }
}

export const theme = createMuiTheme({
  /**
   * override default theme provided by material-ui here
   **/
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          scrollBehaivor: "smooth",
        },
        // to keep the footer where it should belong to
        // - use flexbox to make this happen.
        // ref: https://dev.to/nehalahmadkhan/how-to-make-footer-stick-to-bottom-of-web-page-3i14
        "#root": {
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",

          "& > footer": {
            marginTop: 320,
          },
        },
      },
    },
    MuiAvatar: {
      colorDefault: {
        color: primeColor,
        backgroundColor: thirdColor,
      },
    },
    MuiButton: {
      contained: {
        margin: `8px 4px`,
        backgroundColor: primeColor,
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: "transparent",
      },
    },
    MuiAppBar: {
      colorDefault: {
        color: "#000000",
        backgroundColor: "transparent",
      },
    },
    MuiDialog: {
      paper: {
        backgroundColor: "#FFFFFF",
      },
    },
    MuiPopover: {
      paper: {
        backgroundColor: "#FFFFFF",
      },
    },
    MuiDrawer: {
      paper: {
        backgroundColor: "#FFFFFF",
      },
    },
    MuiSwitch: {
      colorSecondary: {
        "&$checked": {
          color: primeColor,
        },
      },
    },
    MuiMobileStepper: {
      root: {
        backgroundColor: "transparent",
      },
    },
    //MuiCollapse:  {
    //  container: {
    //    backgroundColor: "#FFFFFF"
    //  }
    //}
  },
  palette: {
    primary: {
      main: primeColor,
    },
    secondary: {
      main: secondaryColor,
    },
    third: {
      main: thirdColor,
    },
    fourth: {
      main: fourthColor,
    },
    fifth: {
      main: fifthColor,
    },
    background: {},
    headerBackground: {
      paper: "transparent",
    },
  },
});
