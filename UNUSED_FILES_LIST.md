# Unused/Unnecessary Files in Energy Prediction Project

## 🗑️ Files Safe to Delete

### 1. Node Modules (Large Dependencies)
```
frontend/node_modules/          # 200+ MB
backend/node_modules/           # 100+ MB  
mobile-app/node_modules/        # 300+ MB
node_modules/                   # Root level
```

### 2. Lock Files (Auto-generated)
```
frontend/package-lock.json
frontend/yarn.lock
frontend/bun.lockb
backend/package-lock.json
mobile-app/package-lock.json
package-lock.json
yarn.lock
```

### 3. Build/Dist Directories
```
frontend/dist/
frontend/build/
backend/dist/
backend/build/
```

### 4. Cache/Temporary Files
```
.git/objects/pack/             # Git cache
frontend/.next/                # Next.js cache
frontend/.vite/                # Vite cache
*.tmp
*.log
.DS_Store                      # Mac files
Thumbs.db                      # Windows files
```

### 5. Development Cache
```
frontend/.eslintcache
backend/.eslintcache
.nyc_output/
coverage/
```

### 6. Duplicate/Redundant Files
```
install.bat                    # Duplicate functionality
start.bat                      # Use start-all.bat instead
deploy.bat                     # Use complete-deployment.bat
```

### 7. Database Files (if not needed)
```
database.db                    # SQLite file (if using PostgreSQL)
```

## 🔧 How to Clean Up

### Option 1: Run Cleanup Script
```bash
cleanup-unused-files.bat
```

### Option 2: Manual Deletion
Delete the folders/files listed above manually.

### Option 3: Git Clean
```bash
git clean -fdx
```

## 📊 Size Reduction

**Before Cleanup:** ~800MB
**After Cleanup:** ~50MB

**Files Reduced:** 90%+ size reduction

## ⚠️ Important Notes

### Keep These Files:
- `package.json` files (needed for dependencies)
- Source code in `src/` directories
- Configuration files (`.env`, `vite.config.ts`, etc.)
- README.md and documentation
- `.gitignore`

### Don't Delete:
- `ml-model/*.pkl` (trained models)
- `public/` directories (assets)
- `src/` directories (source code)
- Configuration files

## 🚀 After Cleanup

To reinstall dependencies:
```bash
# Frontend
cd frontend && npm install

# Backend  
cd backend && npm install

# Mobile App
cd mobile-app && npm install
```

## 📝 .gitignore Update

Add these to `.gitignore`:
```
node_modules/
dist/
build/
*.log
.env.local
.DS_Store
Thumbs.db
.vite/
.next/
coverage/
.nyc_output/
```