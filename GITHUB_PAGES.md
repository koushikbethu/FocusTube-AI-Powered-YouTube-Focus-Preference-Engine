# GitHub Pages Deployment

This project is configured for GitHub Pages deployment.

## Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to Pages section
   - Source: "GitHub Actions"

2. **Update URLs**:
   - Replace `yourusername` in `render.yaml` with your actual GitHub username
   - Update `base` in `vite.config.ts` if your repo name is different

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

## URLs After Deployment

- **Frontend**: `https://yourusername.github.io/focustube/`
- **Backend**: `https://focustube-backend.onrender.com/`

## Custom Domain (Optional)

If you have a custom domain:
1. Create `frontend/public/CNAME` file with your domain
2. Update `render.yaml` FRONTEND_URL to your custom domain
3. Configure DNS settings in your domain provider