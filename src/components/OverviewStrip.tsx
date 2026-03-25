import { daysUntil, formatShortDate } from '../lib/date'
import type { DatePlan, EventItem, Ritual, Task } from '../store/appData'

interface OverviewStripProps {
  todayKey: string
  selectedDate: string
  focusTasks: Task[]
  backlogTasks: Task[]
  rituals: Ritual[]
  selectedPlan: DatePlan
  events: EventItem[]
}

function getUpcomingEvent(events: EventItem[]) {
  return [...events]
    .filter((event) => daysUntil(event.date) >= 0)
    .sort((left, right) => left.date.localeCompare(right.date))[0]
}

function getSelectedDateSummary(selectedDate: string, todayKey: string, plan: DatePlan, events: EventItem[]) {
  const label = selectedDate === todayKey ? '今天窗口' : formatShortDate(selectedDate)
  const note = plan.note.trim()

  if (note) {
    return {
      label,
      headline: note.length > 42 ? `${note.slice(0, 42)}…` : note,
      meta: `${plan.tasks.length} 项安排 · ${events.length} 个事件`,
    }
  }

  return {
    label,
    headline: plan.tasks.length > 0 ? `已写下 ${plan.tasks.length} 项安排` : '还没有写下具体安排',
    meta: events.length > 0 ? `含 ${events.length} 个日期事件` : '可以补一条短记或一项任务',
  }
}

export function OverviewStrip({
  todayKey,
  selectedDate,
  focusTasks,
  backlogTasks,
  rituals,
  selectedPlan,
  events,
}: OverviewStripProps) {
  const focusCompleted = focusTasks.filter((task) => task.completed).length
  const focusPending = focusTasks.length - focusCompleted
  const ritualCompleted = rituals.filter((ritual) => ritual.completionHistory[todayKey]).length
  const progressTotal = focusTasks.length + rituals.length
  const progressValue =
    progressTotal === 0 ? 0 : Math.round(((focusCompleted + ritualCompleted) / progressTotal) * 100)
  const backlogPending = backlogTasks.filter((task) => !task.completed).length
  const upcoming = getUpcomingEvent(events)
  const selectedSummary = getSelectedDateSummary(selectedDate, todayKey, selectedPlan, events)

  return (
    <section className="overview-grid" aria-label="首页总览">
      <article className="overview-card solid-panel">
        <div className="overview-head">
          <p className="eyebrow">Morning brief</p>
          <span className="overview-kicker">今日节奏</span>
        </div>
        <strong className="overview-number">{progressValue}%</strong>
        <p className="overview-title">完成进度</p>
        <div className="progress-track" aria-hidden="true">
          <span className="progress-fill" style={{ width: `${progressValue}%` }} />
        </div>
        <p className="overview-copy">
          今日重点已完成 {focusCompleted} 项，固定节律完成 {ritualCompleted} 项。
        </p>
      </article>

      <article className="overview-card solid-panel">
        <div className="overview-head">
          <p className="eyebrow">Open load</p>
          <span className="overview-kicker cool">待处理负载</span>
        </div>
        <strong className="overview-number">{focusPending + backlogPending}</strong>
        <p className="overview-title">当前仍待推进</p>
        <p className="overview-copy">
          今日重点剩余 {focusPending} 项，积压事项还有 {backlogPending} 项。
        </p>
      </article>

      <article className="overview-card solid-panel">
        <div className="overview-head">
          <p className="eyebrow">Next marker</p>
          <span className="overview-kicker warm">最近节点</span>
        </div>
        {upcoming ? (
          <>
            <strong className="overview-number">{daysUntil(upcoming.date) === 0 ? '今天' : `${daysUntil(upcoming.date)} 天`}</strong>
            <p className="overview-title">{upcoming.title}</p>
            <p className="overview-copy">
              {formatShortDate(upcoming.date)} · {upcoming.type === 'countdown' ? '倒数日' : '自定义事件'}
            </p>
          </>
        ) : (
          <>
            <strong className="overview-number">空</strong>
            <p className="overview-title">还没有下一个节点</p>
            <p className="overview-copy">可以在右侧添加倒数日、纪念日或阶段性里程碑。</p>
          </>
        )}
      </article>

      <article className="overview-card solid-panel">
        <div className="overview-head">
          <p className="eyebrow">Date window</p>
          <span className="overview-kicker green">{selectedSummary.label}</span>
        </div>
        <strong className="overview-number">{selectedPlan.tasks.length}</strong>
        <p className="overview-title">{selectedSummary.headline}</p>
        <p className="overview-copy">{selectedSummary.meta}</p>
      </article>
    </section>
  )
}
