import * as core from '@actions/core'
import * as github from '@actions/github'
import { getFiles } from './files'
import { updateOrAppendChanglog } from './release'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const folder: string = core.getInput('folder')
    const langs: string = core.getInput('langs')
    const fileName: string = core.getInput('file_name')
    let tag: string = core.getInput('tag_name')

    if (!tag) {
      const res = /^refs\/tags\/(v\d+\.\d+\.\d+)+$/.exec(github.context.ref)

      if (res) {
        tag = res[1]
      }
    }

    if (tag) {
      const files = getFiles({ folder, langs, fileName, tag })

      const result = await updateOrAppendChanglog(files)

      core.setOutput('changed_files', result.join(','))
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
