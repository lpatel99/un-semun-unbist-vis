import { useSigma } from '@react-sigma/core'
import { FC, useEffect, ReactNode } from 'react'

import { drawHover } from '../canvas-utils'
import useDebounce from '../use-debounce'
import { Dataset, FiltersState } from '../types'

const NODE_FADE_COLOR = '#bbb'
const EDGE_FADE_COLOR = '#eee'

const GraphSettingsController: FC<{
  hoveredNode: string | null
  children?: ReactNode
  filters: FiltersState
  dataset: Dataset
}> = ({ children, hoveredNode, filters, dataset }) => {
  const sigma = useSigma()
  const graph = sigma.getGraph()

  console.log(typeof graph)

  // Here we debounce the value to avoid having too much highlights refresh when
  // moving the mouse over the graph:
  const debouncedHoveredNode = useDebounce(hoveredNode, 40)

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    sigma.setSetting('hoverRenderer', (context, data, settings) => {
      // get node by data.key
      // const node = graph.get
      console.log('Hovered node key: ', data.key)
      const hoveredNode = dataset.nodes.find(node => node.key === data.key)!
      const cluster = dataset.clusters.find(
        cluster => cluster.key === hoveredNode.cluster
      )!

      const field = `cluster_label_${filters.language}`
      const clusterLabel = cluster[field] || cluster.cluster_label_en

      return drawHover(
        context,
        { ...sigma.getNodeDisplayData(data.key), ...data },
        settings,
        clusterLabel
      )
      // get the hovered node from the Dataset object:
    })
  }, [sigma, graph, filters.language])

  /**
   * Update node and edge reducers when a node is hovered, to highlight its
   * neighborhood:
   */
  useEffect(() => {
    const hoveredColor: string = debouncedHoveredNode
      ? sigma.getNodeDisplayData(debouncedHoveredNode)!.color
      : ''

    sigma.setSetting(
      'nodeReducer',
      debouncedHoveredNode
        ? (node, data) =>
            node === debouncedHoveredNode ||
            graph.hasEdge(node, debouncedHoveredNode) ||
            graph.hasEdge(debouncedHoveredNode, node)
              ? { ...data, zIndex: 1 }
              : {
                  ...data,
                  zIndex: 0,
                  label: '',
                  color: NODE_FADE_COLOR,
                  image: null,
                  highlighted: false
                }
        : null
    )
    sigma.setSetting(
      'edgeReducer',
      debouncedHoveredNode
        ? (edge, data) =>
            graph.hasExtremity(edge, debouncedHoveredNode)
              ? { ...data, color: hoveredColor, size: 4 }
              : { ...data, color: EDGE_FADE_COLOR, hidden: true }
        : null
    )
  }, [debouncedHoveredNode])

  return <>{children}</>
}

export default GraphSettingsController
