import { UsePreviousInput } from "./types";
import * as React from "react";

export const usePrevious = <S extends any>(input: UsePreviousInput<S>): S => {

  const ref = React.useRef<S>();

  React.useEffect(() => {
    ref.current = input.value
  }, [input.value])

  /**
   * redux reducer complains about this if you return 'undefined'
   **/
  if (!ref.current) {
    return null
  }

  return ref.current as S
}


