import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { adminNavData, NavDataType, NavDataItemType } from '../AdminNavDrawer';
import { Link as RRLink } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
      padding: theme.spacing(0, 1),
      /**
       * this is necessary for scrollable tabs (from Mui) used for filter/sort for each domain.
       **/
      width: "100%",

    },
    topSection: {
      display: "flex",
      justifyContent: "flex-start",
    },
    card: {
      maxWidth: 300,
      margin: theme.spacing(1)
    }
  }),
);

/**
 * admin account management page
 *
 **/
const AdminDashboard: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const renderTopSections: () => React.ReactNode = () => {
    return adminNavData.map((topNav: NavDataType) => (
      <React.Fragment>
        <Typography variant="h6" component="h6">
          {topNav.title}
        </Typography>
        <Box component="div" className={classes.topSection}>
          {renderSecondSections(topNav.items)}
        </Box>
      </React.Fragment>
    ));
  }

  const renderSecondSections: (items: NavDataItemType[]) => React.ReactNode = (items) => {
    return items.map((item: NavDataItemType) => {
      const NavIcon = item.Icon

      if (item.link === "/admin") return null

      return (
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label={item.label} className={null}>
                <NavIcon />
              </Avatar>
            }
            title={item.label}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {item.desc}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" component={RRLink} to={item.link}>
              Go
            </Button>
          </CardActions>
        </Card>
      )
    })
  }

  return (
    <Box component="div" className={classes.box}>
      {renderTopSections()}
    </Box>
  )
}

export default AdminDashboard



