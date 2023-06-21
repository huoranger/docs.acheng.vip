import DefaultTheme from 'vitepress/theme'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '后端',
    items: [
      { text: '基础', link: '/courses/backend/basic/index', activeMatch: '/courses/backend/basic/' },
        { text: '框架', link: '/courses/backend/framework/index', activeMatch: '/categories/backend/framework/' },
        // { text: '中间件', link: '/courses/middleware/01-RabbitMQ/01-RabbitMQ入门', activeMatch: '/courses/middleware/' },
    ],
    activeMatch: '/courses/backend/basic/index'
  },
  {
    text: '前端',
    items: [
      { text: '基础', link: '/categories/issues/index', activeMatch: '/categories/issues/' },
        { text: '框架', link: '/categories/fragments/index', activeMatch: '/categories/fragments/' },
    ],
    activeMatch: '/categories/frontend'
  },
  {
    text: '数据库',
    items: [
      { text: 'MySQL', link: '/courses/database/01-MySQL/01-MySQL基础/01-MySQL基础', activeMatch: '/courses/database/01-MySQL/01-MySQL基础/01-MySQL基础' },
      { text: '非关系型数据库', link: '/courses/database/01-MySQL/01-MySQL基础', activeMatch: '/courses/database/01-MySQL/01-MySQL基础' },
    ],
    activeMatch: '/courses/database'
  },
  { text: '运维',  link: '/courses/operation/01-Linux/01-Linux速成.md', activeMatch: '/courses/operation/'},

  { text: '面试突击',  link: '/courses/interview/01-后端面试/01-架构300讲', activeMatch: '/courses/interview/01-后端面试'},

  // {
  //   text: '其他',
  //   items: [
  //       { text: '杂碎', link: '/categories/fragments/index', activeMatch: '/categories/fragments/' },
  //       { text: 'Bug集', link: '/categories/issues/index', activeMatch: '/categories/issues/' },
  //   ],
  //   activeMatch: '/categories/other'
  // },
  // {
  //   text: '小册',
  //   items: [
  //     { text: '后端', link: '/courses/backend/index', activeMatch: '/courses/backend/01-操作系统/01-操作系统基础知识' },
  //     { text: '前端', link: '/courses/frontend/index', activeMatch: '/courses/frontend/' },
  //     { text: '数据库', link: '/courses/database/01-MySQL/01-MySQL基础', activeMatch: '/courses/database/01-MySQL/01-MySQL基础' },
  //     { text: '运维', link: '/courses/mybatis/index', activeMatch: '/courses/mybatis/' },

  //   ],
  //   activeMatch: '/courses/'
  // },
  // {
  //   text: '标签',
  //   link: '/tags',
  //   activeMatch: '/tags'
  // },
  // {
  //   text: '归档',
  //   link: '/archives',
  //   activeMatch: '/archives'
  // },
  // {
  //   text: '关于',
  //   items: [
  //     { text: '关于知识库', link: '/about/index', activeMatch: '/about/index' },
  //     { text: '关于「我」', link: '/about/me', activeMatch: '/about/me' }
  //   ],
  //   activeMatch: '/about/' // // 当前页面处于匹配路径下时, 对应导航菜单将突出显示
  // }
]