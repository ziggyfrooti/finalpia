#!/usr/bin/env node

/**
 * Automated fix script for PIA Mobile App
 * Adds ScreenWrapper to all screen components to fix layout issues
 */

const fs = require('fs');
const path = require('path');

// List of all screen files to fix
const screens = [
  'src/screens/EmailLoginScreen.tsx',
  'src/screens/ModeSelector.tsx',
  'src/screens/ParentSetupScreen.tsx',
  'src/screens/AddChildScreen.tsx',
  'src/screens/SplashScreen.tsx',
  'src/screens/MyDayWelcome.tsx',
  'src/screens/PartsOfMyDay.tsx',
  'src/screens/CategoryHub.tsx',
  'src/screens/MomentCards.tsx',
  'src/screens/CompletionScreen.tsx',
  'src/screens/ParentHomeScreen.tsx',
  'src/screens/ParentGate.tsx',
  'src/screens/ParentSpaceHome.tsx',
  'src/screens/TodaysStory.tsx',
  'src/screens/YourDay.tsx',
  'src/screens/YourBalance.tsx',
];

const SCREEN_WRAPPER_IMPORT = "import { ScreenWrapper } from '../components/ScreenWrapper';";

function fixScreen(filePath) {
  console.log(`\nProcessing: ${filePath}`);

  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');

  // Create backup
  fs.writeFileSync(`${filePath}.backup`, content);
  console.log(`  ✓ Backup created: ${filePath}.backup`);

  // Check if already has ScreenWrapper import
  if (content.includes('ScreenWrapper')) {
    console.log(`  ⚠️  Already has ScreenWrapper - skipping`);
    return { status: 'skipped', file: filePath };
  }

  // Add import after last import statement
  const importRegex = /(import[^;]+;)(\n\n)/g;
  const imports = content.match(importRegex);
  if (imports) {
    const lastImport = imports[imports.length - 1];
    content = content.replace(lastImport, lastImport + SCREEN_WRAPPER_IMPORT + '\n');
    console.log(`  ✓ Added ScreenWrapper import`);
  }

  // Find the component return statement
  // Look for: return ( followed by <View, <ScrollView, etc.
  const returnRegex = /(\s+return\s+\(\s*\n)(\s+)(<(?:ScrollView|View))/;
  const match = content.match(returnRegex);

  if (match) {
    const indentation = match[2];

    // Add opening ScreenWrapper tag
    content = content.replace(
      returnRegex,
      `$1${indentation}<ScreenWrapper>\n${indentation}  $3`
    );

    // Find the closing tag - look for the last closing tag before );
    // This is tricky because we need to find the matching closing tag
    const lines = content.split('\n');
    let returnLineIndex = -1;
    let bracketCount = 0;
    let closingLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (returnLineIndex === -1 && line.includes('return (')) {
        returnLineIndex = i;
        bracketCount = 1;
        continue;
      }

      if (returnLineIndex !== -1) {
        // Count opening tags
        const openTags = (line.match(/<[^/][^>]*>/g) || []).length;
        // Count self-closing tags
        const selfClosing = (line.match(/<[^>]+\/>/g) || []).length;
        // Count closing tags
        const closeTags = (line.match(/<\/[^>]+>/g) || []).length;

        bracketCount += openTags - selfClosing - closeTags;

        if (bracketCount === 0 && line.trim().startsWith('</')) {
          closingLineIndex = i;
          break;
        }
      }
    }

    if (closingLineIndex !== -1) {
      // Add closing ScreenWrapper tag
      const closingLine = lines[closingLineIndex];
      const closingIndent = closingLine.match(/^(\s*)/)[1];
      lines.splice(closingLineIndex + 1, 0, `${closingIndent}</ScreenWrapper>`);
      content = lines.join('\n');
      console.log(`  ✓ Added ScreenWrapper closing tag`);
    }

    // Write the fixed content
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed successfully!`);
    return { status: 'fixed', file: filePath };
  } else {
    console.log(`  ❌ Could not find return statement - manual fix needed`);
    return { status: 'failed', file: filePath };
  }
}

// Main execution
console.log('========================================');
console.log('PIA Mobile - Automated Screen Fix');
console.log('========================================\n');
console.log('This will add SafeAreaView (ScreenWrapper) to all screens');
console.log('Backup files will be created for each screen\n');

const results = {
  fixed: [],
  skipped: [],
  failed: [],
};

screens.forEach(screen => {
  try {
    const result = fixScreen(screen);
    results[result.status].push(result.file);
  } catch (error) {
    console.error(`\n❌ Error processing ${screen}:`, error.message);
    results.failed.push(screen);
  }
});

// Summary
console.log('\n========================================');
console.log('SUMMARY');
console.log('========================================\n');
console.log(`✅ Fixed: ${results.fixed.length}`);
console.log(`⚠️  Skipped: ${results.skipped.length}`);
console.log(`❌ Failed: ${results.failed.length}`);

if (results.failed.length > 0) {
  console.log('\n⚠️  Files that need manual fixing:');
  results.failed.forEach(file => console.log(`  - ${file}`));
}

console.log('\n========================================');
console.log('✨ Done! To revert changes:');
console.log('   for f in src/screens/*.backup; do mv "$f" "${f%.backup}"; done');
console.log('========================================\n');
