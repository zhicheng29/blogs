import { getThemeConfig, defineConfig } from '@sugarat/theme/node';

const blogTheme = getThemeConfig({
	// * 是否设置为博客模式，默认为博客模式
	// blog: false, // 如果设置为false，就可以使用 Vitepress 默认的首页主题样式

	// * 文章默认作者
	author: 'Symbol',

	// * 文章根目录
	srcDir: './docs',

	// * 文章推荐
	recommend: {
		title: '🔍 相关文章',
		nextText: '换一组',
		pageSize: 6,
		empty: '暂无相关文章', // false时无推荐文章不展示此模块
	},

	// * 友情链接
	friend: [
		{
			nickname: 'wacko',
			des: 'Strive To Be A Geek',
			avatar: '/logo.jpg',
			url: 'https://github.com/zhicheng29',
		},
	],

	// * 是否展示文章的预计阅读时间
	article: {
		readingTime: false,
	},
});

export default defineConfig({
	extends: blogTheme,
	lang: 'zh-cn',
	title: 'Symbol',
	description: '',
	vite: {
		optimizeDeps: {
			include: ['element-plus'],
			exclude: ['@sugarat/theme'],
		},
	},
	lastUpdated: true,
	head: [
		// 配置网站的图标（显示在浏览器的 tab 上）
		// ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
		['link', { rel: 'icon', href: '/favicon.ico' }],
	],
	themeConfig: {
		returnToTopLabel: '回到顶部',
		sidebarMenuLabel: '相关文章',
		lastUpdatedText: '上次更新于',
		footer: {
			message: '',
			copyright:
				'欢迎关注 | <a target="_blank" href="https://github.com/zhicheng29">@Symbol</a>',
		},
		logo: '/logo.jpg',
		// 导航栏配置
		nav: [
			{
				text: '线上作品',
				items: [
					{ text: 'Vue-Pcerame', link: 'http://zhicwang.com:8200/' },
				],
			},
		],
		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/zhicheng29',
			},
		],
	},
});
