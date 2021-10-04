import * as React from "react";
import { FetchStatusEnum } from "src/app";
import { UseWaitResponseInputType, UseWaitResponseOutputType } from "./types";

export const useWaitResponse = (
  input: UseWaitResponseInputType
): UseWaitResponseOutputType => {
  const [curDisableBtnStatus, setDisableBtnStatus] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    if (input.fetchStatus === FetchStatusEnum.FETCHING) {
      setDisableBtnStatus(true);
    } else {
      setDisableBtnStatus(false);
    }
  }, [input.fetchStatus]);
  return {
    curDisableBtnStatus: curDisableBtnStatus,
  };
};
