import nodeExternals from 'webpack-node-externals'

const config = {
  target: 'node',
  entry: './express/server.js',
  output: {
    libraryTarget: 'commonjs',
    path: 'build',
    filename: 'server.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json']
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}

export default config
