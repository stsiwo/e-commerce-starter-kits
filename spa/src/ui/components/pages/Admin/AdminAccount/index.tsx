import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AdminAccountBasicManagement from './AdminAccountBasicManagement';
import Grid from '@material-ui/core/Grid';
import AdminAccountAvatarManagement from './AdminAccountAvatarManagement';
import AdminAccountCompanyManagement from './AdminAccountCompanyManagement';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      flexGrow: 1,
      padding: theme.spacing(0, 1),
    },
    card: {
      flexGrow: 1,
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2)
    },
    gridContainer: {
      padding: theme.spacing(1),

      /**[theme.breakpoints.down("md")]: {
        flexDirection: 'column-reverse',
      }**/
    },
    gridItem: {
      // setting margin breaks <Grid xs, md, lg > system
      // so use 'padding' instead
      padding: theme.spacing(1)
    }
  }),
);

/**
 * admin account management page
 *
 **/
const AdminAccount: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  return (
    <Box component="div" className={classes.box}>
      <Typography variant="body2" component="p" align="left" className={classes.title} >
        {"Account"}
      </Typography>
      {/** row 1 **/}
      <Box>
        <Card className={classes.card}>
          <CardHeader
            titleTypographyProps={{
              variant: 'h6',
            }}
            subheaderTypographyProps={{
              variant: 'body1'
            }}
            title="Account"
            subheader="Enter your admin information. These information is used to access all of resources about this website (e.g., customers, orders, products and so on)."
          />
          <CardContent>
            <Grid
              container
              justify="space-around"
              alignItems="center"
              className={classes.gridContainer}
            >
              <Grid
                item
                xs={12}
                md={4}
                className={classes.gridItem}
              >
                <AdminAccountAvatarManagement />
              </Grid>
              <Grid
                item
                xs={12}
                md={8}
                className={classes.gridItem}
              >
                <AdminAccountBasicManagement />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/** row 2 **/}
        <Box>
          <AdminAccountCompanyManagement />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminAccount


