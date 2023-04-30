import { useRouteError } from 'react-router-dom'

export default function ErrorPage () {
  const error: any = useRouteError()
  console.error(error)

  return (
    <div id='error-page'>
      <h1>Oops!</h1>
      <p>Sorry, this page doesn't exist.</p>
      <p>
        <i>{error ? error.statusText || error.message : 'Page not found.'}</i>
      </p>
    </div>
  )
}
