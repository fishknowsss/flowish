import { useMemo, useState } from 'react'

import type { EventItem } from '../store/appData'
import { daysUntil } from '../lib/date'
import { CalendarIcon, PlusIcon, TrashIcon } from './Icon'

interface CountdownPanelProps {
  events: EventItem[]
  onAdd: (title: string, date: string, type: EventItem['type']) => void
  onDelete: (eventId: string) => void
}

export function CountdownPanel({ events, onAdd, onDelete }: CountdownPanelProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<EventItem['type']>('countdown')

  const sorted = useMemo(
    () => [...events].sort((left, right) => left.date.localeCompare(right.date)),
    [events],
  )

  return (
    <section className="panel solid-panel countdown-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Countdowns</p>
          <h2>纪念日与节点</h2>
        </div>
        <div className="panel-meta">
          <CalendarIcon width={18} height={18} />
        </div>
      </div>

      <form
        className="countdown-form glass-ridge"
        onSubmit={(event) => {
          event.preventDefault()
          const nextTitle = title.trim()
          if (!nextTitle || !date) return
          onAdd(nextTitle, date, type)
          setTitle('')
          setDate('')
          setType('countdown')
        }}
      >
        <input
          className="field"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="添加纪念日或倒数日"
          aria-label="添加纪念日或倒数日"
        />
        <input className="field compact-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <select className="field compact-select" value={type} onChange={(event) => setType(event.target.value as EventItem['type'])}>
          <option value="countdown">倒数日</option>
          <option value="custom">自定义</option>
        </select>
        <button className="primary-button warm" type="submit" aria-label="新增事件">
          <PlusIcon width={18} height={18} />
        </button>
      </form>

      <div className="countdown-list">
        {sorted.length === 0 ? <div className="empty-card">加几个纪念日、节点评审或假期提醒。</div> : null}
        {sorted.map((event) => {
          const remainingDays = daysUntil(event.date)
          const tone =
            remainingDays < 0
              ? 'muted'
              : remainingDays === 0
                ? 'urgent'
                : remainingDays <= 3
                  ? 'warm'
                  : 'cool'

          return (
            <article key={event.id} className="countdown-card glass-ridge">
              <div>
                <p>{event.title}</p>
                <span>
                  {event.date} · {event.type}
                </span>
              </div>
              <div className="countdown-meta">
                <strong className={tone}>
                  {remainingDays < 0
                    ? `${Math.abs(remainingDays)}d ago`
                    : remainingDays === 0
                    ? '今天'
                      : `${remainingDays}d`}
                </strong>
                <button className="ghost-button danger" type="button" onClick={() => onDelete(event.id)} aria-label="删除事件">
                  <TrashIcon width={16} height={16} />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
