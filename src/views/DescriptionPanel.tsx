import { FC } from 'react'
import { BsGithub, BsInfoCircle } from 'react-icons/bs'

import Panel from './Panel'
import { FiltersState } from '../types'
import { descriptionIntl } from '../consts'

const DescriptionPanel: FC<{
  filters: FiltersState
  initiallyDeployed: boolean
}> = ({ filters, initiallyDeployed }) => {
  return (
    <Panel
      initiallyDeployed={initiallyDeployed}
      title={
        <>
          <BsInfoCircle className='icon' /> {descriptionIntl[filters.language]}
        </>
      }
    >
      <p>
        This map represents a <i>network</i> of all{' '}
        <a
          target='_blank'
          rel='noreferrer'
          href='https://metadata.un.org/thesaurus/about?lang=en'
        >
          UNBIS Thesaurus
        </a>{' '}
        subjects. Each <i>node</i> represents a subject, and each edges link
        between subjects. The size of the node is proportional to its level in
        Thesaurus hierarchy. Finally, a click on a node will get you to its
        Thesaurus entry.
      </p>
      <p>
        For the current iteration, the data was scraped from Thesaurus website (
        <a
          target='_blank'
          rel='noreferrer'
          href='https://github.com/ClementSicard/un-unbis-thesaurus-scraper'
        >
          code here <BsGithub />
        </a>
        )
      </p>
      <p>
        This web application has been developed by{' '}
        <a
          target='_blank'
          rel='noreferrer'
          href='https://github.com/ClementSicard'
        >
          Clément Sicard
        </a>
        , using{' '}
        <a target='_blank' rel='noreferrer' href='https://reactjs.org/'>
          react
        </a>{' '}
        and{' '}
        <a
          target='_blank'
          rel='noreferrer'
          href='https://sim51.github.io/react-sigma/'
        >
          @react-sigma
        </a>
        . You can read the source code{' '}
        <a
          target='_blank'
          rel='noreferrer'
          href='https://github.com/ClementSicard/un-unbist-graph-ui'
        >
          on GitHub <BsGithub />
        </a>
        .
      </p>
      <p>
        This demo is not meant to be a final product, but rather a proof of
        concept around a graph/network visualization. In the future, the results
        of the search will be documents, displayed in the graph as nodes, and
        edges will link documents to other documents, subjects, member states,
        etc.
      </p>
      <p>
        It is also multilingual, and the language can be changed in the bottom
        "Language" panel.
      </p>
      <p>This project is the fruit of a collaboration between:</p>
      {/* display public/images/eth-css.png in a row, with both having the same width*/}
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <a href='https://www.css.ethz.ch/' target='_blank' rel='noreferrer'>
          <img
            src={`${process.env.PUBLIC_URL}/images/eth-css.png`}
            alt='ETH Zurich CSS'
            style={{ width: '100%' }}
          />
        </a>
        <a
          href={`https://digitallibrary.un.org/?ln=${filters.language}`}
          target='_blank'
          rel='noreferrer'
        >
          <img
            src={'https://digitallibrary.un.org/img/main_logo_en.png'}
            alt='UN Digital Library'
            style={{ width: '80%' }}
          />
        </a>
      </span>
    </Panel>
  )
}

export default DescriptionPanel
