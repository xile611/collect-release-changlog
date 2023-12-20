export const getCommitType = (type: string, lang?: string): string => {
  if (lang === 'zh') {
    switch (type) {
      case 'feat':
        return '新增功能'
      case 'fix':
        return '功能修复'
      case 'docs':
        return '文档更新'
      case 'style':
        return '代码样式'
      case 'refactor':
        return '功能重构'
      case 'perf':
        return '性能优化'
      case 'test':
        return '单元测试'
      case 'chore':
        return '项目配置'
      case 'revert':
        return '功能回退'
      default:
        return '其他'
    }
  }

  return type
}
