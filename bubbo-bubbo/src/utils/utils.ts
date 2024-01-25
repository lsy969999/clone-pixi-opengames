export function getUrlParams(param: string) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  return urlParams.get(param);
}

export function removeFromArray<T>(arr: T[], item: T): T[] {
  ~arr.indexOf(item) && arr.splice(arr.indexOf(item), 1);
  return arr;
}

export function removeAllFromArray<T>(arr: T[], callback?: (item: T) => void): T[] {
  for (let i = arr.length -1; i >= 0; --i) {
    const item = arr[i];
    callback?.(item);
    removeFromArray(arr, item)
  }
  return arr
}