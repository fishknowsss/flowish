import type { AppData } from '../store/appData'
import { CloseIcon } from './Icon'
import { CalendarWidget } from './CalendarWidget'

interface CalendarStageProps {
  appData: AppData
  todayKey: string
  selectedDate: string
  viewDate: Date
  onClose: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDate: (dateKey: string) => void
}

export function CalendarStage({
  appData,
  todayKey,
  selectedDate,
  viewDate,
  onClose,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: CalendarStageProps) {
  return (
    <div className="overlay stage-overlay" role="presentation" onClick={onClose}>
      <div
        className="stage-sheet glass-panel"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="icon-button stage-close" type="button" onClick={onClose} aria-label="关闭全屏月历">
          <CloseIcon width={18} height={18} />
        </button>
        <CalendarWidget
          appData={appData}
          todayKey={todayKey}
          selectedDate={selectedDate}
          viewDate={viewDate}
          variant="stage"
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          onSelectDate={onSelectDate}
        />
      </div>
    </div>
  )
}
