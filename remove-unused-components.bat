@echo off
echo Removing unused UI components...

REM Remove unused UI components (keeping only essential ones)
if exist "frontend\src\components\ui\alert.tsx" del "frontend\src\components\ui\alert.tsx"
if exist "frontend\src\components\ui\separator.tsx" del "frontend\src\components\ui\separator.tsx"
if exist "frontend\src\components\ui\sidebar.tsx" del "frontend\src\components\ui\sidebar.tsx"
if exist "frontend\src\components\ui\sonner.tsx" del "frontend\src\components\ui\sonner.tsx"
if exist "frontend\src\components\ui\toast.tsx" del "frontend\src\components\ui\toast.tsx"
if exist "frontend\src\components\ui\toaster.tsx" del "frontend\src\components\ui\toaster.tsx"
if exist "frontend\src\components\ui\tooltip.tsx" del "frontend\src\components\ui\tooltip.tsx"
if exist "frontend\src\components\ui\use-toast.ts" del "frontend\src\components\ui\use-toast.ts"

REM Remove unused pages
if exist "frontend\src\pages\Login.tsx" del "frontend\src\pages\Login.tsx"
if exist "frontend\src\pages\NotFound.tsx" del "frontend\src\pages\NotFound.tsx"

REM Remove unused deployment files
if exist "netlify.toml" del "netlify.toml"
if exist "vercel.json" del "vercel.json"
if exist ".github\workflows\deploy.yml" del ".github\workflows\deploy.yml"

REM Remove unused batch files
if exist "optimize-for-github.bat" del "optimize-for-github.bat"

echo Unused components removed!
pause