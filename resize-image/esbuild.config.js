const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.js'],
  outfile: './dist/index.js',
  bundle: true,
  minify: true,
  platform: 'node',
  external: ['aws-sdk'],
}).catch(() => process.exit(1));
