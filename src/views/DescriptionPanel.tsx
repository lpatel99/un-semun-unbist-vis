import { FC } from 'react'
import { BsInfoCircle } from 'react-icons/bs'
import { Divider, Link, Text, Flex } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import Panel from './Panel'
import { FiltersState } from '../types'
import { informationIntl } from '../consts'

const DescriptionPanel: FC<{
  filters: FiltersState
  initiallyDeployed: boolean
}> = ({ filters, initiallyDeployed }) => {
  return (
    <Panel
      initiallyDeployed={initiallyDeployed}
      title={
        <>
          <BsInfoCircle className='icon' /> {informationIntl[filters.language]}
        </>
      }
    >
      <Text>
        This map represents a <i>network</i> of all{' '}
        <Link
          href='https://metadata.un.org/thesaurus/about?lang=en'
          target='_blank'
          rel='noopener noreferrer'
        >
          UNBIS Thesaurus
        </Link>{' '}
        subjects. Each <i>node</i> represents a subject, and each edge links
        between subjects. The size of the node is proportional to its level in
        Thesaurus hierarchy. Finally, a click on a node will take you to its
        Thesaurus entry.
      </Text>
      <Divider my={2} />
      <Text>
        For the current iteration, the data was scraped from the Thesaurus
        website (
        <Link
          href='https://github.com/ClementSicard/un-unbis-thesaurus-scraper'
          isExternal
        >
          code here
          <ExternalLinkIcon mx='2px' />
        </Link>
        )
      </Text>
      <Text>
        This web application has been developed by{' '}
        <Link href='https://clementsicard.ch' isExternal>
          Clément Sicard <ExternalLinkIcon mx='2px' />
        </Link>
        , using{' '}
        <Link href='https://reactjs.org/' isExternal>
          React <ExternalLinkIcon mx='2px' />
        </Link>{' '}
        and{' '}
        <Link href='https://sim51.github.io/react-sigma/' isExternal>
          @react-sigma <ExternalLinkIcon mx='2px' />
        </Link>
        . You can read the source code{' '}
        <Link
          href='https://github.com/ClementSicard/un-unbist-graph-ui'
          isExternal
        >
          on GitHub <ExternalLinkIcon mx='2px' />
        </Link>
        .
      </Text>
      <Text>
        This demo is not meant to be a final product, but rather a proof of
        concept around a graph/network visualization. In the future, the results
        of the search will be documents, displayed in the graph as nodes, and
        edges will link documents to other documents, subjects, member states,
        etc.
      </Text>
      <Text>
        It is also multilingual, and the language can be changed in the bottom
        "Language" panel.
      </Text>
      <Divider my={4} />
      <Text>This project is the fruit of a collaboration between:</Text>

      {/* Display images in a row */}
      <Flex justify='space-between' align='center' mt={2}>
        <Link
          href={`https://digitallibrary.un.org/?ln=${filters.language}`}
          isExternal
        >
          <img
            src={'https://digitallibrary.un.org/img/main_logo_en.png'}
            alt='UN Digital Library'
            style={{ width: '80%' }}
          />
        </Link>
        <Link href='https://www.css.ethz.ch/' isExternal>
          <img
            src={`${process.env.PUBLIC_URL}/images/eth-css.png`}
            alt='ETH Zurich CSS'
            style={{ width: '100%' }}
          />
        </Link>
      </Flex>
    </Panel>
  )
}

export default DescriptionPanel
