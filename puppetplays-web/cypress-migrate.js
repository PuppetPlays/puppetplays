const fs = require('fs');
const path = require('path');

// Create e2e directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'cypress/e2e'))) {
  fs.mkdirSync(path.join(__dirname, 'cypress/e2e'), { recursive: true });
  console.log('✅ Created cypress/e2e directory');
}

// Copy integration tests to e2e directory
const integrationDir = path.join(__dirname, 'cypress/integration');
const e2eDir = path.join(__dirname, 'cypress/e2e');

if (fs.existsSync(integrationDir)) {
  // Read all files and directories in integration
  const items = fs.readdirSync(integrationDir, { withFileTypes: true });

  items.forEach(item => {
    const sourcePath = path.join(integrationDir, item.name);
    const targetPath = path.join(e2eDir, item.name);

    if (item.isDirectory()) {
      // For directories, recursively copy
      fs.cpSync(sourcePath, targetPath, { recursive: true });
      console.log(`✅ Copied directory: ${item.name} to e2e`);
    } else {
      // For files, just copy
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied file: ${item.name} to e2e`);
    }
  });

  console.log('✅ All integration tests copied to e2e directory');
} else {
  console.log('⚠️ No integration directory found');
}

// Update support/index.js to support/e2e.js if needed
const supportIndexPath = path.join(__dirname, 'cypress/support/index.js');
const supportE2ePath = path.join(__dirname, 'cypress/support/e2e.js');

if (fs.existsSync(supportIndexPath) && !fs.existsSync(supportE2ePath)) {
  fs.copyFileSync(supportIndexPath, supportE2ePath);
  console.log('✅ Copied support/index.js to support/e2e.js');
}

console.log(
  '✅ Migration complete! You can now run Cypress with the new configuration.',
);
console.log('📝 Run: npx cypress open');
