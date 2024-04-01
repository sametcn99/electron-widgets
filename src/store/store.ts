import Store from "electron-store";

// Create a new instance of the Store class
const store = new Store();

// Function to get the store instance
export function getStore() {
  return store;
}

// Function to get data from the store using a key
export function getDataFromStore(key: string) {
  return store.get(key);
}

// Function to set data in the store using a key and value
export function setDataInStore(key: string, value: string) {
  store.set(key, value);
}

// Function to delete data from the store using a key
export function deleteDataFromStore(key: string) {
  store.delete(key);
}

// Function to clear the entire store
export function clearStore() {
  store.clear();
}
