#!/usr/bin/env node

// Custom build script to bypass vite binary permission issues
const { build } = require('vite');

async function runBuild() {
  try {
    await build({
      configFile: './vite.config.js'
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

runBuild();
