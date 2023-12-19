import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export const getFiles = (options: {
  folder: string
  langs?: string
  fileName?: string
  tag: string
}): string[] => {
  let fileName = options.fileName ?? options.tag

  if (!fileName.includes('.md')) {
    fileName = `${fileName}.md`
  }

  if (!existsSync(options.folder)) {
    mkdirSync(options.folder)
  }

  if (options.langs) {
    const langs = options.langs.split(',')
    const res: string[] = []

    for (const lang of langs) {
      if (!existsSync(join(options.folder, lang))) {
        mkdirSync(join(options.folder, lang))
      }

      res.push(`${join(options.folder, lang, fileName)}`)
    }
  }

  return [`${join(options.folder, fileName)}`]
}
