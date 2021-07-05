import { createMuiTheme } from '@material-ui/core/styles';

/**
 * color theme:
 *
 *  primary: 75CFB8 (thick green)
 *  secondary: BBDFC8 (thin green)
 *  third: F0E5D8 (thin orange)
 *  fourth: FFC478 (thick orange)
 *
 **/
const primeColor = "#75CFB8";
const secondaryColor = "#BBDFC8";
const thirdColor = "#F0E5D8";
const fourthColor = "#FFC478";  

/**
 * add additional theme property
 *  - https://material-ui.com/customization/palette/#adding-new-colors
 **/
declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    headerBackground: Palette['background'];
  }
  interface PaletteOptions {
    headerBackground: PaletteOptions['background'];
  }
}


export const theme = createMuiTheme({

  /**
   * override default theme provided by material-ui here
   **/
  overrides: {

    MuiCssBaseline: {
      '@global': {
        html: {
          scrollBehaivor: "smooth",
        },
        // to keep the footer where it should belong to 
        // - use flexbox to make this happen.
        // ref: https://dev.to/nehalahmadkhan/how-to-make-footer-stick-to-bottom-of-web-page-3i14
        '#root': {
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",

          '& > footer': {
            marginTop: "auto",
          }
        },
      },
    },
    MuiAvatar: {
      colorDefault: {
        color: primeColor,
        backgroundColor: thirdColor,
      }
    },
    MuiButton: {
      contained: {
        margin: `8px 4px`,
        backgroundColor: fourthColor 
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: "transparent" 
      }
    },
    MuiAppBar: {
      colorDefault: {
        color: "#000000",
        backgroundColor: "transparent",
      }
    },
    MuiDialog: {
      paper: {
        backgroundColor: "#FFFFFF",
      }
    },
    MuiPopover: {
      paper: {
        backgroundColor: "#FFFFFF",
      }
    },
    MuiDrawer: {
      paper: {
        backgroundColor: "#FFFFFF",
      }
    },
    MuiSwitch: {
      colorSecondary: {
        '&$checked': {
          color: fourthColor,
        }
      }
    },
    //MuiCollapse:  {
    //  container: {
    //    backgroundColor: "#FFFFFF"
    //  }
    //}
  },
  palette: {
    primary: {
      main: fourthColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
    },
    headerBackground: {
      paper: "transparent"
    }
  }
});
