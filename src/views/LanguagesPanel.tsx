import React, { FC, useEffect, useMemo, useState } from 'react'
import { useSigma } from '@react-sigma/core'
import { MdLanguage } from 'react-icons/md'

import { FiltersState } from '../types'
import { languages } from '../consts'
import Panel from './Panel'

const LanguagesPanel: FC<{
  filters: FiltersState
  toggleLanguage: (language: string) => void
  setLanguage: (language: string) => void
}> = ({ filters, toggleLanguage, setLanguage }) => {
  const sigma = useSigma()
  const graph = sigma.getGraph()

  const [activeLanguage, setActiveLanguage] = useState<string>('en')
  // useEffect(() => {
  //   // To ensure the graphology instance has up to data "hidden" values for
  //   // nodes, we wait for next frame before reindexing. This won't matter in the
  //   // UX, because of the visible nodes bar width transition.
  //   requestAnimationFrame(() => {
  //     const index: Record<string, number> = {}
  //     graph.forEachNode(
  //       (_, { lang, hidden }) =>
  //         !hidden && (index[lang] = (index[lang] || 0) + 1)
  //     )
  //     setVisibleNodesPerCluster(index)
  //   })
  // }, [filters])

  return (
    <Panel
      title={
        <>
          <MdLanguage className='text-muted' /> Languages
        </>
      }
    >
      <p>
        <i className='text-muted'>
          Click a language to update the displayed language.
        </i>
      </p>
      <p className='buttons'></p>
      <ul>
        {languages.map(lang => {
          return (
            <li className='caption-row' key={lang.key} title={lang['label']}>
              <input
                type='checkbox'
                checked={filters.language === lang.key}
                onChange={() => toggleLanguage(lang.key)}
                id={`lang-${lang.key}`}
              />
              <label htmlFor={`lang-${lang.key}`}>
                <span
                  className='circle'
                  style={{
                    background: '#5b92e5',
                    borderColor: '#5b92e5'
                  }}
                />{' '}
                <div className='node-label-2'>
                  <span>{lang.label}</span>
                </div>
              </label>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export default LanguagesPanel
