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
      <Text mt={2}>
        This app shows a network representation of the{' '}
        <Link
          href='https://metadata.un.org/thesaurus/about?lang=en'
          target='_blank'
          rel='noopener noreferrer'
        >
          UNBIS Thesaurus
        </Link>
        . Each <i>node</i> represents a subject, while <i>edges</i> represent
        links between subjects. The size of a given node corresponds to its
        level in the Thesaurus hierarchy. Click on a node to see its Thesaurus
        entry and to find related documents. This app is multilingual and the
        language can be changed in the panel above.
      </Text>
      <Divider my={2} />

      <Text>
        This web application has been realised by{' '}
        <Link href='https://github.com/ClementSicard' isExternal>
          Clément Sicard <ExternalLinkIcon mx='2px' />
        </Link>
        , using React and{' '}
        <Link href='https://sim51.github.io/react-sigma/' isExternal>
          @react-sigma <ExternalLinkIcon mx='2px' />
        </Link>
        source code{' '}
        <Link
          href='https://github.com/ClementSicard/un-unbist-graph-ui'
          isExternal
        >
          here <ExternalLinkIcon mx='2px' />
        </Link>
        . The underlying data is currently being scraped from the UNBIS
        Thesaurus website (scraper code{' '}
        <Link
          href='https://github.com/ClementSicard/un-unbis-thesaurus-scraper'
          isExternal
        >
          here <ExternalLinkIcon mx='2px' />
        </Link>
        ).
        <Divider my={2} />
        Note that the app is not meant to be a final product, but rather a proof
        of concept. Future iterations could enrich the graph with other types of
        nodes, such as documents and different real-world entities.
      </Text>
      <Divider my={4} />
      <Text>
        This project has been made possible by a collaboration between:
      </Text>

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
