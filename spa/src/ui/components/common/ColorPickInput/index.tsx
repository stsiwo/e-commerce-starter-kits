import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ChromePicker, ColorChangeHandler, ColorResult } from 'react-color'; 

interface ColorPickerInputPropsType {
  //inputRef: (instance:  ChromePicker | null) => void;
  onChange: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, color?: ColorResult) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

const ColorPickerInput: React.FunctionComponent<ColorPickerInputPropsType> = (props) => {

  const { onChange, ...other } = props;

  return (
    <ChromePicker
      /**ref={inputRef}**/
      onChangeComplete={(color, event) => {
        onChange(event, color)
      }}
      {...other}
    />
  )
}

export default ColorPickerInput
