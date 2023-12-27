export const locales: Record<string, Record<string, string>> = {
  en: {
    feat: 'New feature',
    fix: 'Bug fix',
    docs: 'Site / documentation update',
    style: 'Code style optimization',
    refactor: 'Refactor',
    perf: 'Performance optimization',
    test: 'Test Case',
    chore: 'Configuration releated',
    revert: 'revert',
    other: 'other',
    more_detail_about: 'more detail about'
  },

  zh: {
    feat: '新增功能',
    fix: '功能修复',
    docs: '文档更新',
    style: '代码样式',
    refactor: '功能重构',
    perf: '性能优化',
    test: '单元测试',
    chore: '项目配置',
    revert: '功能回退',
    other: '其他',
    more_detail_about: '更多详情请查看'
  }
}

export const getLocaleByKey = (key: string, locale = 'en'): string => {
  return locales[locale] ? locales[locale][key] : key
}
