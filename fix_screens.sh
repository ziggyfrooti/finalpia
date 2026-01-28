#!/bin/bash

# Function to add ScreenWrapper to a screen file
fix_screen() {
    local file=$1
    local temp_file="${file}.tmp"
    
    # Check if already has ScreenWrapper
    if grep -q "import.*ScreenWrapper" "$file"; then
        echo "✓ $file already has ScreenWrapper"
        return 0
    fi
    
    echo "Fixing $file..."
    
    # Read the file
    local content=$(cat "$file")
    
    # Add import after last import line
    awk '
    /^import/ { last_import = NR }
    { lines[NR] = $0 }
    END {
        for (i = 1; i <= NR; i++) {
            print lines[i]
            if (i == last_import && !already_imported) {
                print "import { ScreenWrapper } from '\''../components/ScreenWrapper'\'';"
                already_imported = 1
            }
        }
    }
    ' "$file" > "$temp_file"
    
    # Wrap return statement content with ScreenWrapper
    python3 << 'PYTHON'
import sys
import re

with open("'$temp_file'", "r") as f:
    content = f.read()

# Find the return statement and wrap its content
# Look for: return (\n    <SomeComponent
pattern = r'(return \(\s*\n\s*)(<[A-Z])'
replacement = r'\1<ScreenWrapper>\n      \2'
content = re.sub(pattern, replacement, content)

# Find the closing before );
# Look for: </SomeComponent>\n  );
pattern = r'(</[A-Za-z]+>)\s*\n\s*(\);)'
replacement = r'\1\n    </ScreenWrapper>\n  \2'
content = re.sub(pattern, replacement, content)

with open("'$temp_file'", "w") as f:
    f.write(content)
PYTHON
    
    mv "$temp_file" "$file"
    echo "✓ Fixed $file"
}

# Fix all screens that don't have ScreenWrapper yet
screens=(
    "src/screens/ParentSetupScreen.tsx"
    "src/screens/ParentHomeScreen.tsx"
    "src/screens/ParentSpaceHome.tsx"
    "src/screens/ParentGate.tsx"
    "src/screens/MomentCards.tsx"
    "src/screens/CompletionScreen.tsx"
    "src/screens/TodaysStory.tsx"
    "src/screens/YourDay.tsx"
    "src/screens/YourBalance.tsx"
)

for screen in "${screens[@]}"; do
    if [ -f "$screen" ]; then
        fix_screen "$screen"
    fi
done

echo ""
echo "All screens fixed!"
