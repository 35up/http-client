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
];
