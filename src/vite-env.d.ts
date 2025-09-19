/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_GISCUS_REPO: string;
  readonly VITE_GISCUS_REPO_ID: string;
  readonly VITE_GISCUS_CATEGORY: string;
  readonly VITE_GISCUS_CATEGORY_ID: string;
  readonly VITE_GA_TRACKING_ID?: string;
  readonly VITE_CLARITY_PROJECT_ID?: string;
  readonly VITE_APP_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
