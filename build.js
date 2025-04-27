import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

// This script is used to build the project for production deployment to Vercel
async function buildProject() {
  console.log('🔨 Starting build process for Vercel deployment...');
  
  try {
    // 1. Build the client-side application
    console.log('📦 Building client application...');
    await runCommand('vite build');
    
    // 2. Compile TypeScript server files
    console.log('🖥️  Compiling server TypeScript files...');
    await runCommand('tsc --project tsconfig.server.json');
    
    // 3. Copy necessary files to the dist folder
    console.log('📋 Copying configuration files...');
    await runCommand('cp vercel.json dist/');
    await runCommand('cp .env.production dist/');
    
    // 4. Create a production package.json in the dist folder
    console.log('📝 Creating production package.json...');
    await copyPackageJson();
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Helper function to run shell commands
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        return reject(error);
      }
      console.log(stdout);
      resolve();
    });
  });
}

// Helper function to copy and modify package.json for production
async function copyPackageJson() {
  try {
    // Read the vercel-package.json file
    const packageJsonContent = await fs.readFile('vercel-package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Modify for production use
    packageJson.scripts = {
      start: 'NODE_ENV=production node server/index.js'
    };
    
    // Remove devDependencies
    delete packageJson.devDependencies;
    
    // Write to the dist folder
    await fs.writeFile(
      path.join('dist', 'package.json'), 
      JSON.stringify(packageJson, null, 2),
      'utf8'
    );
    
    console.log('📄 Production package.json created successfully');
  } catch (error) {
    console.error('Error creating production package.json:', error);
    throw error;
  }
}

// Execute the build process
buildProject();