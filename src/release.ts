import * as github from '@actions/github'
import * as core from '@actions/core'
import { writeFileSync, readFileSync, existsSync } from 'fs'

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

async function initChangelog(file: string): Promise<boolean> {
  const githubToken = core.getInput('token')
  const octokit = github.getOctokit(githubToken)
  const { owner, repo } = github.context.repo
  const releases = await octokit.rest.repos.listReleases({ owner, repo })

  let changelog = ''

  for (const release of releases.data) {
    changelog += `## ${release.tag_name}\n${release.body}\n\n`
  }

  try {
    writeFileSync(file, changelog)
    return true
  } catch (error) {
    core.error(`Error reading the file: ${file}
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
      `

${release.data.body}

${data}
    `
    )

    return true
  } catch (error) {
    core.error(`Error reading the file: ${file}
      ${error}
    `)

    return false
  }
}
