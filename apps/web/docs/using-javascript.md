# Using JavaScript

When you're writing JavaScript in your widget, there are some limitations and some useful features. The limitations stem from Electron's context isolation, which is implemented for security reasons.
Context Isolation is a feature that ensures both your `preload` scripts and Electron's internal logic run in a separate context from the website you load in a [`webContents`](https://www.electronjs.org/docs/latest/api/web-contents). This is crucial for security as it prevents the website from accessing Electron internals or the powerful APIs your preload script has access to.

However, there are some features available in the built-in preload script. You can utilize functions such as:

- Parsing RSS feed URLs
- Parsing OPML files to JSON
- Getting location
- Getting system information
- Getting disk usage
- Opening external apps
- Opening external URLs
- Opening external directories

Exploring the source code is indeed a great way to understand how things work. It allows you to dive deep into the implementation details, see how different components interact with each other, and gain insights into best practices and patterns used in the codebase.
