import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { FileItem } from './interface'

export const getFiles = (options: {
  folder: string
  langs?: string
  fileName?: string
  tag: string
}): FileItem[] => {
  let fileName = options.fileName ?? options.tag

  if (!fileName.includes('.md')) {
    fileName = `${fileName}.md`
  }

  if (!existsSync(options.folder)) {
    mkdirSync(options.folder)
  }

  if (options.langs) {
    const langs = options.langs.split(',')
    const res: FileItem[] = []

    for (const lang of langs) {
      if (!existsSync(join(options.folder, lang))) {
        mkdirSync(join(options.folder, lang))
      }

      res.push({
        file: `${join(options.folder, lang, fileName)}`,
        lang,
        tag: options.tag
      })
    }

    return res
  }

  return [{ file: `${join(options.folder, fileName)}`, tag: options.tag }]
}
