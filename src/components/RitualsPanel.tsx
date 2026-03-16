import { useState } from 'react'

import type { Ritual } from '../store/appData'
import { getTodayKey } from '../lib/date'
import { CheckIcon, PlusIcon, TrashIcon } from './Icon'

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
    <section className="panel solid-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Daily rituals</p>
          <h2>固定节律</h2>
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

      <div className="ritual-grid">
        {rituals.map((ritual) => {
          const done = Boolean(ritual.completionHistory[todayKey])
          const streak = computeStreak(ritual)

          return (
            <article key={ritual.id} className={`ritual-card ${done ? 'done' : ''}`}>
              <button
                className={`ritual-check ${done ? 'checked' : ''}`}
                type="button"
                onClick={() => onToggle(ritual.id, todayKey)}
                aria-label="切换循环任务完成状态"
              >
                {done ? <CheckIcon width={16} height={16} /> : null}
              </button>
              <div
                className="ritual-copy"
                onDoubleClick={() => {
                  setEditingId(ritual.id)
                  setEditingValue(ritual.text)
                }}
              >
                {editingId === ritual.id ? (
                  <input
                    autoFocus
                    className="field inline-edit"
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
                  <>
                    <strong>{ritual.text}</strong>
                    <span>{done ? '今日已完成' : '点击打卡'} · 连续 {streak} 天</span>
                  </>
                )}
              </div>
              <button className="ghost-button danger" type="button" onClick={() => onDelete(ritual.id)} aria-label="删除循环任务">
                <TrashIcon width={16} height={16} />
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
