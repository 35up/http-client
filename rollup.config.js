import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';


const dir = 'dist';
const baseName = 'http-client';
const plugins = [
  typescript(),
];

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: `${dir}/${baseName}.cjs`,
        format: 'cjs',
      },
      {
        file: `${dir}/${baseName}.js`,
        format: 'esm',
      },
    ],
    plugins,
  },
  {
    input: './src/index.node.ts',
    output: [
      {
        file: `${dir}/${baseName}.node.cjs`,
        format: 'cjs',
        paths: {
          'node-fetch': 'node-fetch/lib/index.js',
        },
      },
      {
        file: `${dir}/${baseName}.node.js`,
        format: 'esm',
        paths: {
          'node-fetch': 'node-fetch/lib/index.mjs',
        },
      },
    ],
    external: ['node-fetch'],
    plugins,
  },
  {
    input: `${dir}/index.d.ts`,
    output: [
      {file: `${dir}/${baseName}.d.ts`, format: 'esm'},
      {file: `${dir}/${baseName}.cjs.d.ts`, format: 'commonjs'},
    ],
    plugins: [dts({
      compilerOptions: {
        baseUrl: '.',
      },
    })],
  },
  {
    input: `${dir}/index.node.d.ts`,
    output: [
      {file: `${dir}/${baseName}.node.d.ts`, format: 'esm'},
      {file: `${dir}/${baseName}.node.cjs.d.ts`, format: 'commonjs'},
    ],
    plugins: [dts({
      compilerOptions: {
        baseUrl: '.',
      },
    })],
  },
];
