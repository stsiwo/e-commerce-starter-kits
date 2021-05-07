import Account from 'components/pages/Account';
import Admin from 'components/pages/Admin';
import AdminAccount from 'components/pages/Admin/AdminAccount';
import AdminCategory from 'components/pages/Admin/AdminCategory';
import AdminCustomer from 'components/pages/Admin/AdminCustomer';
import AdminLogin from 'components/pages/Admin/AdminLogin';
import AdminOrder from 'components/pages/Admin/AdminOrder';
import AdminProduct from 'components/pages/Admin/AdminProduct';
import AdminProductVariant from 'components/pages/Admin/AdminProductVariant';
import AdminReview from 'components/pages/Admin/AdminReview';
import Checkout from 'components/pages/Checkout';
import Guest from 'components/pages/Guest';
import Home from 'components/pages/Home';
import Login from 'components/pages/Login';
import Product from 'components/pages/Product';
import ProductSearch from 'components/pages/ProductSearch';
import Signup from 'components/pages/Signup';
import Wishlist from 'components/pages/Wishlist';
import * as React from 'react';
import { UserTypeEnum } from 'src/app';
import { withAdminBasePage } from 'ui/hoc/withAdminBasePage';
import { withBasePage } from 'ui/hoc/withBasePage';
import Contact from 'components/pages/Contact';

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
    {
      url: "/login",
      component: withBasePage(Login),
    },
    {
      url: "/signup",
      component: withBasePage(Signup),
    },
  ],
  // define member only page
  [UserTypeEnum.MEMBER]: [
    {
      url: "/account",
      component: withBasePage(Account),
    },
    {
      url: "/wishlist",
      component: withBasePage(Wishlist),
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
    {
      url: "/admin/account",
      component: withAdminBasePage(AdminAccount),
    },
    {
      url: "/admin/products",
      component: withAdminBasePage(AdminProduct),
    },
    {
      url: "/admin/product-variants",
      component: withAdminBasePage(AdminProductVariant),
    },
    {
      url: "/admin/categories",
      component: withAdminBasePage(AdminCategory),
    },
    {
      url: "/admin/orders",
      component: withAdminBasePage(AdminOrder),
    },
    {
      url: "/admin/reviews",
      component: withAdminBasePage(AdminReview),
    },
    {
      url: "/admin/customers",
      component: withAdminBasePage(AdminCustomer),
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
  {
    url: '/products/:productPath',
    component: withBasePage(Product)
  },
  {
    url: '/checkout',
    component: withBasePage(Checkout)
  },
  {
    url: '/contact',
    component: withBasePage(Contact)
  },
]
