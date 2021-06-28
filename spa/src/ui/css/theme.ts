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
      },
    },
  },
  palette: {
    headerBackground: {
      paper: "transparent"
    }
  }
});
