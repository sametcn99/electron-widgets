# Detailed Guide on How to Contribute Widgets

Creating custom widgets for your application can enhance its functionality and provide a more interactive experience for your users. Below is a step-by-step guide on how to create widgets, specifically tailored for a project structure where widgets are stored in a `public/widgets` directory.

## Step 1: Set Up Your Widget Directory

1. **Navigate to the public/widgets Folder:** This is where all your widgets will reside. If this folder does not exist in your project, you'll need to create it.

2. **Create a New Folder for Your Widget:** Each widget should have its own separate folder to keep files organized. Name this folder after your widget to make it easily identifiable.

## Step 2: Add Essential Widget Files

Within the folder you created for your widget, you'll need to add a few key files. These are:

- **renderer.js:** This JavaScript file will contain the logic of your widget. It's where you'll handle user interactions, fetch data, and manipulate the DOM if needed.

- **index.html:** This HTML file will define the structure of your widget. It should include the necessary markup that represents your widget's UI.

- **styles.css:** This CSS file is for styling your widget. You'll define the visual appearance of your widget here. If you prefer, you can also include the CSS directly within your HTML file using `<style>` tags, but having a separate CSS file is generally considered better practice for maintainability and organization.

## Step 3: Populate Your Widget's Files

1. **Fill renderer.js with Logic:** Implement the functionality of your widget. This could involve setting up event listeners, fetching data from APIs, and manipulating the DOM based on user interactions or data changes.

2. **Design Your Widget in index.html:** Add the necessary HTML elements that make up your widget. Ensure to structure your HTML in a way that makes it easy to style and interact with via JavaScript.

3. **Style Your Widget in styles.css:** Use CSS to style your widget's HTML elements. This is where you'll make your widget visually appealing and ensure it aligns with the overall design of your application.

## Step 4: Register Your Widget

1. **Update widgets.json:** To make your widget recognized by the application, you need to register it in the `widgets.json` file located in the `public/widgets` directory. Add an entry for your widget that includes any necessary details required by your application to load and display the widget. This could include the widget's name, description, entry point (usually the path to index.html), and any other metadata your application needs to handle the widget.

## Final Thoughts

Creating widgets involves setting up the right files and writing the code that defines the widget's structure, style, and functionality. By following the steps outlined above, you can create custom widgets that enhance your application's interactivity and user experience. Remember to test your widget thoroughly to ensure it works as expected and provides value to your users.

## Note

**In renderer.js, Node integration is enabled with a setting of true, and context isolation is disabled with a setting of false. This configuration grants access to Node.js APIs like fs (file system) and path within the renderer process.**
