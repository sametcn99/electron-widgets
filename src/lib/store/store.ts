import Store from "electron-store";

// Create a new instance of the Store class
const store = new Store();

// Function to get the store instance
export const getStore = () => store;
// Function to get data from the store using a key
export const getDataFromStore = (key: string) => store.get(key);

// Function to set data in the store using a key and value
export const setDataInStore = (key: string, value: string) =>
  store.set(key, value);

// Function to delete data from the store using a key
export const deleteDataFromStore = (key: string) => store.delete(key);

// Function to clear the entire store
export const clearStore = () => store.clear();
