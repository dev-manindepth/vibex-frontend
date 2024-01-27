const useLocalStorage = (key: any, type: 'set' | 'get' | 'remove') => {
  try {
    if (type === 'get') {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : '';
    } else if (type === 'set') {
      const setValue = (newValue: any) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      };
      return [setValue];
    } else if (type === 'remove') {
      const removeValue = () => {
        window.localStorage.removeItem(key);
      };
      return [removeValue];
    }
  } catch (err) {
    console.log(err);
  }
};

export default useLocalStorage;
