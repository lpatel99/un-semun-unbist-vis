import { useRegisterEvents, useSigma } from '@react-sigma/core'
import { FC, useEffect, ReactNode, useState } from 'react'
import { FiltersState } from '../types'
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
  Box
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

function getMouseLayer () {
  return document.querySelector('.sigma-mouse')
}

const GraphEventsController: FC<{
  setHoveredNode: (node: string | null) => void
  filters: FiltersState
  children?: ReactNode
}> = ({ setHoveredNode, filters, children }) => {
  const sigma = useSigma()
  const graph = sigma.getGraph()
  const registerEvents = useRegisterEvents()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedNodeText, setSelectedNodeText] = useState<string | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<{
    left: number
    top: number
  }>({ left: 0, top: 0 })

  useEffect(() => {
    registerEvents({
      clickNode ({ node, event }) {
        if (!graph.getNodeAttribute(node, 'hidden')) {
          setSelectedNode(node)
          setSelectedNodeText(graph.getNodeAttribute(node, 'label'))
          setPopoverPosition({ left: event.x, top: event.y })
        }
      },
      enterNode ({ node }) {
        setHoveredNode(node)
        const mouseLayer = getMouseLayer()
        if (mouseLayer) mouseLayer.classList.add('mouse-pointer')
      },
      leaveNode () {
        setHoveredNode(null)
        const mouseLayer = getMouseLayer()
        if (mouseLayer) mouseLayer.classList.remove('mouse-pointer')
      }
    })
  }, [filters.language])

  const handleOptionClick = (option: string) => {
    console.log(`Option clicked: ${option}`)
    setSelectedNode(null)
  }

  return (
    <>
      {children}
      {selectedNode && (
        <Popover
          isOpen={true}
          onClose={() => setSelectedNode(null)}
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
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{selectedNodeText}</PopoverHeader>
              <PopoverBody>
                {/* Replace these buttons with your desired options */}
                <Box mb={2}>
                  <Button
                    onClick={() => handleOptionClick('Option 1')}
                    colorScheme='blue'
                    rightIcon={<ExternalLinkIcon />}
                    variant='outline'
                  >
                    See in UNBIS Thesaurus
                  </Button>
                </Box>
                <Button
                  onClick={() => handleOptionClick('Option 2')}
                  colorScheme='blue'
                  rightIcon={<ExternalLinkIcon />}
                >
                  Find related documents
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      )}
    </>
  )
}

export default GraphEventsController
