import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Short id for this build: the git commit on Vercel, a timestamp locally.
const buildId = (process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString(36)).slice(0, 7)

// Writes dist/version.json so open apps can tell when a newer deploy is live.
const versionFile = {
  name: 'version-file',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: buildId }) })
  },
}

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  plugins: [react(), versionFile],
})
