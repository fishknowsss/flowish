import type { Task, TaskBucket } from '../store/appData'
import { FocusIcon } from './Icon'
import { TaskList } from './TaskList'

interface FocusPanelProps {
  tasks: Task[]
  onAdd: (text: string) => void
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, text: string) => void
  onDropTask: (fromBucket: Exclude<TaskBucket, 'date'>, taskId: string, targetId: string | null) => void
}

export function FocusPanel(props: FocusPanelProps) {
  return (
    <TaskList
      title="今日重点"
      eyebrow="Today focus"
      titleIcon={<FocusIcon width={16} height={16} />}
      bucket="focus"
      tasks={props.tasks}
      accent="focus"
      emptyState="把今天最值得推进的事情放进这里，只保留真正要完成的几项。"
      inputPlaceholder="写下今天必须完成的一件事"
      onAdd={props.onAdd}
      onToggle={props.onToggle}
      onDelete={props.onDelete}
      onUpdate={props.onUpdate}
      onDropTask={props.onDropTask}
    />
  )
}
