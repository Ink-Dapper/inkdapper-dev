const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development', // Only enable fast refresh in development mode
  devServer: {
    hot: true, // Enables hot reloading
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-refresh/babel'], // Add react-refresh plugin
          },
        },
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(), // Add the refresh plugin here
  ],
};
