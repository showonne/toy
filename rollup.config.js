import babel from 'rollup-plugin-babel'

export default {
    entry: 'src/index.js',
    dest: 'dest/toy.js',
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
}