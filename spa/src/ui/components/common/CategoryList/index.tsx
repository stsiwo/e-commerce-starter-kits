import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import CategoryCard from "../CategoryCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      // need to set this. otherwise, <Grid spacing={x}> causes overflow horizontally.
      // ref: https://material-ui.com/components/grid/#limitations
      overflow: "hidden",
      padding: theme.spacing(0, 1, 0, 1),
    },
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6),
    },
    item: {},
    moreBtnBox: {
      margin: theme.spacing(3),
      display: "flex",
      justifyContent: "center",
    },
  })
);

const CategoryList: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  /**
   * TODO: replace test category with real one
   *
   **/

  return (
    <Box component="section" className={classes.section}>
      <Typography
        variant="h5"
        component="h5"
        align="center"
        className={classes.title}
      >
        {"Categories"}
      </Typography>
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} md={6} lg={4} className={classes.item}>
          <CategoryCard />
        </Grid>
        <Grid item xs={12} md={6} lg={4} className={classes.item}>
          <CategoryCard />
        </Grid>
        <Grid item xs={12} md={6} lg={4} className={classes.item}>
          <CategoryCard />
        </Grid>
        <Grid item xs={12} md={6} lg={4} className={classes.item}>
          <CategoryCard />
        </Grid>
        <Grid item xs={12} md={6} lg={4} className={classes.item}>
          <CategoryCard />
        </Grid>
        <Grid item xs={12} md={6} lg={4} className={classes.item}>
          <CategoryCard />
        </Grid>
      </Grid>
      <Box component="div" className={classes.moreBtnBox}>
        <Button variant="contained">More Categories</Button>
      </Box>
    </Box>
  );
};

export default CategoryList;
