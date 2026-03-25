import { useEffect, useMemo, useState } from 'react'

import { buildCalendarGrid, getMonthLabel, formatShortDate } from '../lib/date'
import {
  getBaseCalendarSignal,
  getHydratedCalendarSignalMap,
  type CalendarSignal,
} from '../lib/holidays'
import type { AppData, DatePlan } from '../store/appData'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon } from './Icon'

interface CalendarWidgetProps {
  viewDate: Date
  selectedDate: string
  todayKey: string
  appData: AppData
  variant?: 'sidebar' | 'stage'
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDate: (dateKey: string) => void
  onOpenStage?: () => void
}

const weekLabels = ['一', '二', '三', '四', '五', '六', '日']

export function CalendarWidget({
  viewDate,
  selectedDate,
  todayKey,
  appData,
  variant = 'sidebar',
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onOpenStage,
}: CalendarWidgetProps) {
  const cells = useMemo(() => buildCalendarGrid(viewDate), [viewDate])
  const [signalMap, setSignalMap] = useState<Record<string, CalendarSignal>>({})
  const [popupDate, setPopupDate] = useState<string | null>(null)

  const baseSignalMap = useMemo(
    () =>
      Object.fromEntries(
        cells.map((cell) => [cell.dateKey, getBaseCalendarSignal(cell.dateKey, appData)]),
      ),
    [appData, cells],
  )

  useEffect(() => {
    let active = true
    void getHydratedCalendarSignalMap(
      cells.map((cell) => cell.dateKey),
      appData,
    ).then((nextSignals) => {
      if (active) setSignalMap(nextSignals)
    })

    return () => {
      active = false
    }
  }, [appData, cells])

  const handleDayClick = (dateKey: string) => {
    onSelectDate(dateKey)
    if (variant === 'sidebar') {
      setPopupDate(dateKey === popupDate ? null : dateKey)
    }
  }

  const popupSignal = popupDate ? (signalMap[popupDate] ?? baseSignalMap[popupDate]) : null
  const popupPlan: DatePlan | null = popupDate
    ? appData.datePlans[popupDate] ?? { date: popupDate, tasks: [], note: '' }
    : null

  return (
    <section className={`panel solid-panel calendar-panel ${variant}`}>
      <div className="panel-header calendar-header">
        <div className="panel-title">
          <span className="panel-icon-chip calendar">
            <CalendarIcon width={16} height={16} />
          </span>
          <div>
          <p className="eyebrow">Calendar signals</p>
          <h2>{variant === 'stage' ? '全屏月历' : '月历总览'}</h2>
          </div>
        </div>
        <div className="calendar-controls">
          <button className="icon-button" type="button" onClick={onPrevMonth} aria-label="上一月">
            <ChevronLeftIcon width={18} height={18} />
          </button>
          <span className="calendar-label">{getMonthLabel(viewDate)}</span>
          <button className="icon-button" type="button" onClick={onNextMonth} aria-label="下一月">
            <ChevronRightIcon width={18} height={18} />
          </button>
          {onOpenStage ? (
            <button className="icon-button" type="button" onClick={onOpenStage} aria-label="展开全屏月历">
              <ExpandIcon width={18} height={18} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className={`calendar-grid ${variant}`}>
        {cells.map((cell) => {
          const signal = signalMap[cell.dateKey] ?? baseSignalMap[cell.dateKey]
          const isSelected = cell.dateKey === selectedDate
          const isToday = cell.dateKey === todayKey
          const hasDots = signal.hasEvents || signal.hasDateTasks || signal.hasRitualCompletion
          const label = variant === 'stage'
            ? (signal.solarTerm ?? signal.holidayName ?? signal.lunarFestival)
            : null

          return (
            <button
              key={cell.dateKey}
              className={[
                'calendar-day',
                cell.inCurrentMonth ? '' : 'outside',
                isSelected ? 'selected' : '',
                isToday ? 'today' : '',
                isSelected && isToday ? 'today-selected' : '',
                signal.isWeekend ? 'weekend' : '',
                variant === 'sidebar' ? 'compact' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={() => handleDayClick(cell.dateKey)}
              aria-pressed={isSelected}
            >
              <span className="day-number-row">
                <span className="day-number">{cell.day}</span>
                {isToday ? <span className="day-flag">今</span> : null}
              </span>
              {label ? <span className="day-label">{label}</span> : null}
              {hasDots ? (
                <span className="day-dots" aria-hidden="true">
                  {signal.hasEvents ? <i className="dot event" /> : null}
                  {signal.hasDateTasks ? <i className="dot task" /> : null}
                  {signal.hasRitualCompletion ? <i className="dot ritual" /> : null}
                </span>
              ) : null}
              {variant === 'stage' ? (
                <StageTaskPreview plan={appData.datePlans[cell.dateKey]} />
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Inline Date Agenda Popup */}
      {variant === 'sidebar' && popupDate && popupSignal && popupPlan ? (
        <div className="date-popup glass-ridge">
          <div className="date-popup-header">
            <strong>{formatShortDate(popupDate)}</strong>
            <button className="icon-button compact" type="button" onClick={() => setPopupDate(null)} aria-label="关闭">
              <CloseIcon width={14} height={14} />
            </button>
          </div>
          <div className="date-popup-body">
            {popupSignal.solarTerm ? <span className="badge neutral">{popupSignal.solarTerm}</span> : null}
            {popupSignal.holidayName ? <span className="badge warm">{popupSignal.holidayName}</span> : null}
            {popupSignal.lunarFestival ? <span className="badge green">{popupSignal.lunarFestival}</span> : null}
            {popupPlan.tasks.length > 0 ? (
              <div className="date-popup-tasks">
                {popupPlan.tasks.map((task) => (
                  <div key={task.id} className="date-popup-task-item">
                    <span className={task.completed ? 'completed' : ''}>{task.text}</span>
                  </div>
                ))}
              </div>
            ) : null}
            {!popupSignal.solarTerm && !popupSignal.holidayName && !popupSignal.lunarFestival && popupPlan.tasks.length === 0 ? (
              <span className="date-popup-empty">暂无节气、节假日或安排</span>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function StageTaskPreview({ plan }: { plan?: DatePlan }) {
  if (!plan || plan.tasks.length === 0) return null
  return (
    <span className="stage-task-preview">
      {plan.tasks.slice(0, 2).map((task) => (
        <span key={task.id} className={`stage-task-title ${task.completed ? 'completed' : ''}`}>
          {task.text}
        </span>
      ))}
      {plan.tasks.length > 2 ? <span className="stage-task-more">+{plan.tasks.length - 2}</span> : null}
    </span>
  )
}
