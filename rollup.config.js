import typescript from 'rollup-plugin-typescript2';
// eslint-disable-next-line import/extensions
import pkg from './package.json';


const plugins = [
  typescript({ useTsconfigDeclarationDir: true }),
];

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: pkg.browser,
        name: 'HttpClient',
        format: 'umd',
        exports: 'named',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    plugins,
  },
  {
    input: './src/index.node.ts',
    output: {
      file: pkg.main,
      name: 'HttpClient',
      format: 'umd',
      exports: 'named',
    },
    plugins,
  },
];
