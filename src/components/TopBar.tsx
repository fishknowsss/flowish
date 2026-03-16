import { useState } from 'react'

import { formatTopbarDate } from '../lib/date'
import type { Preferences } from '../store/appData'
import {
  DownloadIcon,
  InstallIcon,
  SettingsIcon,
  SparkIcon,
  ThemeIcon,
  UploadIcon,
  VolumeIcon,
} from './Icon'
import { QuoteBar } from './QuoteBar'

interface TopBarProps {
  todayKey: string
  quoteText: string
  quoteAuthor: string
  preferences: Preferences
  installAvailable: boolean
  onNextQuote: () => void
  onManageQuotes: () => void
  onToggleSound: () => void
  onToggleTheme: () => void
  onToggleMotion: () => void
  onToggleQuoteMode: () => void
  onToggleCalendarDefault: () => void
  onExport: () => void
  onImport: () => void
  onInstall: () => void
}

export function TopBar({
  todayKey,
  quoteText,
  quoteAuthor,
  preferences,
  installAvailable,
  onNextQuote,
  onManageQuotes,
  onToggleSound,
  onToggleTheme,
  onToggleMotion,
  onToggleQuoteMode,
  onToggleCalendarDefault,
  onExport,
  onImport,
  onInstall,
}: TopBarProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <header className="topbar glass-panel">
      <div className="brand-block">
        <div className="brand-glyph">
          <SparkIcon width={18} height={18} />
        </div>
        <div>
          <p className="eyebrow">Liquid Dashboard Pro</p>
          <h1>1.0 Web</h1>
          <p className="topbar-date">{formatTopbarDate(todayKey)}</p>
        </div>
      </div>

      <QuoteBar
        quoteText={quoteText}
        quoteAuthor={quoteAuthor}
        onNext={onNextQuote}
        onManage={onManageQuotes}
      />

      <div className="toolbar">
        <button className="icon-button" type="button" onClick={onToggleSound} aria-label="Toggle sound">
          <VolumeIcon width={18} height={18} muted={!preferences.soundEnabled} />
        </button>
        <button className="icon-button" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
          <ThemeIcon width={18} height={18} />
        </button>
        <button className="icon-button" type="button" onClick={onExport} aria-label="Export data">
          <DownloadIcon width={18} height={18} />
        </button>
        <button className="icon-button" type="button" onClick={onImport} aria-label="Import data">
          <UploadIcon width={18} height={18} />
        </button>
        {installAvailable ? (
          <button className="icon-button" type="button" onClick={onInstall} aria-label="Install app">
            <InstallIcon width={18} height={18} />
          </button>
        ) : null}
        <div className="settings-wrap">
          <button
            className="icon-button"
            type="button"
            onClick={() => setShowSettings((value) => !value)}
            aria-label="Open preferences"
            aria-expanded={showSettings}
          >
            <SettingsIcon width={18} height={18} />
          </button>
          {showSettings ? (
            <div className="settings-popover glass-panel">
              <button className="toggle-row" type="button" onClick={onToggleTheme}>
                <span>Theme</span>
                <strong>{preferences.theme === 'pearl' ? 'Pearl' : 'Mist'}</strong>
              </button>
              <button className="toggle-row" type="button" onClick={onToggleMotion}>
                <span>Motion</span>
                <strong>{preferences.reducedMotion ? 'Reduce' : 'Spring'}</strong>
              </button>
              <button className="toggle-row" type="button" onClick={onToggleQuoteMode}>
                <span>Quote mode</span>
                <strong>{preferences.quoteMode === 'daily' ? 'Daily' : 'Random'}</strong>
              </button>
              <button className="toggle-row" type="button" onClick={onToggleCalendarDefault}>
                <span>Calendar stage on load</span>
                <strong>{preferences.calendarExpandedDefault ? 'On' : 'Off'}</strong>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
