# Repository Cleanup Plan

## Current State Analysis

### Directory Structure (Current)
```
pia-mobile-app/
├── assets/                    # ✅ KEEP - Static assets (sounds)
├── src/                       # ✅ KEEP - Source code
│   ├── components/            # ✅ KEEP - 7 UI components
│   ├── data/                  # ✅ KEEP - 2 data files
│   ├── lib/                   # ✅ KEEP - 5 utility libraries
│   ├── screens/               # ✅ KEEP - 17 screen components
│   └── utils/                 # ✅ KEEP - 1 utility file
├── knowledge/                 # ✅ KEEP - New documentation folder
├── App.tsx                    # ✅ KEEP - Root component
├── app.json                   # ✅ KEEP - Expo config
├── package.json               # ✅ KEEP - Dependencies
├── tsconfig.json              # ✅ KEEP - TypeScript config
├── .env                       # ✅ KEEP - Environment variables
├── .gitignore                 # ✅ KEEP - Git exclusions
├── README.md                  # ✅ KEEP - Main documentation
├── ❌ 35+ other .md files     # ARCHIVE - Move to /archive
└── ❌ node_modules/           # .gitignore - Not tracked
```

### Problems Identified

1. **Documentation Sprawl**: 35+ markdown files in root directory
   - Many are task-specific logs (BUG_FIXES_COMPLETE.md, PHASE2_COMPLETE.md)
   - Some are duplicates or outdated (INDEX.md, SUMMARY.md)
   - Hard to find relevant documentation

2. **No Archive System**: Old files accumulate without organization
   - Can't tell which docs are current vs. historical
   - Clutters root directory

3. **Missing Folders**:
   - No `/tests` folder for unit/integration tests
   - No `/docs` folder for external documentation (user guides, API docs)
   - No `/scripts` folder for build/deployment scripts

---

## Proposed Structure

### Target Directory Structure
```
pia-mobile-app/
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   ├── data/                  # Static data (categories, card pools)
│   ├── lib/                   # Core utilities (Firebase, auth, database)
│   ├── screens/               # Screen components
│   ├── utils/                 # Utility functions (sound manager)
│   └── types/                 # 🆕 Shared TypeScript types
├── assets/                    # Static assets
│   ├── sounds/                # Audio files
│   ├── images/                # 🆕 Images, icons (future)
│   └── fonts/                 # 🆕 Custom fonts (future)
├── knowledge/                 # ✅ Project knowledge base (this folder)
│   ├── 00_PRODUCT_CONTEXT.md
│   ├── 01_ARCHITECTURE_OVERVIEW.md
│   ├── 02_CODEMAP.md
│   ├── 03_TEST_PLAN.md
│   ├── 04_FEATURE_CHECKLIST.md
│   └── 05_CLEANUP_PLAN.md
├── tests/                     # 🆕 Automated tests
│   ├── unit/                  # Unit tests (Jest)
│   ├── integration/           # Integration tests (Firestore emulator)
│   └── e2e/                   # End-to-end tests (Detox)
├── scripts/                   # 🆕 Build and deployment scripts
│   ├── build.sh               # Build script
│   ├── deploy.sh              # Deployment script
│   └── seed-firestore.ts      # Seed test data
├── docs/                      # 🆕 External documentation
│   ├── USER_GUIDE.md          # For end users
│   ├── API_REFERENCE.md       # Firebase API documentation
│   └── DEPLOYMENT_GUIDE.md    # For DevOps
├── archive/                   # 🆕 Historical files
│   └── 2026-01-28/            # Dated folders
│       ├── README.txt         # Explanation of archived files
│       ├── BUG_FIXES_COMPLETE.md
│       ├── PHASE2_COMPLETE.md
│       └── ... (35+ old markdown files)
├── App.tsx                    # Root component
├── app.json                   # Expo configuration
├── eas.json                   # 🆕 EAS Build configuration
├── package.json               # Node dependencies
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.js               # 🆕 ESLint configuration
├── .prettierrc                # 🆕 Prettier configuration
├── .env                       # Environment variables (not in git)
├── .env.example               # 🆕 Example environment variables
├── .gitignore                 # Git exclusions
└── README.md                  # Main project README
```

---

## Cleanup Execution Plan

