import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
// eslint-disable-next-line import/extensions
import pkg from './package.json';

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      name: 'HttpClient',
      format: 'umd',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.ts'],
    }),
  ],
};
