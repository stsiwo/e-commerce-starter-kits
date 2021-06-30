import { createMuiTheme } from '@material-ui/core/styles';


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
  },
  palette: {
    headerBackground: {
      paper: "transparent"
    }
  }
});
