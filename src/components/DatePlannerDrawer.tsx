import { useEffect, useMemo, useState } from 'react'

import type { DatePlan, EventItem } from '../store/appData'
import { formatLongDate } from '../lib/date'
import {
  getBaseCalendarSignal,
  getHydratedCalendarSignal,
  getRitualCompletionCount,
  type CalendarSignal,
} from '../lib/holidays'
import { CheckIcon, CloseIcon, PlusIcon, TrashIcon } from './Icon'

interface DatePlannerDrawerProps {
  dateKey: string
  plan: DatePlan
  appData: import('../store/appData').AppData
  events: EventItem[]
  onClose: () => void
  onAddTask: (text: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onUpdateTask: (taskId: string, text: string) => void
  onNoteChange: (note: string) => void
}

export function DatePlannerDrawer({
  dateKey,
  plan,
  appData,
  events,
  onClose,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onNoteChange,
}: DatePlannerDrawerProps) {
  const [inputValue, setInputValue] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [signal, setSignal] = useState<CalendarSignal | null>(null)
  const baseSignal = useMemo(() => getBaseCalendarSignal(dateKey, appData), [appData, dateKey])

  useEffect(() => {
    let active = true
    void getHydratedCalendarSignal(dateKey, appData).then((nextSignal) => {
      if (active) setSignal(nextSignal)
    })
    return () => {
      active = false
    }
  }, [dateKey, appData])

  const ritualCount = getRitualCompletionCount(appData.rituals, dateKey)
  const displaySignal = signal ?? baseSignal

  return (
    <aside className="drawer glass-panel" aria-label="Date planner drawer">
      <div className="drawer-header">
        <div>
          <p className="eyebrow">Date planner</p>
          <h2>{formatLongDate(dateKey)}</h2>
          <div className="badge-row">
            {displaySignal.holidayName ? <span className="badge warm">{displaySignal.holidayName}</span> : null}
            {displaySignal.solarTerm ? <span className="badge green">{displaySignal.solarTerm}</span> : null}
            {displaySignal.lunarFestival ? <span className="badge blue">{displaySignal.lunarFestival}</span> : null}
            {ritualCount > 0 ? <span className="badge neutral">{ritualCount} rituals done</span> : null}
          </div>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close date drawer">
          <CloseIcon width={18} height={18} />
        </button>
      </div>

      <form
        className="inline-composer glass-ridge"
        onSubmit={(event) => {
          event.preventDefault()
          const value = inputValue.trim()
          if (!value) return
          onAddTask(value)
          setInputValue('')
        }}
      >
        <input
          className="field"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="为这一天写下一条具体计划"
          aria-label="Add date task"
        />
        <button className="primary-button tertiary" type="submit" aria-label="Add date task">
          <PlusIcon width={18} height={18} />
        </button>
      </form>

      <div className="drawer-section">
        <div className="subheading">
          <span>Tasks</span>
          <strong>{plan.tasks.length}</strong>
        </div>
        <div className="date-task-list">
          {plan.tasks.length === 0 ? <div className="empty-card">这一天还没有写下具体安排。</div> : null}
          {plan.tasks.map((task) => (
            <article key={task.id} className={`task-card date ${task.completed ? 'completed' : ''}`}>
              <button className="check-button" type="button" onClick={() => onToggleTask(task.id)} aria-label="Toggle date task">
                {task.completed ? <CheckIcon width={16} height={16} /> : null}
              </button>
              <div
                className="task-copy"
                onDoubleClick={() => {
                  setEditingTaskId(task.id)
                  setEditingValue(task.text)
                }}
              >
                {editingTaskId === task.id ? (
                  <input
                    autoFocus
                    className="field inline-edit"
                    value={editingValue}
                    onChange={(event) => setEditingValue(event.target.value)}
                    onBlur={() => {
                      const nextValue = editingValue.trim()
                      if (nextValue) onUpdateTask(task.id, nextValue)
                      setEditingTaskId(null)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        const nextValue = editingValue.trim()
                        if (nextValue) onUpdateTask(task.id, nextValue)
                        setEditingTaskId(null)
                      }
                      if (event.key === 'Escape') setEditingTaskId(null)
                    }}
                  />
                ) : (
                  <>
                    <p>{task.text}</p>
                    <span>{task.completed ? '已完成' : '双击可以编辑'}</span>
                  </>
                )}
              </div>
              <button className="ghost-button danger" type="button" onClick={() => onDeleteTask(task.id)} aria-label="Delete date task">
                <TrashIcon width={16} height={16} />
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="drawer-section">
        <div className="subheading">
          <span>Events on this date</span>
          <strong>{events.length}</strong>
        </div>
        <div className="event-inline-list">
          {events.length === 0 ? <div className="empty-card subtle">这一天没有自定义事件或倒数日。</div> : null}
          {events.map((event) => (
            <div key={event.id} className="inline-pill">
              <span>{event.title}</span>
              <small>{event.type}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="drawer-section grow">
        <div className="subheading">
          <span>Quick note</span>
          <strong>{plan.note.length}/180</strong>
        </div>
        <textarea
          className="note-field"
          value={plan.note}
          maxLength={180}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="记录这一天的提醒、重点或想保留的氛围。"
        />
      </div>
    </aside>
  )
}
