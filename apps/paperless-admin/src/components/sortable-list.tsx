import { DragDropProvider } from "@dnd-kit/react"
import { useSortable } from "@dnd-kit/react/sortable"
import { move } from "@dnd-kit/helpers"

/**
 * SortableItem - internal wrapper, not exported.
 * Handles the useSortable hook and passes drag state down via render prop.
 */
function SortableItem({ id, index, disabled, children }) {
  const { ref, handleRef, isDragging } = useSortable({ id, index, disabled })

  return children({ ref, handleRef, isDragging })
}

/**
 * SortableList - generic reusable drag-and-drop reorderable list.
 *
 * @param {Array} items - array of data objects
 * @param {(item) => string|number} getId - returns a stable unique id for an item
 * @param {(items) => void} onReorder - called with the new ordered array after a drop
 * @param {(item, state: {ref, handleRef, isDragging}) => ReactNode} renderItem
 *        - render function for each item. Attach `state.ref` to the outer element.
 *        - If you want a dedicated drag handle instead of dragging the whole row,
 *          attach `state.handleRef` to just the handle element (e.g. a grip icon)
 *          and leave `state.ref` on the row container.
 * @param {boolean} [disabled] - disable dragging for the whole list
 * @param {string} [className] - optional class for the outer wrapper
 *
 * Usage:
 * <SortableList
 *   items={recipients}
 *   getId={(r) => r.id}
 *   onReorder={setRecipients}
 *   renderItem={(r, { ref, isDragging }) => (
 *     <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="p-2 border rounded mb-1">
 *       {r.name}
 *     </div>
 *   )}
 * />
 */
export function SortableList({
  items,
  getId,
  onReorder,
  renderItem,
  disabled = false,
  className,
}) {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return
        onReorder(move(items, event))
      }}
    >
      <div className={className}>
        {items.map((item, index) => {
          const id = getId(item)
          return (
            <SortableItem key={id} id={id} index={index} disabled={disabled}>
              {(state) => renderItem(item, state)}
            </SortableItem>
          )
        })}
      </div>
    </DragDropProvider>
  )
}

export default SortableList
