import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';

interface TabPanelPropsType {
  index: number
  value: number
  render: () => React.ReactNode
  className?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      position: "absolute",
      backgroundColor: "#fff",
      width: "100%",
    },
  }),
);

const TabPanel: React.FunctionComponent<TabPanelPropsType> = ({
  index,
  value,
  render,
  ...other
}) => {

  const classes = useStyles();

  return (
    <div
      className={classes.box}
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        render()
      )}
    </div>
  )
}

export default TabPanel
