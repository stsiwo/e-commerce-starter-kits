import * as React from 'react';
import { UserTypeEnum } from 'src/app';
import Guest from 'components/pages/Guest';
import Member from 'components/pages/Member';
import Home from 'components/pages/Home';
import { withBasePage } from 'ui/hoc/withBasePage';
import { withAdminBasePage } from 'ui/hoc/withAdminBasePage';
import Admin from 'components/pages/Admin';

// route data
export declare type RouteDataType = {
  url: string
  component: React.FunctionComponent
}

export declare type RoutesDataType = {
  [key in UserTypeEnum]?: RouteDataType[]
}

export declare type CommonRoutesDataType = RouteDataType[] 

// for guest and member
export const routesData: RoutesDataType = {
  [UserTypeEnum.GUEST]: [
    {
      url: "/guest",
      component: withBasePage(Guest),
    },
  ],
  [UserTypeEnum.MEMBER]: [
    {
      url: "/member",
      component: withBasePage(Member),
    },
  ],
  [UserTypeEnum.ADMIN]: [
    {
      url: "/admin",
      component: withAdminBasePage(Admin),
    },
  ],
}

export const commonRoutesData: CommonRoutesDataType = [
  {
    url: '/',
    component: withBasePage(Home)
  },
]
