import * as React from 'react';
import { UserTypeEnum } from 'src/app';
import Guest from 'components/pages/Guest';
import Member from 'components/pages/Member';
import Home from 'components/pages/Home';

// route data
export declare type RouteDataType = {
  url: string
  component: React.FunctionComponent
}

export declare type RoutesDataType = {
  [key in UserTypeEnum]?: RouteDataType[]
}

export declare type CommonRoutesDataType = RouteDataType[] 

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

export const commonRoutesData: CommonRoutesDataType = [
  {
    url: '/',
    component: Home
  },
]
