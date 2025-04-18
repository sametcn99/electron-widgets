## Project Overview

This project is a desktop application built with Electron.js, Node.js, and TypeScript. It allows users to create, manage, and display various widgets directly on their desktop for quick access to information and tools. The main application window provides an interface for managing these widgets, while individual widgets run in their own separate windows.

## Core Technologies

- **Electron.js:** Framework for building cross-platform desktop apps with web technologies.
- **Node.js:** JavaScript runtime for the backend (main process).
- **TypeScript:** Primary language for type safety and improved developer experience.
- **Vue.js 3 (Composition API):** Used for building the user interface in the renderer process (specifically the main management window). See [`src/app/renderer/app.vue`](c:\Users\samet\SWProjects\electron-widgets\src\app\renderer\app.vue) and components in [`src/app/renderer/components/`](c:\Users\samet\SWProjects\electron-widgets\src\app\renderer\components\).
- **Tailwind CSS:** Utility-first CSS framework used for styling (evident in Vue components).

## Architecture

The application follows the standard Electron multi-process architecture:

1.  **Main Process (`src/app/main`):**
    - Entry point: [`src/app/main/main.ts`](c:\Users\samet\SWProjects\electron-widgets\src\app\main\main.ts)
    - Handles application lifecycle events, window creation and management (using [`WindowManager`](c:\Users\samet\SWProjects\electron-widgets\src\utils\browser-windows\window-manager.ts)), native OS integrations (like tray icon via [`src/utils/tray.ts`](c:\Users\samet\SWProjects\electron-widgets\src\utils\tray.ts)), and background tasks.
    - Listens for and responds to IPC messages from renderer processes. IPC handlers are organized in [`src/app/main/ipc-operations/`](c:\Users\samet\SWProjects\electron-widgets\src\app\main\ipc-operations\).
2.  **Renderer Process (`src/app/renderer`):**
    - Responsible for the UI of the main application window ([`src/app/renderer/app.vue`](c:\Users\samet\SWProjects\electron-widgets\src\app\renderer\app.vue)).
    - Built using Vue.js 3.
    - Communicates with the main process via the preload script (`window.electronAPI`).
    - Individual widgets load their own HTML/CSS/JS from their respective folders within the user's widget directory (configured via [`src/lib/config.ts`](c:\Users\samet\SWProjects\electron-widgets\src\lib\config.ts)).
3.  **Preload Script (`src/app/preload`):**
    - [`src/app/preload/preload.ts`](c:\Users\samet\SWProjects\electron-widgets\src\app\preload\preload.ts) runs in a privileged context with access to both the DOM (`window`) and Node.js APIs.
    - It securely exposes specific IPC channels and functionalities from the main process to the renderer process via the `window.electronAPI` object, defined in [`src/app/preload/electronAPI.ts`](c:\Users\samet\SWProjects\electron-widgets\src\app\preload\electronAPI.ts).

## Key Concepts & Files

- **IPC Communication:** Inter-Process Communication is crucial. Channels are defined in the [`IpcChannels`](c:\Users\samet\SWProjects\electron-widgets\src\lib\ipc-channels.ts) enum. Main process handlers are in [`src/app/main/ipc-operations/`](c:\Users\samet\SWProjects\electron-widgets\src\app\main\ipc-operations\), and the renderer invokes them via `window.electronAPI`.
- **Widget Configuration:** Widget metadata (position, size, visibility, lock status, etc.) is stored in `widgets.json`. The path is defined in [`config.widgetsJsonPath`](c:\Users\samet\SWProjects\electron-widgets\src\lib\config.ts). Functions for reading/writing this file are in [`src/utils/widget/widgets-folder.ts`](c:\Users\samet\SWProjects\electron-widgets\src\utils\widget\widgets-folder.ts) and exposed via IPC channels like [`READ_WIDGETS_JSON`](c:\Users\samet\SWProjects\electron-widgets\src\lib\ipc-channels.ts?q=READ_WIDGETS_JSON) and [`WRITE_WIDGETS_JSON`](c:\Users\samet\SWProjects\electron-widgets\src\lib\ipc-channels.ts?q=WRITE_WIDGETS_JSON).
- **Widget Management:** The [`WindowManager`](c:\Users\samet\SWProjects\electron-widgets\src\utils\browser-windows\window-manager.ts) class in the main process is responsible for creating, destroying, finding, and managing all `BrowserWindow` instances (both the main window and widget windows).
- **Utilities (`src/utils`):** Contains helper modules for various tasks like display boundary checks ([`displayControl`](c:\Users\samet\SWProjects\electron-widgets\src\utils\display-control.ts)), window management ([`src/utils/browser-windows/`](<c:\Users\samet\SWProjects\electron-widgets\src\utils\browser-windows)>), widget file operations ([`src/utils/widget/`](<c:\Users\samet\SWProjects\electron-widgets\src\utils\widget)>), and general helpers ([`src/utils/utils.ts`](c:\Users\samet\SWProjects\electron-widgets\src\utils\utils.ts)).
- **Shared Library (`src/lib`):** Holds shared configurations ([`src/lib/config.ts`](c:\Users\samet\SWProjects\electron-widgets\src\lib\config.ts)), constants ([`src/lib/ipc-channels.ts`](c:\Users\samet\SWProjects\electron-widgets\src\lib\ipc-channels.ts)), and default widget data ([`src/lib/preset.ts`](c:\Users\samet\SWProjects\electron-widgets\src\lib\preset.ts)).
- **Widget Structure:** Widgets are expected to be self-contained folders, typically containing at least an `index.html` file. They are added via the [`ADD_WIDGET_DIALOG`](c:\Users\samet\SWProjects\electron-widgets\src\lib\ipc-channels.ts?q=ADD_WIDGET_DIALOG) functionality.

## Coding Guidelines

- Use TypeScript and adhere to existing type definitions in [`src/types/index.d.ts`](c:\Users\samet\SWProjects\electron-widgets\src\types\index.d.ts).
- When adding new IPC functionality:
  1.  Define a new channel key in [`IpcChannels`](c:\Users\samet\SWProjects\electron-widgets\src\lib\ipc-channels.ts).
  2.  Implement the handler in the appropriate file within [`src/app/main/ipc-operations/`](c:\Users\samet\SWProjects\electron-widgets\src\app\main\ipc-operations\).
  3.  Expose the channel invoker in [`src/app/preload/electronAPI.ts`](c:\Users\samet\SWProjects\electron-widgets\src\app\preload\electronAPI.ts).
  4.  Call it from the renderer process using `window.electronAPI.yourNewFunction()`.
- For UI changes in the main window, modify or create Vue components in [`src/app/renderer/components/`](c:\Users\samet\SWProjects\electron-widgets\src\app\renderer\components\) using the Composition API (`setup` function).
- Use utility functions from [`src/utils/`](c:\Users\samet\SWProjects\electron-widgets\src\utils\) where appropriate.
- Ensure code related to window management interacts correctly with the [`WindowManager`](c:\Users\samet\SWProjects\electron-widgets\src\utils\browser-windows\window-manager.ts).
- Reference project symbols using fully qualified links (e.g., [`namespace.FunctionName`](path/to/file.ts)) when explaining or generating code.

## Rules

- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.