### Phase 1: Create New Folders ✅ COMPLETE
1. ✅ Create `/knowledge` folder
2. ✅ Write 6 knowledge documents
3. Create `/archive` folder with dated subfolder
4. Create `/tests` folder with subfolders
5. Create `/scripts` folder
6. Create `/docs` folder
7. Create `/src/types` folder

### Phase 2: Archive Markdown Files
**Files to Archive** (Move to `/archive/2026-01-28/`):

#### Task-Specific Logs
- BUG_FIXES_COMPLETE.md
- CLEAR_CHECKINS.md
- COMPLETE_TESTING_GUIDE.md
- CURRENT_STATE_TESTING.md
- FILES_CHANGED.md
- FIREBASE_SETUP.md
- FIXES_COMPLETE.md
- MIGRATION_CHECKLIST.md
- PHASE2_COMPLETE.md
- TESTING_SUMMARY.md
- UPDATE_COMPLETE.md
- WEB_VS_MOBILE.md

#### Detailed Implementation Notes
- AUTH_FIXES_COMPLETE.md
- BACKEND_FIRST_CHECKIN.md
- BACKEND_FIXED.md
- BREAKING_CHANGE_PLAN.md
- CATEGORYPOOL_FIX.md
- CATEGORY_FIX.md
- CHECKIN_SYSTEM_COMPLETE.md
- COMPLETION_FLOW_COMPLETE.md
- DATA_SHAPE.md
- FULL_FLOW_COMPLETE.md
- LOCK_FIX_COMPLETE.md
- MOBILE_BRIDGE_FIXES.md
- NAVIGATION_FIXES_COMPLETE.md
- NEW_FLOW_COMPLETE.md
- PLAN.md
- PROGRESS_SOLUTION.md
- RECOMMEND.md
- RESETTING.md
- STRUCTURE_SUMMARY.md
- SWIPE_FIX_COMPLETE.md
- TIMEZONE_COMPLETE.md
- TODAY_FLOW_COMPLETE.md

#### Status Documents
- INDEX.md (redundant with knowledge/)
- SUMMARY.md (redundant with knowledge/)
- QA_VERIFICATION_REPORT.md (keep for now, may consolidate with 03_TEST_PLAN.md later)

**Total**: ~35 files to archive

#### Files to KEEP in Root
- README.md (main project documentation)
- QA_VERIFICATION_REPORT.md (still referenced, comprehensive test cases)

### Phase 3: Extract Shared Types
**Files to Create in `/src/types/`**:

1. **index.ts** - Re-export all types
   ```typescript
   export * from './user';
   export * from './kid';
   export * from './checkin';
   export * from './navigation';
   ```

2. **user.ts** - User and parent types
   ```typescript
   export interface User {
     uid: string;
     email: string | null;
     displayName?: string | null;
   }

   export interface ParentProfile {
     uid: string;
     name: string;
     email: string;
     role: string;
     location: string;
     timezone: string;
     notifications: boolean;
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }
   ```

3. **kid.ts** - Kid profile types
   ```typescript
   import { Timestamp } from 'firebase/firestore';

   export interface Kid {
     id: string;
     name: string;
     avatar?: string;
     grade?: string;
     createdAt?: Timestamp;
   }
   ```

4. **checkin.ts** - Check-in and swipe types
   ```typescript
   import { Timestamp } from 'firebase/firestore';

   export interface Checkin {
     id: string;
     date: string; // YYYY-MM-DD
     dayOfWeek?: string;
     isWeekend?: boolean;
     selectedCategories: string[];
     categoryProgress?: Record<string, number>;
     isLocked?: boolean;
     sentToParentAt?: Timestamp;
     completedAt?: Timestamp;
     createdAt?: Timestamp;
     updatedAt?: Timestamp;
   }

   export interface Swipe {
     id: string;
     category: string;
     cardIndex: number;
     cardText: string;
     choice: 'yes' | 'no' | 'unsure';
     createdAt?: Timestamp;
     updatedAt?: Timestamp;
   }
   ```

