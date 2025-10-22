# Using Custom Data

This JavaScript snippet demonstrates how to use custom data in your application. It reads custom data from a file named "data.json" associated with the "system information" widget. If the data exists, it parses it; otherwise, it retrieves system information using the Electron API `getSystemInfo()` method, writes the system information as custom data, and logs it.

```javascript
// Read the custom data
let data = await window.electronAPI.readCustomData(
  "system information",
  "data.json"
);
// If data exists, parse it
if (data !== "") {
  data = JSON.parse(data);
}

// If data doesn't exist
if (data === "") {
  // Get the system info
  data = await window.electronAPI.getSystemInfo();
  // Write the system info as custom data
  await window.electronAPI.writeCustomData(
    "system information",
    "data.json",
    data
  );
}
// Log the data
console.log(data);

// If data exists, update the UI
if (data) updateUI();
```

By following this pattern, you can efficiently manage and utilize custom data within your application, ensuring that relevant information is stored and accessed as needed. This can be particularly useful for caching frequently accessed or computationally expensive data, improving performance and user experience.
