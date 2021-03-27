import * as React from 'react';
import { UserTypeEnum } from 'src/app';
import Guest from 'components/pages/Guest';
import Member from 'components/pages/Member';

// route data
export declare type RouteDataType = {
  url: string
  component: React.FunctionComponent
}

export declare type RoutesDataType = {
  [key in UserTypeEnum]?: RouteDataType[]
}

export const routesData: RoutesDataType = {
  [UserTypeEnum.GUEST]: [
    {
      url: "/guest",
      component: Guest,
    },
  ],
  [UserTypeEnum.MEMBER]: [
    {
      url: "/member",
      component: Member,
    },
  ] 
}
