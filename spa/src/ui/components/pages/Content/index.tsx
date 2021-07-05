import PageRoute from 'components/routes/PageRoute';
import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { mSelector, rsSelector } from 'src/selectors/selector';
import { MessageTypeEnum } from 'src/app';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import Notification from 'components/common/Notification';
import { NotificationType } from 'domain/notification/types';
import Background from 'components/common/Background';

const Content: React.FunctionComponent<{}> = (props) => {

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const curMessage = useSelector(mSelector.makeMessageSelector())
  React.useEffect(() => {
    if (curMessage.type !== MessageTypeEnum.INITIAL) {
      enqueueSnackbar(
        curMessage.message, 
        { 
          variant: curMessage.type,
          persist: curMessage.persist,
          action: (key: any) => (
            <IconButton onClick={() => { closeSnackbar(key) }}>
             <HighlightOffIcon /> 
            </IconButton>
          )
        });
    }
  }, [curMessage.id])

  const curNotification = useSelector(mSelector.makeNotificationByCurIndexSelector())
  const curNotificationIndex = useSelector(rsSelector.domain.getNotificationCurIndex)
  React.useEffect(() => {
    if (curNotification) {
      enqueueSnackbar(
        curNotification, 
        { 
          variant: "info", 
          content: (key, message: NotificationType) => (
           <Notification id={key} message={message} />   
          )
        });
    }
  }, [curNotificationIndex])

  return (
    <React.Fragment>
      <Background />
      <PageRoute />       
    </React.Fragment>
  )
}

export default Content
