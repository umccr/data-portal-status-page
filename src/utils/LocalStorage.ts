import { useState, useEffect } from 'react';

function getStorageValue(key: string, defaultValue: any) {
  // getting stored value
  const saved = localStorage.getItem(key);
  const initial = JSON.parse(saved as string); // Add type assertion here
  return initial || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: any) => {
  // Add type annotation for key
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
