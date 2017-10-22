import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.jsx',
	output: {
		file: 'dist/index.js',
		format: 'cjs',
		exports: 'default'
	},
	plugins: [
		// resolve(),
		commonjs(),
		babel({
			exclude: 'node_modules/**'
		})
	]
};
