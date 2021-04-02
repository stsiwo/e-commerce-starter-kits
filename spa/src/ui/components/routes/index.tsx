import Account from 'components/pages/Account';
import Admin from 'components/pages/Admin';
import AdminLogin from 'components/pages/Admin/AdminLogin';
import Guest from 'components/pages/Guest';
import Home from 'components/pages/Home';
import ProductSearch from 'components/pages/ProductSearch';
import * as React from 'react';
import { UserTypeEnum } from 'src/app';
import { withAdminBasePage } from 'ui/hoc/withAdminBasePage';
import { withBasePage } from 'ui/hoc/withBasePage';

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
  // define guest only page
  [UserTypeEnum.GUEST]: [
    {
      url: "/guest",
      component: withBasePage(Guest),
    },
  ],
  // define member only page
  [UserTypeEnum.MEMBER]: [
    {
      url: "/account",
      component: withBasePage(Account),
    },
  ],
  // define admin only page
  [UserTypeEnum.ADMIN]: [
    {
      url: "/admin",
      component: withAdminBasePage(Admin),
    },
    {
      url: "/admin/login",
      component: AdminLogin,
    },
  ],
}

export const commonRoutesData: CommonRoutesDataType = [
  // define common only page
  {
    url: '/',
    component: withBasePage(Home)
  },
  {
    url: '/search',
    component: withBasePage(ProductSearch)
  },
]
