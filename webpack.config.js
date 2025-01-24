const path = require('path');

module.exports = {
  entry: './src/index.js', // Path to your entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  watch: true, // Enable watching for changes
  module: {
    rules: [
      {
        test: /\.js$/,
        test: /\.css$/,
        exclude: /node_modules/, // Don't transpile node_modules
        use: ['babel-loader', 'style-loader', 'css-loader']
      }
    ]
  }
};

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/landingpage.html', // Path to your HTML template
      filename: 'index.html',
    }),
  ]
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images', // Optional: put images in a specific directory
            },
          },
        ],
      },
    ],
  },
};

module.exports = {
  devServer: {
    contentBase: './dist',
    hot: true,
  },
};
