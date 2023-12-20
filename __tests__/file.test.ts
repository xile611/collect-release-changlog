import { getFiles } from '../src/files'
import { rmSync } from 'fs'
import path from 'path'

describe('getFiles() create folders when folders not exist', () => {
  afterEach(() => {
    rmSync(path.join(__dirname, 'changlog'), { recursive: true })
  })

  it('no fileName, only tag', async () => {
    const result = getFiles({
      folder: path.join(__dirname, 'changlog'),
      langs: 'en,zh',
      tag: 'v1.0.0'
    })

    expect(result).toEqual([
      {
        file: path.join(__dirname, 'changlog/en/v1.0.0.md'),
        lang: 'en',
        tag: 'v1.0.0'
      },
      {
        file: path.join(__dirname, 'changlog/zh/v1.0.0.md'),
        lang: 'zh',
        tag: 'v1.0.0'
      }
    ])
  })

  it('has fileName and tag', async () => {
    const result = getFiles({
      folder: path.join(__dirname, 'changlog'),
      langs: 'en,zh',
      fileName: 'changlog',
      tag: 'v1.0.0'
    })

    expect(result).toEqual([
      {
        file: path.join(__dirname, 'changlog/en/changlog.md'),
        lang: 'en',
        tag: 'v1.0.0'
      },
      {
        file: path.join(__dirname, 'changlog/zh/changlog.md'),
        lang: 'zh',
        tag: 'v1.0.0'
      }
    ])
  })

  it('no fileName, no langs, only tag', async () => {
    const result = getFiles({
      folder: path.join(__dirname, 'changlog'),
      tag: 'v1.0.0'
    })

    expect(result).toEqual([
      {
        file: path.join(__dirname, 'changlog/v1.0.0.md'),
        tag: 'v1.0.0'
      }
    ])
  })

  it('no langs, has fileName and tag', async () => {
    const result = getFiles({
      folder: path.join(__dirname, 'changlog'),
      fileName: 'changlog',
      tag: 'v1.0.0'
    })

    expect(result).toEqual([
      {
        file: path.join(__dirname, 'changlog/changlog.md'),
        tag: 'v1.0.0'
      }
    ])
  })
})
