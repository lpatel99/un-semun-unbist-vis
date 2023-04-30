import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './styles.css'
import ErrorPage from './views/ErrorPage'
import RootWrapper from './views/RootWrapper'

const router = createBrowserRouter([
  {
    path: '/:lang',
    element: <RootWrapper />,
    errorElement: <ErrorPage />
  },
  {
    path: '/',
    element: <RootWrapper />,
    errorElement: <ErrorPage />
  }
])

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('root')
)
