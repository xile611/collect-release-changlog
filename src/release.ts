import * as github from '@actions/github'
import * as core from '@actions/core'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import semver from 'semver'
import { FileItem } from './interface'
import { getLocaleByKey } from './locales'

export async function updateOrAppendChanglog(
  files: FileItem[]
): Promise<string[]> {
  const result: string[] = []
  let res: boolean

  for (const file of files) {
    if (existsSync(file.file)) {
      res = await appendChangelog(file)
    } else {
      res = await initChangelog(file)
    }

    if (res) {
      result.push(file.file)
    }
  }

  return result
}

function formatReleaseMarkdown(
  releaseMarkdown: string | null | undefined,
  lang?: string
): string {
  if (!releaseMarkdown) {
    return ''
  }

  let output = releaseMarkdown

  const changedPrIndex = releaseMarkdown.indexOf(`## What's Changed`)

  if (changedPrIndex > 0) {
    output = releaseMarkdown.slice(0, changedPrIndex)
  } else {
    const newContributorsIndex = releaseMarkdown.indexOf(`## New Contributors`)

    if (newContributorsIndex > 0) {
      output = releaseMarkdown.slice(0, newContributorsIndex)
    }
  }

  // 处理标题
  output = output.replaceAll(/^##\s(.+)$/gm, (match, title) => {
    return `**${getLocaleByKey(title.trim(), lang)}**`
  })

  // 处理 issue
  const { owner, repo } = github.context.repo
  const url = `https://github.com/${owner}/${repo}`

  output = output.replaceAll(/#(\d+)/gm, (match, no) => {
    return `[${match}](${url}/issues/${no})`
  })

  output = output.replaceAll(/(\n{2,})/g, '\n\n')

  return output
}

function sortReleases<T extends { tag_name: string }>(data: T[]): T[] {
  if (!data || !data.length) {
    return [] as T[]
  }

  const filterData = data.filter(entry =>
    semver.valid(entry.tag_name.replace('v', ''))
  )

  filterData.sort((a: T, b: T) => {
    return semver.gt(a.tag_name.replace('v', ''), b.tag_name.replace('v', ''))
      ? -1
      : 1
  })

  return filterData
}

async function initChangelog(file: FileItem): Promise<boolean> {
  const githubToken = core.getInput('token')
  const octokit = github.getOctokit(githubToken)
  const { owner, repo } = github.context.repo
  const releases = await octokit.rest.repos.listReleases({ owner, repo })
  const releaseData = sortReleases(releases.data)

  let changelog = ''
  let bodyStr = ''

  for (const release of releaseData) {
    bodyStr = formatReleaseMarkdown(release.body, file.lang)

    if (bodyStr) {
      changelog += `# ${release.tag_name}\n\n${release.published_at?.slice(
        0,
        10
      )}\n\n${bodyStr}\n\n[${getLocaleByKey('more_detail_about', file.lang)} ${
        release.tag_name
      }](${release.html_url})\n\n`
    }
  }

  try {
    writeFileSync(file.file, changelog)
    return true
  } catch (error) {
    core.error(`Error to initialize the file: ${file.file}
      ${error}
    `)

    return false
  }
}

async function appendChangelog(file: FileItem): Promise<boolean> {
  const githubToken = core.getInput('token')
  const octokit = github.getOctokit(githubToken)
  const { owner, repo } = github.context.repo
  const release = await octokit.rest.repos.getReleaseByTag({
    owner,
    repo,
    tag: file.tag
  })

  try {
    const data = readFileSync(file.file, 'utf8')

    writeFileSync(
      file.file,
      `# ${release.data.tag_name}\n\n${release.data.published_at?.slice(
        0,
        10
      )}\n\n${formatReleaseMarkdown(
        release.data.body,
        file.lang
      )}\n\n[${getLocaleByKey('more_detail_about', file.lang)} ${
        release.data.tag_name
      }](${release.data.html_url})\n\n${data}`
    )

    return true
  } catch (error) {
    core.error(`Error to append changelog to the file: ${file.file}
      ${error}
    `)

    return false
  }
}
