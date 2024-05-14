import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Wangcan Blog",
  description: "A Personal Blog Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },{
        text: 'C++ Primary笔记',
        items: [
          { 
            text: '变量和基本类型', collapsed: true, base: '/C++ Primary笔记/变量和基本类型', 
            items: [
              { text: '复合类型', link: '/复合类型'}, 
              { text: 'const限定符', link: '/const限定符'},
              { text: '练习题', link: '/练习题'},
            ] 
          },
          { text: '高级', collapsed: true, base: '/C++ Primary笔记/高级', items: [] },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
