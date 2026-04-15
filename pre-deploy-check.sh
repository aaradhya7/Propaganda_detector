#!/bin/bash

# Pre-deployment Checklist
# Run this script locally to verify everything is ready

echo "🔍 Pre-Deployment Verification Checklist"
echo "=========================================="
echo ""

# Check if required files exist
echo "📋 Checking configuration files..."
files_to_check=(
    "package.json"
    "vite.config.js"
    "backend/app.py"
    "backend/requirements.txt"
    ".env.production"
    "deploy.sh"
    "docker-compose.yml"
    "Dockerfile"
    "backend/Dockerfile"
    "SETUP_COMPLETE.md"
    "QUICK_START.md"
)

all_good=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
        all_good=false
    fi
done

echo ""
echo "📂 Checking directories..."

dirs_to_check=(
    "src"
    "backend"
    "backend/propaganda_deberta_7class"
    ".github/workflows"
)

for dir in "${dirs_to_check[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/"
    else
        echo "❌ $dir/ (MISSING)"
        all_good=false
    fi
done

echo ""
echo "🔗 Checking API endpoint in code..."

if grep -q "13.235.248.64:8000" src/components/InputSection.jsx; then
    echo "✅ API endpoint updated to 13.235.248.64"
else
    echo "⚠️  API endpoint may not be updated"
fi

echo ""
echo "📦 Checking Node modules..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "⚠️  Run: npm install"
fi

echo ""
echo "🐍 Checking Python venv..."
if [ -d "backend/venv" ]; then
    echo "✅ Python venv exists"
else
    echo "⚠️  Run: python3 -m venv backend/venv"
fi

echo ""
echo "📝 Summary:"
if [ "$all_good" = true ]; then
    echo "✅ All checks passed!"
    echo ""
    echo "Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Configure for AWS EC2 deployment'"
    echo "3. git push"
    echo "4. SSH to EC2: ssh -i key.pem ec2-user@13.235.248.64"
    echo "5. Run: git clone <repo> propaganda-detector && cd propaganda-detector && bash deploy.sh"
else
    echo "⚠️  Some checks failed. Please review the missing files above."
fi

echo ""
echo "=========================================="
echo "Generated: $(date)"
