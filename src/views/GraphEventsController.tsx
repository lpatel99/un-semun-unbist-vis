import { useRegisterEvents, useSigma } from '@react-sigma/core'
import { FC, useEffect, ReactNode, useState } from 'react'
import { Dataset, FiltersState } from '../types'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Button,
  Portal,
  PopoverHeader,
  Box,
  Flex,
  Text,
  Highlight,
  Divider
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  thesaurusUrl,
  undlUrl,
  findRelatedIntl,
  seeInThesaurusIntl
} from '../consts'

function getMouseLayer () {
  return document.querySelector('.sigma-mouse')
}

const GraphEventsController: FC<{
  setHoveredNode: (node: string | null) => void
  filters: FiltersState
  children?: ReactNode
  dataset: Dataset
}> = ({ setHoveredNode, filters, children, dataset }) => {
  const sigma = useSigma()
  const graph = sigma.getGraph()
  const registerEvents = useRegisterEvents()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<{
    left: number
    top: number
  }>({ left: 0, top: 0 })
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

  useEffect(() => {
    registerEvents({
      clickNode ({ node, event }) {
        if (!graph.getNodeAttribute(node, 'hidden')) {
          setSelectedNode(node)
          setHoveredNode(node)
          setPopoverPosition({ left: event.x, top: event.y })
        }
      },
      enterNode ({ node }) {
        if (!popoverOpen) {
          setHoveredNode(node)
        }
        const mouseLayer = getMouseLayer()
        if (mouseLayer) mouseLayer.classList.add('mouse-pointer')
      },
      leaveNode () {
        // If selectedNode is null, then we are not hovering any node
        if (!popoverOpen) {
          setHoveredNode(null)
        }
        const mouseLayer = getMouseLayer()
        if (mouseLayer) mouseLayer.classList.remove('mouse-pointer')
      }
    })
  }, [filters.language])

  const openThesaurusEntry = (node: string) => {
    const url = thesaurusUrl + node + `?lang=${filters.language}`
    console.log(`url: ${url}`)

    window.open(url, '_blank')
  }

  const openDLSearchResults = (node: string) => {
    console.log(`Opening UNBIS Thesaurus entry for: ${node}`)
    const label = graph.getNodeAttribute(node, 'label_en')
    console.warn(label)
    // Formatted is the joint list of words joint by "+" and put full caps
    const formattedLabel = label.split(' ').join('+').toUpperCase()
    console.error(`Formatted label: ${formattedLabel}`)
    const url = `${undlUrl}?ln=${filters.language}&p=subjectheading:[${formattedLabel}]`

    window.open(url, '_blank')
  }

  function popoverContent (node: string) {
    const label = graph.getNodeAttribute(node, 'label')

    const cluster = dataset.clusters.find(
      cluster => cluster.key === graph.getNodeAttribute(node, 'cluster')
    )!
    const clusterLabelField = `cluster_label_${filters.language}`
    const clusterLabel = cluster[clusterLabelField] || cluster.cluster_label_en
    const clusterColor = graph.getNodeAttribute(node, 'color')

    return (
      <>
        <PopoverContent minW={400}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Box>
              <b>{label}</b>
              <Divider mt={2} mb={2} />
              <Highlight
                query={clusterLabel}
                styles={{
                  px: '2',
                  py: '1',
                  rounded: 'full',
                  bg: clusterColor
                }}
              >
                {clusterLabel}
              </Highlight>
            </Box>
          </PopoverHeader>
          <PopoverBody>
            {/* Replace these buttons with your desired options */}
            <Box mb={2}>
              <Button
                onClick={() => openThesaurusEntry(node)}
                colorScheme='blue'
                rightIcon={<ExternalLinkIcon />}
                variant='outline'
              >
                <Text>{seeInThesaurusIntl[filters.language]}</Text>
              </Button>
            </Box>
            <Flex>
              <Button
                onClick={() => openDLSearchResults(node)}
                colorScheme='blue'
                rightIcon={<ExternalLinkIcon />}
              >
                <Text>{findRelatedIntl[filters.language]}</Text>
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </>
    )
  }

  return (
    <>
      {children}
      {selectedNode && (
        <Popover
          isOpen={true}
          onClose={() => {
            setSelectedNode(null)
            setHoveredNode(null)
            setPopoverOpen(false)
          }}
          onOpen={() => {
            setHoveredNode(selectedNode)
            setPopoverOpen(true)
          }}
          placement='top'
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <div
              style={{
                position: 'absolute',
                left: popoverPosition.left,
                top: popoverPosition.top
              }}
            >
              {/* Invisible trigger */}
            </div>
          </PopoverTrigger>
          <Portal>{popoverContent(selectedNode)}</Portal>
        </Popover>
      )}
    </>
  )
}

export default GraphEventsController
