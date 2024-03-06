import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './styles.css'
import ErrorPage from './views/ErrorPage'
import RootWrapper from './views/RootWrapper'
import { ChakraProvider } from '@chakra-ui/react'

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

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
)
