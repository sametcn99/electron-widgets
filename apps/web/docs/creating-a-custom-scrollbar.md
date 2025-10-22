# Creating a Custom Scrollbar

Customizing scrollbars can greatly enhance the user experience and aesthetics of a web application. In this guide, we'll explore how to create a custom scrollbar using CSS and JavaScript, specifically for web applications running on Chromium-based browsers such as Google Chrome, Microsoft Edge, and Opera.

## Table of Contents

- [Creating a Custom Scrollbar](#creating-a-custom-scrollbar)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Basic Concepts](#basic-concepts)
  - [Custom Scrollbar with CSS](#custom-scrollbar-with-css)
    - [Step 1: Basic Styles](#step-1-basic-styles)
    - [Step 2: Applying Styles to a Specific Element](#step-2-applying-styles-to-a-specific-element)
    - [Step 3: Adding Smooth Scrolling](#step-3-adding-smooth-scrolling)
  - [Advanced Customization with JavaScript](#advanced-customization-with-javascript)
    - [Example: Changing Scrollbar Color on Scroll](#example-changing-scrollbar-color-on-scroll)

## Introduction

Scrollbars are an essential part of web applications, but default scrollbars can sometimes be visually unappealing or inconsistent with the overall design of your website. By customizing scrollbars, you can create a more cohesive and visually appealing user interface.

## Basic Concepts

Chromium-based browsers support the `::-webkit-scrollbar` pseudo-element, which allows for extensive customization of scrollbars. Here are the main pseudo-elements you can use:

- `::-webkit-scrollbar`: The entire scrollbar.
- `::-webkit-scrollbar-thumb`: The draggable part of the scrollbar.
- `::-webkit-scrollbar-track`: The track in which the scrollbar thumb slides.

## Custom Scrollbar with CSS

To create a custom scrollbar using CSS, you need to target these pseudo-elements and apply your desired styles. Below is a step-by-step guide:

### Step 1: Basic Styles

First, apply basic styles to the scrollbar and its components.

```css
/* Width and height of the scrollbar */
::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}

/* Background of the scrollbar track */
::-webkit-scrollbar-track {
    background: #f1f1f1; 
}

/* Style of the scrollbar thumb */
::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 6px;
}

/* Style of the scrollbar thumb when hovered */
::-webkit-scrollbar-thumb:hover {
    background: #555; 
}
```

### Step 2: Applying Styles to a Specific Element

To target a specific element, use the element's class or ID.

```css
/* Targeting a specific element */
.my-scrollable-div::-webkit-scrollbar {
    width: 10px;
}

.my-scrollable-div::-webkit-scrollbar-thumb {
    background-color: #3498db;
    border-radius: 10px;
    border: 2px solid #2980b9;
}
```

### Step 3: Adding Smooth Scrolling

You can add smooth scrolling to enhance the user experience.

```css
html {
    scroll-behavior: smooth;
}
```

## Advanced Customization with JavaScript

For more dynamic and interactive customizations, JavaScript can be used. For instance, you can change the scrollbar style based on user interactions or specific conditions.

### Example: Changing Scrollbar Color on Scroll

Here's how you can change the scrollbar color based on the scroll position:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Scrollbar</title>
    <style>
        body {
            height: 2000px;
            margin: 0;
        }

        ::-webkit-scrollbar {
            width: 12px;
        }

        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 6px;
        }
    </style>
</head>
<body>
    <script>
        window.onscroll = function() {
            let scrollPosition = window.scrollY;
            let thumbColor = scrollPosition > 100 ? '#ff5733' : '#888';
            document.querySelector('::-webkit-scrollbar-thumb').style.background = thumbColor;
        };
    </script>
</body>
</html>
```
