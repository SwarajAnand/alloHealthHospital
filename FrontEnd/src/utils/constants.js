export const setLocalStorage = (key, data) => {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.error('Error setting data in localStorage', error);
    }
  };
  
  export const getLocalStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error getting data from localStorage', error);
      return null;
    }
  };
  
  export const clearLocalStorage = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing data from localStorage', error);
    }
  };
  