# index.html Reference

Create an `index.html` in your `your-widget-name` folder:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="./style.css">
    <!-- Don't add title tag here /> -->
  </head>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

You can separate the styles and the script codes to another file and import to html file. (recommended)

## Title Tag

If you need a title tag in html file you need to add the same title in your config. For example:

```json
{
  "clock": {
    "title": "clock",
    "visible": false,
    "locked": false,
    "width": 366,
    "height": 160,
    "x": 511,
    "y": 69,
    "alwaysOnTop": false
  }
}
```

```html
<title>clock</title>
```
