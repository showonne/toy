import process from 'process'

import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

let plugins = []

plugins.push(babel({
            exclude: 'node_modules/**'
        }))

if(process.env.BUILD === 'production'){
    plugins.push(uglify())
}

export default {
    entry: 'src/index.js',
    dest: 'dest/toy.js',
    format: 'umd',
    moduleName: 'Toy',
    plugins
}