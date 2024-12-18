import React from 'react';
import DefaultLayout from '~/layout/DefaultLayout';
import SingleLayout from '~/layout/SingleLayout';
import Login from '~/pages/auth/Login';
import Register from '~/pages/auth/Register';
import Cart from '~/pages/Cart';
import Home from '~/pages/Home';
import ProductDetail from '~/pages/ProductDetail';
import Products from '~/pages/Products';

const routes = [
  {
    path: '/',
    element: <DefaultLayout><Home /></DefaultLayout>,
  },
  {
    path: '/products',
    element: <DefaultLayout><Products /></DefaultLayout>,
  },
  {
    path: '/products/:id',
    element: <DefaultLayout><ProductDetail /></DefaultLayout>,
  },
  {
    path: '/cart',
    element: <DefaultLayout><Cart /></DefaultLayout>,
  },
  {
    path: '/login', 
    element: <SingleLayout><Login /></SingleLayout>,
  },
  {
    path: '/register',
    element: <SingleLayout><Register /></SingleLayout>,
  },
];

export default routes;