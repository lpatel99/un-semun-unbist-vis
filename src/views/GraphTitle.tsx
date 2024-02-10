import React, { FC, useEffect, useState } from 'react'
import { useSigma } from '@react-sigma/core'

import { FiltersState } from '../types'

function prettyPercentage (val: number): string {
  return (val * 100).toFixed(1) + '%'
}

function informationString (
  nbNodes: number,
  nbEdges: number,
  visibleNodes: number,
  visibleEdges: number
): string {
  var s = `${nbNodes.toLocaleString('en-US', {
    maximumFractionDigits: 0
  })} node${nbNodes > 1 ? 's' : ''}`

  s += ` ${
    visibleNodes !== nbNodes
      ? ` (only ${prettyPercentage(visibleNodes / nbNodes)} visible) `
      : ''
  }`

  s += `• ${nbEdges.toLocaleString('en-US', {
    maximumFractionDigits: 0
  })} edge${nbEdges > 1 ? 's' : ''}`
  s += ` ${
    visibleEdges !== nbEdges
      ? ` (only ${prettyPercentage(visibleEdges / nbEdges)} visible)`
      : ''
  }`

  return s
}

const GraphTitle: FC<{ filters: FiltersState }> = ({ filters }) => {
  const sigma = useSigma()
  const graph = sigma.getGraph()

  const [visibleItems, setVisibleItems] = useState<{
    nodes: number
    edges: number
  }>({ nodes: 0, edges: 0 })
  useEffect(() => {
    // To ensure the graphology instance has up to data "hidden" values for
    // nodes, we wait for next frame before reindexing. This won't matter in the
    // UX, because of the visible nodes bar width transition.
    requestAnimationFrame(() => {
      const index = { nodes: 0, edges: 0 }
      graph.forEachNode((_, { hidden }) => !hidden && index.nodes++)
      graph.forEachEdge(
        (_, _2, _3, _4, source, target) =>
          !source.hidden && !target.hidden && index.edges++
      )
      setVisibleItems(index)
    })
  }, [filters])

  return (
    <div className='graph-title'>
      <div className='graph-title-text'>
        <h1>United Nations UNBIS Thesaurus – Network Visualization</h1>
        <h2>
          <i>
            {informationString(
              graph.order,
              graph.size,
              visibleItems.nodes,
              visibleItems.edges
            )}
            {/* {graph.order.toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
          node{graph.order > 1 ? 's' : ''}{' '}
          {visibleItems.nodes !== graph.order
            ? ` (only ${prettyPercentage(
                visibleItems.nodes / graph.order
              )} visible)`
            : ''}
          {graph.size.toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
          edge
          {graph.size > 1 ? 's' : ''}{' '}
          {visibleItems.edges !== graph.size
            ? ` (only ${prettyPercentage(
                visibleItems.edges / graph.size
              )} visible)`
            : ''} */}
          </i>
        </h2>
      </div>
    </div>
  )
}

export default GraphTitle
