import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Background from "components/common/Background";
import ErrorBoundary from "components/common/ErrorBoundary";
import Notification from "components/common/Notification";
import PageRoute from "components/routes/PageRoute";
import { NotificationType } from "domain/notification/types";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useSelector } from "react-redux";
import { MessageTypeEnum } from "src/app";
import { mSelector, rsSelector } from "src/selectors/selector";

const Content: React.FunctionComponent<{}> = (props) => {
  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const curMessage = useSelector(mSelector.makeMessageSelector());
  React.useEffect(() => {
    if (curMessage.type !== MessageTypeEnum.INITIAL) {
      enqueueSnackbar(curMessage.message, {
        variant: curMessage.type,
        persist: curMessage.persist,
        action: (key: any) => (
          <IconButton
            onClick={() => {
              closeSnackbar(key);
            }}
          >
            <HighlightOffIcon />
          </IconButton>
        ),
      });
    }
  }, [curMessage.id]);

  const curNotification: NotificationType = useSelector(
    rsSelector.domain.getNotificationCurNotification
  );
  React.useEffect(() => {
    console.log("notifiation snackbar called");
    console.log(curNotification);
    if (curNotification) {
      enqueueSnackbar(curNotification, {
        variant: "info",
        content: (key, message: NotificationType) => (
          <Notification id={key} message={message} />
        ),
      });
    }
  }, [JSON.stringify(curNotification)]);

  return (
    <React.Fragment>
      <Background />
      <ErrorBoundary>
        <PageRoute />
      </ErrorBoundary>
    </React.Fragment>
  );
};

export default Content;
