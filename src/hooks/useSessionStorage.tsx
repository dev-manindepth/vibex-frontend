const useSessionStorage = (key: any, type: 'get' | 'set' | 'remove') => {
  try {
    if (type == 'get') {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : '';
    } else if (type == 'set') {
      const setValue = (newValue: any) => {
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
      };
      return [setValue];
    } else {
      const removeValue = () => {
        window.sessionStorage.removeItem(key);
      };
      return [removeValue];
    }
  } catch (err) {
    console.log(err);
  }
};

export default useSessionStorage;
