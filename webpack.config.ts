import path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import * as DevServer from 'webpack-dev-server';

const config: Configuration = {  
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', 
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    client: {
      overlay: false
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    })
  ],
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  devtool: process.env.NODE_ENV === 'development' ? 'eval-cheap-module-source-map' : 'source-map'
};

export default config;