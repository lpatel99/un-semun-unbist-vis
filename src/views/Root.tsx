import React, { FC, useEffect, useState } from 'react'
import {
  SigmaContainer,
  ZoomControl,
  FullScreenControl
} from '@react-sigma/core'
import { omit, mapValues, keyBy, constant } from 'lodash'
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image'
import GraphSettingsController from './GraphSettingsController'
import GraphEventsController from './GraphEventsController'
import GraphDataController from './GraphDataController'
import DescriptionPanel from './DescriptionPanel'
import { Dataset, FiltersState } from '../types'
import ClustersPanel from './ClustersPanel'
import SearchField from './SearchField'
import drawLabel from '../canvas-utils'
import GraphTitle from './GraphTitle'
import '@react-sigma/core/lib/react-sigma.min.css'
import { GrClose } from 'react-icons/gr'
import { BiBookContent } from 'react-icons/bi'
import LanguagesPanel from './LanguagesPanel'

const Root: FC = () => {
  const [showContents, setShowContents] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    language: 'en'
  })
  // const { positions, assign } = useLayoutForceAtlas2()
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Load data on mount:
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/un_dataset.json`)
      .then(res => res.json())
      .then((dataset: Dataset) => {
        setDataset(dataset)
        setFiltersState({
          clusters: mapValues(keyBy(dataset.clusters, 'key'), constant(true)),
          language: 'en'
        })
        requestAnimationFrame(() => setDataReady(true))
      })
  }, [])

  if (!dataset) return null

  return (
    <div id='app-root' className={showContents ? 'show-contents' : ''}>
      <SigmaContainer
        settings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          labelRenderer: drawLabel,
          defaultNodeType: 'image',
          defaultEdgeType: 'line',
          labelDensity: 0.07,
          labelGridCellSize: 100,
          labelRenderedSizeThreshold: 10,
          labelFont: 'Helvetica Neue, sans-serif',
          zIndex: true
        }}
        className='react-sigma'
      >
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController
          setHoveredNode={setHoveredNode}
          filters={filtersState}
        />
        <GraphDataController dataset={dataset} filters={filtersState} />

        {dataReady && (
          <>
            <div className='controls'>
              <div className='ico'>
                <button
                  type='button'
                  className='show-contents'
                  onClick={() => setShowContents(true)}
                  title='Show caption and description'
                >
                  <BiBookContent />
                </button>
              </div>
              <FullScreenControl className='ico' />
              <ZoomControl className='ico' />
            </div>
            <div className='contents'>
              <div className='ico'>
                <button
                  type='button'
                  className='ico hide-contents'
                  onClick={() => setShowContents(false)}
                  title='Show caption and description'
                >
                  <GrClose />
                </button>
              </div>
              <GraphTitle filters={filtersState} />
              <div className='panels'>
                <SearchField filters={filtersState} />
                <DescriptionPanel filters={filtersState} />
                <ClustersPanel
                  clusters={dataset.clusters}
                  filters={filtersState}
                  initiallyDeployed={true}
                  setClusters={clusters =>
                    setFiltersState(filters => ({
                      ...filters,
                      clusters
                    }))
                  }
                  toggleCluster={cluster => {
                    setFiltersState(filters => ({
                      ...filters,
                      clusters: filters.clusters[cluster]
                        ? omit(filters.clusters, cluster)
                        : { ...filters.clusters, [cluster]: true }
                    }))
                  }}
                />
                <LanguagesPanel
                  filters={filtersState}
                  toggleLanguage={language => {
                    setFiltersState(filters => ({
                      ...filters,
                      language: language
                    }))
                  }}
                />
              </div>
            </div>
          </>
        )}
      </SigmaContainer>
    </div>
  )
}

export default Root
