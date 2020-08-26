import defaultSettings from '@/settings'

const siteName = defaultSettings.siteName || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${siteName}`
  }
  return `${siteName}`
}
