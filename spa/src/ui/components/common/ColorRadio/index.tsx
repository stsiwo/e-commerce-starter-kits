import Radio, { RadioProps } from '@material-ui/core/Radio';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ColorCell from 'components/common/GridData/ColorCell';
import { ProductVariantSizeType } from 'domain/product/types';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

interface ColorRadioPropsType {
  color: string
} 

/**
 * product page 
 *
 *  - steps
 *
 *    0: fetch the product detail from api
 *
 *    1: display a given product detail including its variants
 *
 *    2: a user select a specific variant (color, size) and its quantity
 *
 *    3: add to cart / checkout
 *
 *
 **/
const ColorRadio: React.FunctionComponent<RadioProps> = (props) => {

  const classes = useStyles();

  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<ColorCell value={props.value as string} checked />} 
      icon={<ColorCell value={props.value as string} />}
      {...props}
    />
  )
}

export default ColorRadio




