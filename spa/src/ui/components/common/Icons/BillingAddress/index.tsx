import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import * as React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);


/**
 * custom svgIcon does not work.
 * this always return a simle svg icon. I have no idea.
 *
 * attempts:
 *  - https://stackoverflow.com/questions/38510443/how-to-use-an-svg-file-in-a-svgicon-in-material-ui
 *  - https://github.com/mui-org/material-ui/blob/56c113217d7d05d8bb0712771b727df81984d04b/src/svg-icons/action/home.js
 *
 **/

const BillingAddressIcon = (props: SvgIconProps) => {

  const classes = useStyles();

  return (
    <SvgIcon {...props}>
      <path d="M21.49 8V8.0005L21.5 18C21.5 18.0001 21.5 18.0003 21.5 18.0004C21.4998 18.8241 20.8237 19.5 20 19.5H4C3.17614 19.5 2.5 18.8239 2.5 18V8C2.5 7.46208 2.78226 6.99166 3.2075 6.72863L12 1.57943L20.7925 6.72863C21.2135 6.98905 21.49 7.4572 21.49 8ZM11.7351 13.4241L12 13.5895L12.2649 13.4241L20.5249 8.26406L21.2256 7.82631L20.5128 7.40861L12.2528 2.5686L12 2.42049L11.7472 2.5686L3.48722 7.40861L2.77436 7.82631L3.47509 8.26406L11.7351 13.4241Z" fill="black" stroke="black"/>
<path d="M12.1691 7.62789C11.185 7.37425 10.8686 7.11202 10.8686 6.70362C10.8686 6.23504 11.3064 5.90832 12.039 5.90832C12.8107 5.90832 13.0968 6.27373 13.1228 6.8111H14.0808C14.0505 6.07168 13.5953 5.39246 12.6893 5.17321V4.23175H11.3888V5.16031C10.5478 5.34087 9.87149 5.88253 9.87149 6.71222C9.87149 7.70527 10.6995 8.19964 11.909 8.48767C12.9927 8.7456 13.2095 9.12391 13.2095 9.52371C13.2095 9.82033 12.9971 10.2932 12.039 10.2932C11.146 10.2932 10.7949 9.89771 10.7472 9.39044H9.79346C9.84548 10.3319 10.5564 10.8607 11.3888 11.0369V11.9698H12.6893V11.0455C13.5346 10.8865 14.2066 10.4007 14.2066 9.51941C14.2066 8.29852 13.1531 7.88152 12.1691 7.62789Z" fill="black"/>
    </SvgIcon>
  )
}
BillingAddressIcon.displayName = 'BillingAddressIcon';
BillingAddressIcon.muiName = 'SvgIcon';

export default BillingAddressIcon



