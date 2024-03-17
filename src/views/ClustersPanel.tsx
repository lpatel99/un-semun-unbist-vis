import React, { FC, useEffect, useMemo, useState } from 'react'
import { useSigma } from '@react-sigma/core'
import { sortBy, values, keyBy, mapValues } from 'lodash'
import { MdGroupWork } from 'react-icons/md'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'

import { Cluster, FiltersState } from '../types'
import Panel from './Panel'
import {
  checkAllIntl,
  clusterInstructionIntl,
  clusterIntl as clustersIntl,
  uncheckAllIntl
} from '../consts'
import { Button, Text } from '@chakra-ui/react'

const ClustersPanel: FC<{
  clusters: Cluster[]
  filters: FiltersState
  initiallyDeployed: boolean
  toggleCluster: (cluster: string) => void
  setClusters: (clusters: Record<string, boolean>) => void
}> = ({ clusters, filters, initiallyDeployed, toggleCluster, setClusters }) => {
  const sigma = useSigma()
  const graph = sigma.getGraph()

  const nodesPerCluster = useMemo(() => {
    const index: Record<string, number> = {}
    graph.forEachNode(
      (_, { cluster }) => (index[cluster] = (index[cluster] || 0) + 1)
    )
    return index
  }, [])

  const maxNodesPerCluster = useMemo(
    () => Math.max(...values(nodesPerCluster)),
    [nodesPerCluster]
  )
  const visibleClustersCount = useMemo(
    () => Object.keys(filters.clusters).length,
    [filters]
  )

  const [visibleNodesPerCluster, setVisibleNodesPerCluster] =
    useState<Record<string, number>>(nodesPerCluster)
  useEffect(() => {
    // To ensure the graphology instance has sup to data "hidden" values for
    // nodes, we wait for next frame before reindexing. This won't matter in the
    // UX, because of the visible nodes bar width transition.
    requestAnimationFrame(() => {
      const index: Record<string, number> = {}
      graph.forEachNode(
        (_, { cluster, hidden }) =>
          !hidden && (index[cluster] = (index[cluster] || 0) + 1)
      )
      setVisibleNodesPerCluster(index)
    })
  }, [filters])

  const sortedClusters = useMemo(
    () => sortBy(clusters, cluster => -nodesPerCluster[cluster.key]),
    [clusters, nodesPerCluster]
  )

  return (
    <Panel
      initiallyDeployed={initiallyDeployed}
      title={
        <>
          <MdGroupWork className='icon' /> {clustersIntl[filters.language]}
          {visibleClustersCount < clusters.length ? (
            <span className='text-muted text-small'>
              {' '}
              ({visibleClustersCount} / {clusters.length})
            </span>
          ) : (
            ''
          )}
        </>
      }
    >
      <Text fontStyle='italic' color='gray.500' mb={4} minH={10} mt={4}>
        {clusterInstructionIntl[filters.language]}
      </Text>
      <p className='buttons'>
        <Button
          onClick={() =>
            setClusters(mapValues(keyBy(clusters, 'key'), () => true))
          }
          leftIcon={<AiOutlineCheckCircle />}
          mb={4}
          borderRadius='20px'
          colorScheme='blue'
          variant={
            clusters.length !== visibleClustersCount ? 'outline' : 'solid'
          }
        >
          <Text>{checkAllIntl[filters.language]}</Text>
        </Button>{' '}
        <Button
          onClick={() => setClusters({})}
          leftIcon={<AiOutlineCloseCircle />}
          mb={4}
          borderRadius='20px'
          colorScheme='blue'
          variant={
            clusters.length === visibleClustersCount ? 'outline' : 'solid'
          }
        >
          <Text>{uncheckAllIntl[filters.language]}</Text>
        </Button>
      </p>
      <ul>
        {sortedClusters.map(cluster => {
          const nodesCount = nodesPerCluster[cluster.key]
          const visibleNodesCount = visibleNodesPerCluster[cluster.key] || 0
          var label = ''

          switch (filters.language) {
            case 'en':
              label = cluster.cluster_label_en
              break
            case 'ar':
              label = cluster.cluster_label_ar
              break
            case 'es':
              label = cluster.cluster_label_es
              break
            case 'fr':
              label = cluster.cluster_label_fr
              break
            case 'ru':
              label = cluster.cluster_label_ru
              break
            case 'zh':
              label = cluster.cluster_label_zh
              break
            default:
              label = cluster.cluster_label_en
              break
          }

          return (
            <li
              className='caption-row'
              key={cluster.key}
              title={`${nodesCount} page${nodesCount > 1 ? 's' : ''}${
                visibleNodesCount !== nodesCount
                  ? ` (only ${visibleNodesCount} visible)`
                  : ''
              }`}
            >
              <input
                type='checkbox'
                checked={filters.clusters[cluster.key] || false}
                onChange={() => toggleCluster(cluster.key)}
                id={`cluster-${cluster.key}`}
              />
              <label htmlFor={`cluster-${cluster.key}`}>
                <span
                  className='circle'
                  style={{
                    background: cluster.color,
                    borderColor: cluster.color
                  }}
                />{' '}
                <div className='node-label'>
                  <span>{label}</span>
                  <div
                    className='bar'
                    style={{
                      width: (100 * nodesCount) / maxNodesPerCluster + '%'
                    }}
                  >
                    <div
                      className='inside-bar'
                      style={{
                        width: (100 * visibleNodesCount) / nodesCount + '%'
                      }}
                    />
                  </div>
                </div>
              </label>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export default ClustersPanel
