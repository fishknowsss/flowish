import { useState } from 'react'

import { getTodayKey, toDateKey } from '../lib/date'
import type { Ritual } from '../store/appData'
import { CheckIcon, FireIcon, LoopIcon, PlusIcon, TrashIcon } from './Icon'

interface RitualsPanelProps {
  rituals: Ritual[]
  todayKey: string
  onAdd: (text: string) => void
  onToggle: (ritualId: string, dateKey: string) => void
  onDelete: (ritualId: string) => void
  onUpdate: (ritualId: string, text: string) => void
}

function computeStreak(ritual: Ritual) {
  let streak = 0
  const cursor = new Date(getTodayKey())

  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`
    if (!ritual.completionHistory[key]) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function getLast7Days(todayKey: string): string[] {
  const result: string[] = []
  const cursor = new Date(todayKey)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(cursor)
    d.setDate(d.getDate() - i)
    result.push(toDateKey(d))
  }
  return result
}

function RitualHeatmap({ ritual, todayKey }: { ritual: Ritual; todayKey: string }) {
  const days = getLast7Days(todayKey)
  return (
    <div className="ritual-heatmap">
      {days.map((day) => (
        <div
          key={day}
          className={`heatmap-cell ${ritual.completionHistory[day] ? 'filled' : ''} ${day === todayKey ? 'today' : ''}`}
          title={day}
        />
      ))}
    </div>
  )
}

export function RitualsPanel({
  rituals,
  todayKey,
  onAdd,
  onToggle,
  onDelete,
  onUpdate,
}: RitualsPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  return (
    <section className="panel solid-panel rituals-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-icon-chip ritual">
            <LoopIcon width={16} height={16} />
          </span>
          <div>
          <p className="eyebrow">Daily rituals</p>
          <h2>固定节律</h2>
          </div>
        </div>
        <div className="panel-meta">
          <strong>{rituals.filter((ritual) => ritual.completionHistory[todayKey]).length}</strong>
          <span>今日完成</span>
        </div>
      </div>

      <form
        className="inline-composer glass-ridge"
        onSubmit={(event) => {
          event.preventDefault()
          const value = inputValue.trim()
          if (!value) return
          onAdd(value)
          setInputValue('')
        }}
      >
        <input
          className="field"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="新增固定日常任务"
          aria-label="新增固定日常任务"
        />
        <button className="primary-button secondary" type="submit" aria-label="新增循环任务">
          <PlusIcon width={18} height={18} />
        </button>
      </form>

      <div className="ritual-chip-grid">
        {rituals.map((ritual) => {
          const done = Boolean(ritual.completionHistory[todayKey])
          const streak = computeStreak(ritual)

          return (
            <article key={ritual.id} className={`ritual-chip ${done ? 'done' : ''}`}>
              <div className="ritual-chip-top">
                <button
                  className={`ritual-check small ${done ? 'checked' : ''}`}
                  type="button"
                  onClick={() => onToggle(ritual.id, todayKey)}
                  aria-label="切换循环任务完成状态"
                >
                  {done ? <CheckIcon width={12} height={12} /> : null}
                </button>
                <button
                  className="ghost-button danger small"
                  type="button"
                  onClick={() => onDelete(ritual.id)}
                  aria-label="删除循环任务"
                >
                  <TrashIcon width={12} height={12} />
                </button>
              </div>
              <div
                className="ritual-chip-body"
                onDoubleClick={() => {
                  setEditingId(ritual.id)
                  setEditingValue(ritual.text)
                }}
              >
                {editingId === ritual.id ? (
                  <input
                    autoFocus
                    className="field inline-edit small"
                    value={editingValue}
                    onChange={(event) => setEditingValue(event.target.value)}
                    onBlur={() => {
                      const nextValue = editingValue.trim()
                      if (nextValue) onUpdate(ritual.id, nextValue)
                      setEditingId(null)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        const nextValue = editingValue.trim()
                        if (nextValue) onUpdate(ritual.id, nextValue)
                        setEditingId(null)
                      }
                      if (event.key === 'Escape') setEditingId(null)
                    }}
                  />
                ) : (
                  <strong className="ritual-chip-label">{ritual.text}</strong>
                )}
              </div>
              <div className="ritual-chip-footer">
                {streak > 0 ? (
                  <span className="ritual-streak">
                    <FireIcon width={11} height={11} style={{ color: streak >= 7 ? 'var(--accent-focus)' : streak >= 3 ? 'var(--accent-event)' : 'inherit' }} />
                    {streak}天
                  </span>
                ) : null}
                <RitualHeatmap ritual={ritual} todayKey={todayKey} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
