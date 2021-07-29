import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      width: 240,
      flexShrink: 0,
      zIndex: 0,
    },
    dialogPaper: {
      width: 240,
    },
    dialogContentRoot: {
      padding: theme.spacing(1),
    },
  })
);

const DemoDialog: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();

  const [curFormOpen, setFormOpen] = React.useState<boolean>(false);

  const toggleDialog =
    (nextOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setFormOpen(nextOpen);
    };

  // set timer to display this dialog (one time only)
  React.useEffect(() => {
    const timer = setTimeout(function () {
      setFormOpen(true);
    }, 10000); // this will change session status to be expired.

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Dialog
      open={curFormOpen}
      onClose={toggleDialog(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">This Is Demo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Thank you for visitng my website. Unfortunately, this website is only
          for <b>demo purpose</b>. Please{" "}
          <b>don't enter your real credit card number</b> when checkout.
          Appreciated your understanding.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDialog(false)} variant="contained">
          Understand
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(DemoDialog);
