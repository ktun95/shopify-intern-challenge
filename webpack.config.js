const path = require('path')

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader:'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic'}]]
                    }   
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    }
}