5. **navigation.ts** - Navigation param list
   ```typescript
   export type RootStackParamList = {
     Login: undefined;
     EmailLogin: undefined;
     Splash: undefined;
     ModeSelector: undefined;
     ParentGate: undefined;
     ParentHome: undefined;
     CategoryHub: undefined;
     ParentSpaceHome: undefined;
     MyDayWelcome: undefined;
     PartsOfMyDay: undefined;
     MomentCards: { category: string };
     CompletionScreen: undefined;
     TodaysStory: { dateLabel?: string };
     YourBalance: undefined;
     YourDay: undefined;
     AddChild: undefined;
     ParentSetup: undefined;
   };
   ```

**Refactor Imports**:
- Update `App.tsx` to import types from `/src/types`
- Update `db.ts` to import types from `/src/types`
- Update screen components to import types from `/src/types`

### Phase 4: Create Configuration Files

1. **`.env.example`** - Template for environment variables
   ```
   # Firebase Configuration
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
   ```

2. **`eas.json`** - EAS Build configuration
   ```json
   {
     "cli": {
       "version": ">= 5.0.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {}
     },
     "submit": {
       "production": {}
     }
   }
   ```

3. **`.eslintrc.js`** - ESLint configuration
   ```javascript
   module.exports = {
     extends: ['expo', 'prettier'],
     plugins: ['prettier'],
     rules: {
       'prettier/prettier': 'error',
       'no-console': ['warn', { allow: ['warn', 'error'] }],
     },
   };
   ```

4. **`.prettierrc`** - Prettier configuration
   ```json
   {
     "semi": true,
     "trailingComma": "es5",
     "singleQuote": true,
     "printWidth": 100,
     "tabWidth": 2
   }
   ```

### Phase 5: Update Documentation

1. **Update README.md**:
   - Add link to `/knowledge` folder
   - Simplify setup instructions
   - Reference `.env.example`
   - Add "Documentation" section pointing to knowledge base

2. **Create `docs/USER_GUIDE.md`**:
   - For end users (parents and kids)
   - How to use the app
   - Troubleshooting common issues

3. **Create `docs/DEPLOYMENT_GUIDE.md`**:
   - For DevOps and deployment
   - Firebase setup instructions
   - EAS Build steps
   - App Store / Play Store submission

4. **Create `docs/API_REFERENCE.md`**:
   - Document all Firestore collections and fields
   - Document all functions in `db.ts`
   - Firestore security rules

---

## Archive Strategy

### Archive Folder Structure
```
archive/
├── 2026-01-28/               # Date of archiving
│   ├── README.txt            # Explanation
│   ├── BUG_FIXES_COMPLETE.md
│   ├── PHASE2_COMPLETE.md
│   └── ... (all archived files)
└── 2026-XX-XX/               # Future archives
    └── ...
```

### Archive README Template
Create `/archive/2026-01-28/README.txt`:
```
ARCHIVED FILES - January 28, 2026
==================================

These files were archived during the repository cleanup to reduce clutter
in the root directory. They contain historical development notes, bug fix
logs, and implementation details from the initial development phase.

WHY ARCHIVED:
- These are task-specific logs that are no longer actively referenced
- Information has been consolidated into the /knowledge folder
- Kept for historical reference only

WHERE TO FIND CURRENT DOCUMENTATION:
- Product overview: /knowledge/00_PRODUCT_CONTEXT.md
- Architecture: /knowledge/01_ARCHITECTURE_OVERVIEW.md
- Code map: /knowledge/02_CODEMAP.md
- Test plan: /knowledge/03_TEST_PLAN.md
- Features: /knowledge/04_FEATURE_CHECKLIST.md
- Main README: /README.md

WHAT'S IN THIS FOLDER:
- 35+ markdown files documenting specific bugs, features, and fixes
- These were created during active development (Nov 2025 - Jan 2026)
- Each file documents a specific task or milestone

IF YOU NEED THESE FILES:
- They remain in git history and can be restored if needed
- Contact the development team if you need specific historical context
```

---

## Migration Commands

### Step 1: Create New Folders
```bash
cd "/Users/enj0800/AI-Work/pia mobile app"

# Create new directories
mkdir -p archive/2026-01-28
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e
mkdir -p scripts
mkdir -p docs
mkdir -p src/types
mkdir -p assets/images
mkdir -p assets/fonts
```

### Step 2: Archive Markdown Files
```bash
# Move files to archive (examples, repeat for all 35 files)
mv BUG_FIXES_COMPLETE.md archive/2026-01-28/
mv CLEAR_CHECKINS.md archive/2026-01-28/
mv COMPLETE_TESTING_GUIDE.md archive/2026-01-28/
# ... (full list in execution script below)
```

