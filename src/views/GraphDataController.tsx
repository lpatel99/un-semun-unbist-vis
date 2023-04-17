import { useSigma } from '@react-sigma/core'
import { FC, useEffect, ReactNode } from 'react'
import { keyBy, omit } from 'lodash'
import forceAtlas2 from 'graphology-layout-forceatlas2'
import { Dataset, FiltersState } from '../types'

const GraphDataController: FC<{
  dataset: Dataset
  filters: FiltersState
  children?: ReactNode
}> = ({ dataset, filters, children }) => {
  const sigma = useSigma()
  const graph = sigma.getGraph()

  /**
   * Feed graphology with the new dataset:
   */
  useEffect(() => {
    if (!graph || !dataset) return

    const clusters = keyBy(dataset.clusters, 'key')

    dataset.nodes.forEach(node => {
      // if (node.node_type !== 'subtopic')
      graph.addNode(node.key, {
        ...node,
        ...omit(clusters[node.cluster], 'key')
      })
    })
    dataset.edges.forEach(([source, target]) => {
      // Check if source and targets share the same two first characters
      // (i.e. if they are from the same cluster):
      if (graph.hasNode(source) && graph.hasNode(target)) {
        graph.addEdge(source, target, { size: 1 })
      }
    })

    // Use degrees as node sizes:
    const METATOPIC_NODE_SIZE = 20
    const TOPIC_NODE_SIZE = 5
    const SUBTOPIC_NODE_SIZE = 2

    graph.forEachNode(node => {
      var size = 0
      switch (graph.getNodeAttribute(node, 'node_type')) {
        case 'meta_topic':
          size = METATOPIC_NODE_SIZE
          break
        case 'topic':
          size = TOPIC_NODE_SIZE
          break
        case 'subtopic':
          size = SUBTOPIC_NODE_SIZE
          break

        default:
          size = 2
          break
      }
      graph.setNodeAttribute(node, 'size', size)
    })

    forceAtlas2.assign(graph, {
      iterations: 80,
      settings: {
        gravity: 10,
        barnesHutOptimize: true
      }
    })

    return () => graph.clear()
  }, [graph, dataset])

  /**
   * Apply filters to graphology:
   */
  useEffect(() => {
    const { clusters, tags } = filters
    graph.forEachNode((node, { cluster, tag }) =>
      graph.setNodeAttribute(node, 'hidden', !clusters[cluster] || !tags[tag])
    )
  }, [graph, filters])

  return <>{children}</>
}

export default GraphDataController
