import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Electron Widgets",
	description: "Documentation for the HTML-based widget manager",
	themeConfig: {
		nav: [
			{ text: "Overview", link: "/docs/overview" },
			{
				text: "Guides",
				items: [
					{ text: "Install a Widget", link: "/docs/installation-of-a-widget" },
					{ text: "Configure Widgets", link: "/docs/widgets-configuration" },
					{ text: "Create a Subreddit Widget", link: "/docs/creating-subreddit-widget" },
					{ text: "Use Custom Data", link: "/docs/using-custom-data" },
				],
			},
			{
				text: "Reference",
				items: [
					{ text: "Built-in API Types", link: "/docs/built-in-api-return-types" },
					{ text: "index.html Structure", link: "/docs/index-html" },
				],
			},
		],
		sidebar: [
			{
				text: "Overview",
				items: [
					{ text: "Project Overview", link: "/docs/overview" },
					{ text: "Installation of a Widget", link: "/docs/installation-of-a-widget" },
					{ text: "Widgets Configuration", link: "/docs/widgets-configuration" },
				],
			},
			{
				text: "Widget Guides",
				items: [
					{ text: "Creating a Subreddit Widget", link: "/docs/creating-subreddit-widget" },
					{ text: "Best Practice to Render an Array", link: "/docs/best-practice-to-render-an-array" },
					{ text: "Using Custom Data", link: "/docs/using-custom-data" },
					{ text: "Using Javascript", link: "/docs/using-javascript" },
					{ text: "Responsive Design", link: "/docs/responsive-design" },
					{ text: "Creating a Custom Scrollbar", link: "/docs/creating-a-custom-scrollbar" },
				],
			},
			{
				text: "Desktop Integration",
				items: [
					{ text: "Frameless Window", link: "/docs/frameless-window" },
					{ text: "Show Native Notifications", link: "/docs/show-native-notifications" },
					{ text: "Developer Console", link: "/docs/developer-console" },
				],
			},
			{
				text: "Reference",
				items: [
					{ text: "Built-in API Return Types", link: "/docs/built-in-api-return-types" },
					{ text: "index.html Reference", link: "/docs/index-html" },
				],
			},
		],
		socialLinks: [{ icon: "github", link: "https://sametcc.me/repo/electron-widgets" }],
	},
});