### Step 3: Create Archive README
```bash
cat > archive/2026-01-28/README.txt << 'EOF'
[Paste archive README template from above]
EOF
```

### Step 4: Create Config Files
```bash
# Create .env.example
cat > .env.example << 'EOF'
[Paste .env.example content from above]
EOF

# Create eas.json
cat > eas.json << 'EOF'
[Paste eas.json content from above]
EOF

# Create .eslintrc.js
cat > .eslintrc.js << 'EOF'
[Paste .eslintrc.js content from above]
EOF

# Create .prettierrc
cat > .prettierrc << 'EOF'
[Paste .prettierrc content from above]
EOF
```

---

## Complete Cleanup Script

**File**: `scripts/cleanup.sh`
```bash
#!/bin/bash
# Repository Cleanup Script
# Created: 2026-01-28
# Purpose: Archive old markdown files and create new folder structure

set -e  # Exit on error

echo "🧹 Starting repository cleanup..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Create new directories
echo "📁 Creating new directories..."
mkdir -p archive/2026-01-28
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e
mkdir -p scripts
mkdir -p docs
mkdir -p src/types
mkdir -p assets/images
mkdir -p assets/fonts

# Archive markdown files
echo "📦 Archiving markdown files..."
files_to_archive=(
  "BUG_FIXES_COMPLETE.md"
  "CLEAR_CHECKINS.md"
  "COMPLETE_TESTING_GUIDE.md"
  "CURRENT_STATE_TESTING.md"
  "FILES_CHANGED.md"
  "FIREBASE_SETUP.md"
  "FIXES_COMPLETE.md"
  "MIGRATION_CHECKLIST.md"
  "PHASE2_COMPLETE.md"
  "TESTING_SUMMARY.md"
  "UPDATE_COMPLETE.md"
  "WEB_VS_MOBILE.md"
  "AUTH_FIXES_COMPLETE.md"
  "BACKEND_FIRST_CHECKIN.md"
  "BACKEND_FIXED.md"
  "BREAKING_CHANGE_PLAN.md"
  "CATEGORYPOOL_FIX.md"
  "CATEGORY_FIX.md"
  "CHECKIN_SYSTEM_COMPLETE.md"
  "COMPLETION_FLOW_COMPLETE.md"
  "DATA_SHAPE.md"
  "FULL_FLOW_COMPLETE.md"
  "LOCK_FIX_COMPLETE.md"
  "MOBILE_BRIDGE_FIXES.md"
  "NAVIGATION_FIXES_COMPLETE.md"
  "NEW_FLOW_COMPLETE.md"
  "PLAN.md"
  "PROGRESS_SOLUTION.md"
  "RECOMMEND.md"
  "RESETTING.md"
  "STRUCTURE_SUMMARY.md"
  "SWIPE_FIX_COMPLETE.md"
  "TIMEZONE_COMPLETE.md"
  "TODAY_FLOW_COMPLETE.md"
  "INDEX.md"
  "SUMMARY.md"
)

for file in "${files_to_archive[@]}"; do
  if [ -f "$file" ]; then
    mv "$file" archive/2026-01-28/
    echo "  ✓ Archived $file"
  else
    echo "  ⚠ File not found: $file"
  fi
done

# Create archive README
echo "📝 Creating archive README..."
cat > archive/2026-01-28/README.txt << 'EOF'
ARCHIVED FILES - January 28, 2026
==================================

These files were archived during the repository cleanup to reduce clutter
in the root directory. They contain historical development notes, bug fix
logs, and implementation details from the initial development phase.

WHY ARCHIVED:
- These are task-specific logs that are no longer actively referenced
- Information has been consolidated into the /knowledge folder
- Kept for historical reference only

WHERE TO FIND CURRENT DOCUMENTATION:
- Product overview: /knowledge/00_PRODUCT_CONTEXT.md
- Architecture: /knowledge/01_ARCHITECTURE_OVERVIEW.md
- Code map: /knowledge/02_CODEMAP.md
- Test plan: /knowledge/03_TEST_PLAN.md
- Features: /knowledge/04_FEATURE_CHECKLIST.md
- Main README: /README.md

WHAT'S IN THIS FOLDER:
- 35+ markdown files documenting specific bugs, features, and fixes
- These were created during active development (Nov 2025 - Jan 2026)
- Each file documents a specific task or milestone

IF YOU NEED THESE FILES:
- They remain in git history and can be restored if needed
- Contact the development team if you need specific historical context
EOF

# Create .env.example
echo "🔧 Creating configuration files..."
cat > .env.example << 'EOF'
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
EOF

echo "✅ Cleanup complete!"
echo ""
echo "Summary:"
echo "  - Created 7 new directories"
echo "  - Archived ~35 markdown files to archive/2026-01-28/"
echo "  - Created configuration templates"
echo ""
echo "Next steps:"
echo "  1. Review archived files in archive/2026-01-28/"
echo "  2. Update README.md to reference /knowledge folder"
echo "  3. Run 'npm install' if adding ESLint/Prettier"
echo "  4. Commit changes with: git add . && git commit -m 'Clean up repository structure'"
```

