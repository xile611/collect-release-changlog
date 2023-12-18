import { join } from 'path'

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

  if (options.langs) {
    const langs = options.langs.split(',')
    const res: string[] = []

    for (const lang of langs) {
      res.push(`${join(options.folder, lang, fileName)}`)
    }
  }

  return [`${join(options.folder, fileName)}`]
}
