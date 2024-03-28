import Store from "electron-store";

const store = new Store();

export function getStore() {
  return store;
}

export function getDataFromStore(key: string) {
  return store.get(key);
}

export function setDataInStore(key: string, value: string) {
  store.set(key, value);
}

export function deleteDataFromStore(key: string) {
  store.delete(key);
}

export function clearStore() {
  store.clear();
}
