import { getLocaleByKey } from './locales'

const types = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'chore',
  'revert',
  'other'
]
export const getCommitType = (text: string, lang?: string): string => {
  for (const type of types) {
    if (text.includes(type)) {
      return text.replace(type, getLocaleByKey(type, lang))
    }
  }

  return text
}