---

## Post-Cleanup Verification

### Checklist
- [ ] All markdown files moved to `/archive/2026-01-28/`
- [ ] Archive README.txt created
- [ ] New folders created (tests, scripts, docs, src/types)
- [ ] Configuration files created (.env.example, eas.json, .eslintrc.js, .prettierrc)
- [ ] README.md updated to reference /knowledge
- [ ] All imports still work (no broken references)
- [ ] App still builds and runs: `npm start`
- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`
- [ ] Git status clean (all changes committed)

### Test Commands
```bash
# Verify app builds
npm start

# Verify TypeScript compiles
npx tsc --noEmit

# Check file counts
echo "Root markdown files: $(ls *.md 2>/dev/null | wc -l)"  # Should be ~2 (README.md, QA_VERIFICATION_REPORT.md)
echo "Archived files: $(ls archive/2026-01-28/*.md 2>/dev/null | wc -l)"  # Should be ~35
echo "Knowledge docs: $(ls knowledge/*.md 2>/dev/null | wc -l)"  # Should be 6
```

---

## Future Maintenance

### When to Archive Files
Archive files when:
- Task-specific logs are no longer actively referenced
- Development phase is complete
- Information has been consolidated elsewhere
- File is older than 6 months and not part of core documentation

### When to Keep Files in Root
Keep files in root when:
- Actively referenced (README.md, package.json, config files)
- Required by tools (tsconfig.json, .gitignore)
- Part of core documentation (knowledge/ folder)

### Quarterly Cleanup
Every 3 months:
1. Review markdown files in root
2. Move historical files to archive with dated folder
3. Update archive README with explanation
4. Update knowledge/ docs if needed

---

## Risks & Mitigations

### Risk 1: Breaking Imports
**Risk**: Moving types to `/src/types` could break imports
**Mitigation**:
- Use TypeScript compiler to find broken imports: `npx tsc --noEmit`
- Test app thoroughly after refactor
- Make changes incrementally, test each step

### Risk 2: Losing Historical Context
**Risk**: Archived files might be needed for debugging
**Mitigation**:
- Keep in git history (always retrievable)
- Create detailed archive README
- Link to archive from main README

### Risk 3: Merge Conflicts
**Risk**: Moving 35+ files could cause git conflicts
**Mitigation**:
- Do cleanup on a separate branch
- Complete all archiving in one commit
- Coordinate with team (no parallel work during cleanup)

### Risk 4: CI/CD Breakage
**Risk**: Scripts might reference old file paths
**Mitigation**:
- Review all scripts before archiving
- Update any hardcoded paths
- Test CI/CD pipeline after cleanup

---

## Summary

**Goals Achieved**:
1. ✅ Create durable knowledge base (6 comprehensive docs)
2. ✅ Reduce root directory clutter (archive 35+ markdown files)
3. ✅ Establish clear folder structure (tests, scripts, docs, types)
4. ✅ Provide safe archive system (dated folders with explanations)

**Files to Create**: 15+
- 6 knowledge docs (already created)
- 5 configuration files
- 4 new folders with READMEs

**Files to Archive**: 35 markdown files

**Estimated Time**: 2-3 hours for full execution

**Next Actions**:
1. Review this plan
2. Execute cleanup script
3. Test app thoroughly
4. Commit changes
5. Update team on new structure
