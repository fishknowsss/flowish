import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true' && Boolean(repoName)
const appVersion = `${process.env.npm_package_version ?? 'dev'}-${process.env.GITHUB_SHA?.slice(0, 8) ?? 'local'}`

export default defineConfig({
  plugins: [react()],
  base: isGitHubPagesBuild && repoName ? `/${repoName}/` : '/',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
})
