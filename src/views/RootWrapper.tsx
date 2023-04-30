import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { languages } from '../consts'
import ErrorPage from './ErrorPage'
import Root from './Root'

const RootWrapper: FC<{}> = () => {
  const params = useParams()

  // If params.lang is not in languages, redirect to /en
  if (params.lang && !languages.includes(params.lang)) {
    return <ErrorPage />
  }

  return <Root />
}

export default RootWrapper
