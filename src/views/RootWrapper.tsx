import { FC, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { languages } from '../consts'
import ErrorPage from './ErrorPage'
import Root from './Root'

const RootWrapper: FC<{}> = () => {
  const params = useParams()
  const navigate = useNavigate()

  // If params.lang is not in languages and is not a valid language
  // redirect to error page
  useEffect(() => {
    if (!params.lang) {
      navigate('/en')
    }
  }, [params.lang])

  if (params.lang && !languages.includes(params.lang)) {
    return <ErrorPage />
  } else if (!params.lang) {
    navigate('/en')
    return <Root lang='en' />
  }

  return <Root lang={params.lang} />
}

export default RootWrapper
