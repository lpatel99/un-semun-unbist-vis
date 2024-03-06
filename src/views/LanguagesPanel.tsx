import { FC } from 'react'
import { MdLanguage } from 'react-icons/md'
import { FiltersState } from '../types'
import {
  languageInstructionIntl,
  languageIntl,
  languagesMapping
} from '../consts'
import Panel from './Panel'
import { Radio, Text, Stack } from '@chakra-ui/react'

const LanguagesPanel: FC<{
  filters: FiltersState
  toggleLanguage: (language: string) => void
}> = ({ filters, toggleLanguage }) => {
  return (
    <Panel
      title={
        <>
          <MdLanguage className='icon' /> {languageIntl[filters.language]}
        </>
      }
    >
      <Text fontStyle='italic' color='gray.500' mb={4} minH={10} mt={4}>
        {languageInstructionIntl[filters.language]}
      </Text>
      <Stack spacing={2} mt={4}>
        {languagesMapping.map(lang => (
          <Radio
            key={lang.key}
            isChecked={filters.language === lang.key}
            onChange={() => toggleLanguage(lang.key)}
            id={`lang-${lang.key}`}
            value={lang.key}
            color='#5b92e5'
            size='lg'
          >
            {lang.label}
          </Radio>
        ))}
      </Stack>
    </Panel>
  )
}

export default LanguagesPanel
