import { useEffect, useMemo, useState } from 'react'

import type { AppData } from '../store/appData'
import { buildCalendarGrid, getMonthLabel } from '../lib/date'
import {
  getBaseCalendarSignal,
  getHydratedCalendarSignalMap,
  type CalendarSignal,
} from '../lib/holidays'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from './Icon'

interface CalendarWidgetProps {
  viewDate: Date
  selectedDate: string
  appData: AppData
  variant?: 'sidebar' | 'stage'
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDate: (dateKey: string) => void
  onOpenStage?: () => void
}

const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarWidget({
  viewDate,
  selectedDate,
  appData,
  variant = 'sidebar',
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onOpenStage,
}: CalendarWidgetProps) {
  const cells = useMemo(() => buildCalendarGrid(viewDate), [viewDate])
  const [signalMap, setSignalMap] = useState<Record<string, CalendarSignal>>({})
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

  return (
    <section className={`panel solid-panel calendar-panel ${variant}`}>
      <div className="panel-header calendar-header">
        <div>
          <p className="eyebrow">Calendar signals</p>
          <h2>{variant === 'stage' ? 'Calendar Stage' : '月历总览'}</h2>
        </div>
        <div className="calendar-controls">
          <button className="icon-button" type="button" onClick={onPrevMonth} aria-label="Previous month">
            <ChevronLeftIcon width={18} height={18} />
          </button>
          <span className="calendar-label">{getMonthLabel(viewDate)}</span>
          <button className="icon-button" type="button" onClick={onNextMonth} aria-label="Next month">
            <ChevronRightIcon width={18} height={18} />
          </button>
          {onOpenStage ? (
            <button className="icon-button" type="button" onClick={onOpenStage} aria-label="Open calendar stage">
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
          const label = signal.solarTerm ?? signal.holidayName ?? signal.lunarFestival

          return (
            <button
              key={cell.dateKey}
              className={[
                'calendar-day',
                cell.inCurrentMonth ? '' : 'outside',
                cell.dateKey === selectedDate ? 'selected' : '',
                signal.isWeekend ? 'weekend' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={() => onSelectDate(cell.dateKey)}
            >
              <span className="day-number">{cell.day}</span>
              <span className="day-label">{label ?? ' '}</span>
              <span className="day-dots" aria-hidden="true">
                {signal.hasEvents ? <i className="dot event" /> : null}
                {signal.hasDateTasks ? <i className="dot task" /> : null}
                {signal.hasRitualCompletion ? <i className="dot ritual" /> : null}
              </span>
            </button>
          )
        })}
      </div>

      {variant === 'sidebar' ? (
        <div className="calendar-footnote glass-ridge">
          <CalendarIcon width={16} height={16} />
          <span>点击日期，展开当天计划、事件与节气信息。</span>
        </div>
      ) : null}
    </section>
  )
}
