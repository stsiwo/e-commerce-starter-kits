import * as React from 'react';
import { Link as RRLink, LinkProps as RouterLinkProps } from "react-router-dom";

/**
 * integration material ui with react router dom.
 *
 * ref: https://material-ui.com/guides/composition/#routing-libraries
 *
 **/
export const constructLinkWrapper: (path: string) => React.ForwardRefExoticComponent<RouterLinkProps> = (path) => React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((props, ref) => (
  <RRLink ref={ref} to={path} {...props} />
));
