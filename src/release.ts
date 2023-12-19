import * as github from '@actions/github'
import * as core from '@actions/core'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import semver from 'semver'

export async function updateOrAppendChanglog(
  files: string[],
  tag: string
): Promise<string[]> {
  const result: string[] = []
  let res: boolean

  for (const file of files) {
    if (existsSync(file)) {
      res = await appendChangelog(file, tag)
    } else {
      res = await initChangelog(file)
    }

    if (res) {
      result.push(file)
    }
  }

  return result
}

function formatReleaseMarkdown(
  releaseMarkdown: string | null | undefined
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

  output = output.replace(/##(\s)+/g, '### ')

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
      ? 1
      : -1
  })

  return filterData
}

async function initChangelog(file: string): Promise<boolean> {
  const githubToken = core.getInput('token')
  const octokit = github.getOctokit(githubToken)
  const { owner, repo } = github.context.repo
  const releases = await octokit.rest.repos.listReleases({ owner, repo })
  const releaseData = sortReleases(releases.data)

  let changelog = ''
  let bodyStr = ''

  for (const release of releaseData) {
    bodyStr = formatReleaseMarkdown(release.body)

    if (bodyStr) {
      changelog += `## ${release.tag_name}\n* Release Time: ${release.published_at}\n\n${bodyStr}\n[more detail about${release.tag_name}](${release.url})\n\n`
    }
  }

  try {
    writeFileSync(file, changelog)
    return true
  } catch (error) {
    core.error(`Error to initialize the file: ${file}
      ${error}
    `)

    return false
  }
}

async function appendChangelog(file: string, tag: string): Promise<boolean> {
  const githubToken = core.getInput('token')
  const octokit = github.getOctokit(githubToken)
  const { owner, repo } = github.context.repo
  const release = await octokit.rest.repos.getReleaseByTag({ owner, repo, tag })

  try {
    const data = readFileSync(file, 'utf8')

    writeFileSync(
      file,
      `## ${release.data.tag_name}\n* Release Time: ${
        release.data.published_at
      }\n\n${formatReleaseMarkdown(release.data.body)}\n[more detail about${
        release.data.tag_name
      }](${release.url})\n\n${data}`
    )

    return true
  } catch (error) {
    core.error(`Error to append changelog to the file: ${file}
      ${error}
    `)

    return false
  }
}
