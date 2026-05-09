# SECURITY FIX: Remove .env files from git history

# This script removes .env files that were accidentally committed
# Run this AFTER you've regenerated all API keys

# Install git-filter-repo if not installed
# pip install git-filter-repo

# Remove .env files from entire git history
git filter-repo --path backend/.env --invert-paths --force
git filter-repo --path frontend/.env.development --invert-paths --force

# After running this:
# 1. Force push to GitHub: git push origin --force --all
# 2. Tell all collaborators to re-clone the repository
# 3. Update .env files with NEW API keys (never commit them)

echo "Git history cleaned. Now:"
echo "1. Regenerate ALL API keys in Google Cloud Console"
echo "2. Update backend/.env with NEW keys"
echo "3. Force push: git push origin --force --all"
echo "4. NEVER commit .env files again"
