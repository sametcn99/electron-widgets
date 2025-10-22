# Best Practice to Render an Array

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Array Render Example</title>
<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
</style>
</head>
<body>
  <h1>Array Render Example</h1>
  <ul id="list-container">
    <!-- List will be created here -->
  </ul>

  <script>
    // Sample array
    var items = ['Apple', 'Pear', 'Banana', 'Strawberry'];

    // Container where the list will be created
    var listContainer = document.getElementById('list-container');

    // Function to render items onto the screen
    function renderItems() {
      // First, clear the existing list
      listContainer.innerHTML = '';

      // Create a node for each item in the array
      items.forEach(function(item) {
        var listItem = document.createElement('li');
        listItem.textContent = item;

        // Clone the node and append it to the list
        var clonedNode = listItem.cloneNode(true);
        listContainer.appendChild(clonedNode);
      });
    }

    // Render items when the page loads
    renderItems();
  </script>
</body>
</html>
```

The code snippet allows dynamic display of an array's content as a list on a webpage via the cloneNode method. Here's the process simplified:

A function called renderItems takes an array (items) and a container (listContainer) as parameters. It iterates over the array with forEach, creating a new list item for each element, assigning it the array element's value. This item is then cloned using cloneNode and appended to the list container. The use of cloneNode ensures each list item is independent, facilitating dynamic updates to the content when the page loads or the array changes.

Additionally, the use of querySelector suggests that elements within the cloned nodes can be selected and altered, offering more customization and control over the content displayed.
