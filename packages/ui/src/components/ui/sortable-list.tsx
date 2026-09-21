import { DragDropProvider } from "@dnd-kit/react"
import { useSortable } from "@dnd-kit/react/sortable"
import { move } from "@dnd-kit/helpers"
import type { ReactNode } from "react"

interface SortableItemProps {
  id: string
  index: number
  disabled?: boolean
  children: (state: {
    ref: (element: HTMLElement | null) => void
    handleRef: (element: HTMLElement | null) => void
    isDragging: boolean
  }) => ReactNode
}

function SortableItem({ id, index, disabled, children }: SortableItemProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index, disabled })

  return children({ ref, handleRef, isDragging })
}

interface SortableListProps<T> {
  items: T[]
  getId: (item: T) => string
  onReorder: (items: T[]) => void
  renderItem: (
    item: T,
    state: {
      ref: (element: HTMLElement | null) => void
      handleRef: (element: HTMLElement | null) => void
      isDragging: boolean
    }
  ) => ReactNode
  disabled?: boolean
  isItemDisabled?: (item: T) => boolean
  className?: string
}

export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  disabled = false,
  isItemDisabled,
  className,
}: SortableListProps<T>) {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return
        onReorder(move(items as any, event) as T[])
      }}
    >
      <div className={className}>
        {items.map((item, index) => {
          const id = getId(item)
          return (
            <SortableItem
              key={id}
              id={id}
              index={index}
              disabled={disabled || isItemDisabled?.(item)}
            >
              {(state) => renderItem(item, state)}
            </SortableItem>
          )
        })}
      </div>
    </DragDropProvider>
  )
}

export default SortableList
