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
      graph.addNode(node.key, {
        ...node,
        ...omit(clusters[node.cluster], 'key')
      })
    })
    dataset.edges.forEach(([source, target]) => {
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
      iterations: 100,
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
    const { clusters } = filters
    graph.forEachNode((node, { cluster }) =>
      graph.setNodeAttribute(node, 'hidden', !clusters[cluster])
    )
  }, [graph, filters])

  useEffect(() => {
    var language_field = ''
    switch (filters.language) {
      case 'en':
        language_field = 'label_en'
        break
      case 'fr':
        language_field = 'label_fr'
        break
      case 'es':
        language_field = 'label_es'
        break
      case 'ar':
        language_field = 'label_ar'
        break
      case 'ru':
        language_field = 'label_ru'
        break
      case 'zh':
        language_field = 'label_zh'
        break
      default:
        language_field = 'label_en'
        break
    }

    graph.forEachNode(node => {
      return graph.setNodeAttribute(
        node,
        'label',
        graph.getNodeAttribute(node, language_field)
      )
    })
  }, [graph, filters.language])

  return <>{children}</>
}

export default GraphDataController
