import { defineConfig } from 'rollup';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'bundle-entry.js',   // 作成するエントリーポイント
	output: {
		file: 'lib/js/redux-bundle.js',
		format: 'umd',
		name: 'ReduxBundle',      // window.ReduxBundle に export される
		sourcemap: false,
	},
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify('production'),
			preventAssignment: true, // ←これ重要
		}),
		resolve(),
		commonjs(),
	],
	treeshake: true,
};
