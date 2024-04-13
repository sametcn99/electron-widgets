/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// Add event listener to execute code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to search input field for keydown event
    document
      .getElementById("searchInput")
      .addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
          // Check if Enter key is pressed
          search(); // Call search function
        }
      });
  });
  
  // Function to perform search
  function search() {
    try {
      var searchEngine = document.getElementById("searchEngine").value; // Get search engine value
      var searchTerm = document.getElementById("searchInput").value; // Get search term value
  
      if (searchTerm.trim() !== "") {
        // Check if search term is not empty
        var searchURL = searchEngine + encodeURIComponent(searchTerm); // Create search URL
        window.electronAPI.openExternalLink(searchURL); // Open search URL in external browser
      }
    } catch (error) {
      console.error("Error occurred during search:", error); // Log any errors that occur during search
    } finally {
      document.getElementById("searchInput").value = ""; // Clear search input field
    }
  }