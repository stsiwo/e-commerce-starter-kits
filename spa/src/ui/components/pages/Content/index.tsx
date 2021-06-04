import PageRoute from 'components/routes/PageRoute';
import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import { MessageTypeEnum } from 'src/app';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';

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

  return (
    <React.Fragment>
      <PageRoute />       
    </React.Fragment>
  )
}

export default Content
