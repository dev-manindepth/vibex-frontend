const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@services': path.resolve(__dirname, 'src/services'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@root': path.resolve(__dirname, 'src')
    }
  };
  return config;
};
