import typescript from 'rollup-plugin-typescript2';


const dir = 'dist';
const baseName = 'http-client';
const plugins = [
  typescript({ useTsconfigDeclarationDir: true }),
];

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: `${dir}/${baseName}.cjs.js`,
        format: 'cjs',
      },
      {
        file: `${dir}/${baseName}.esm.js`,
        format: 'esm',
      },
    ],
    plugins,
  },
  {
    input: './src/index.node.ts',
    output: [
      {
        file: `${dir}/${baseName}.node.cjs.js`,
        format: 'cjs',
      },
      {
        file: `${dir}/${baseName}.node.esm.js`,
        format: 'esm',
      },
    ],
    plugins,
  },
];
