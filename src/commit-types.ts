export const getCommitType = (type: string, lang?: string): string => {
  if (lang === 'zh') {
    if (type.includes('feat')) {
      return type.replace('feat', '新增功能')
    }
    if (type.includes('fix')) {
      return type.replace('fix', '功能修复')
    }
    if (type.includes('docs')) {
      return type.replace('docs', '文档更新')
    }
    if (type.includes('style')) {
      return type.replace('style', '代码样式')
    }
    if (type.includes('refactor')) {
      return type.replace('refactor', '功能重构')
    }
    if (type.includes('perf')) {
      return type.replace('perf', '性能优化')
    }
    if (type.includes('test')) {
      return type.replace('test', '单元测试')
    }
    if (type.includes('chore')) {
      return type.replace('chore', '项目配置')
    }
    if (type.includes('revert')) {
      return type.replace('revert', '功能回退')
    }
    if (type.includes('other')) {
      return type.replace('other', '其他')
    }
  }

  return type
}
