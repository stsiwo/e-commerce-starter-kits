import * as React from 'react';
import Box from '@material-ui/core/Box';
import HeroBCImage from 'static/sample-hero-background.jpg'

const Hero: React.FunctionComponent<{}> = (props) => {

  return (
    <Box component="div">
      <img src={HeroBCImage} alt="stsDev Hero Image" />
    </Box>
  )
}

export default Hero


