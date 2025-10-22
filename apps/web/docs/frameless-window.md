# Frameless Window

By default, all windows in our application are created as frameless windows. While frameless windows provide a sleek and modern look, they do come with certain challenges, particularly concerning drag functionality.

## Enabling Drag Functionality

In frameless windows, drag functionality does not work out-of-the-box. To enable this feature, you need to modify your `styles.css` file by adding the `-webkit-app-region: drag;` property to an appropriate element. However, it's important to note that applying this property to elements that require user interaction (such as buttons or input fields) will prevent users from interacting with those elements.

To address this issue, you can add the `-webkit-app-region: no-drag;` property to all elements that require user interaction. Below is a CSS snippet you can copy and paste into your `styles.css` file to apply these properties correctly:

```css
/* Apply drag property to the window */
.draggable-area {
  -webkit-app-region: drag;
}

/* Exclude interactive elements from drag */
input,
button,
select,
textarea,
a,
form,
label,
iframe,
details,
audio,
video,
area,
embed,
menu,
object,
svg,
canvas,
meter,
progress {
  -webkit-app-region: no-drag;
}
```

### Example HTML for Drag Functionallity

To illustrate, you might have a header area that users can click and drag to move the window. You can wrap this header in a container with the `draggable-area` class:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="draggable-area">
        <h1>My Frameless Window</h1>
    </div>
    <button>Click Me</button>
</body>
</html>
```

## Transparent Window

Frameless windows can also be made transparent. If you don't specify a `background-color` property for the `body` or `root` elements in your CSS, the window will appear transparent. This can be useful for creating visually unique and immersive interfaces.

### Example CSS

To create a transparent window, ensure your CSS does not define a background color for the main container elements:

```css
body, #root {
  /* No background color, resulting in transparency */
}
```

By carefully configuring these properties, you can leverage the aesthetic advantages of frameless windows while maintaining full functionality and user interaction within your application.