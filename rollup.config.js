import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',
  plugins: [babel()],

  output: [
    {
      file: './dist/http-client.umd.js',
      format: 'umd',
      name: 'HttpClient',
      exports: 'named',
    },
    {
      file: './dist/http-client.esm.js',
      format: 'esm',
    },
  ],
};
