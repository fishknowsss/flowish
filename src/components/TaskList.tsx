import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

import type { Task, TaskBucket } from '../store/appData'
import { CheckIcon, DragIcon, PlusIcon, TrashIcon } from './Icon'

interface TaskListProps {
  title: string
  eyebrow: string
  bucket: Exclude<TaskBucket, 'date'>
  tasks: Task[]
  accent: 'focus' | 'backlog'
  emptyState: string
  inputPlaceholder: string
  allowClearCompleted?: boolean
  onAdd: (text: string) => void
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, text: string) => void
  onDropTask: (fromBucket: Exclude<TaskBucket, 'date'>, taskId: string, targetId: string | null) => void
  onClearCompleted?: () => void
}

interface TaskRowProps {
  task: Task
  accent: 'focus' | 'backlog'
  bucket: Exclude<TaskBucket, 'date'>
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, text: string) => void
  onDropTask: (fromBucket: Exclude<TaskBucket, 'date'>, taskId: string, targetId: string | null) => void
}

function TaskRow({
  task,
  accent,
  bucket,
  onToggle,
  onDelete,
  onUpdate,
  onDropTask,
}: TaskRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)

  const commit = () => {
    const nextValue = draft.trim()
    if (!nextValue) {
      setDraft(task.text)
      setEditing(false)
      return
    }

    onUpdate(task.id, nextValue)
    setEditing(false)
  }

  return (
    <article
      className={`task-card ${accent} ${task.completed ? 'completed' : ''}`}
      draggable={!editing}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify({ bucket, taskId: task.id }))
        event.dataTransfer.effectAllowed = 'move'
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const raw = event.dataTransfer.getData('text/plain')
        if (!raw) return

        const payload = JSON.parse(raw) as { bucket: Exclude<TaskBucket, 'date'>; taskId: string }
        onDropTask(payload.bucket, payload.taskId, task.id)
      }}
    >
      <div className="task-leading">
        <button className="check-button" type="button" onClick={() => onToggle(task.id)} aria-label="Toggle task status">
          {task.completed ? <CheckIcon width={16} height={16} /> : null}
        </button>
        <button className="drag-button" type="button" aria-label="Drag task">
          <DragIcon width={16} height={16} />
        </button>
      </div>

      <div className="task-copy" onDoubleClick={() => setEditing(true)}>
        {editing ? (
          <input
            autoFocus
            className="field inline-edit"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commit()
              if (event.key === 'Escape') {
                setDraft(task.text)
                setEditing(false)
              }
            }}
          />
        ) : (
          <>
            <p>{task.text}</p>
            <span>{task.completed ? '已完成' : '双击可编辑'}</span>
          </>
        )}
      </div>

      <button className="ghost-button danger" type="button" onClick={() => onDelete(task.id)} aria-label="Delete task">
        <TrashIcon width={16} height={16} />
      </button>
    </article>
  )
}

export function TaskList({
  title,
  eyebrow,
  bucket,
  tasks,
  accent,
  emptyState,
  inputPlaceholder,
  allowClearCompleted,
  onAdd,
  onToggle,
  onDelete,
  onUpdate,
  onDropTask,
  onClearCompleted,
}: TaskListProps) {
  const [inputValue, setInputValue] = useState('')
  const pendingCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = inputValue.trim()
    if (!value) return
    onAdd(value)
    setInputValue('')
  }

  return (
    <section className="panel solid-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="panel-meta">
          <strong>{pendingCount}</strong>
          <span>待处理</span>
        </div>
      </div>

      <form className="inline-composer glass-ridge" onSubmit={handleSubmit}>
        <input
          className="field"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={inputPlaceholder}
          aria-label={inputPlaceholder}
        />
        <button className="primary-button" type="submit" aria-label="Add task">
          <PlusIcon width={18} height={18} />
        </button>
      </form>

      <div
        className="task-list"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          const raw = event.dataTransfer.getData('text/plain')
          if (!raw) return
          const payload = JSON.parse(raw) as { bucket: Exclude<TaskBucket, 'date'>; taskId: string }
          onDropTask(payload.bucket, payload.taskId, null)
        }}
      >
        {tasks.length === 0 ? <div className="empty-card">{emptyState}</div> : null}
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            accent={accent}
            bucket={bucket}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onDropTask={onDropTask}
          />
        ))}
      </div>

      {allowClearCompleted && onClearCompleted ? (
        <div className="panel-footer">
          <button className="ghost-button" type="button" onClick={onClearCompleted}>
            清理已完成
          </button>
        </div>
      ) : null}
    </section>
  )
}
