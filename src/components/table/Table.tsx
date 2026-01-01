import React from "react"
import { ActionType, TableActions } from "./TableActions"
import { Pagination } from "./Pagination"

export type PaginationMeta = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
}

export type PaginationData = {
  meta: PaginationMeta
  links: Record<string, string | null>
  url: string
}

export type Column<T> = {
  header: React.ReactNode
  render: (row: T) => React.ReactNode
  key?: React.Key
}

export type TableProps<T> = {
  rows: T[]
  columns: Column<T>[]
  getRowId: (row: T, index: number) => string | number
  onAction?: (row: T, action: ActionType) => void
  getActionLink?: (row: T) => string
  pagination?: PaginationData
  emptyText?: string
}

function DefaultEmptyState({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td className="border p-2 text-center" colSpan={colSpan}>
        {text}
      </td>
    </tr>
  )
}

function ActionsCell<T>({ row, onAction, getActionLink }: { row: T; onAction?: (row: T, action: ActionType) => void; getActionLink?: (row: T) => string }) {
  if (!onAction) return null

  const link = getActionLink ? getActionLink(row) : undefined

  return (
    <td className="border p-2 text-center">
      <TableActions
        link={link}
        handleAction={(item, action) => onAction(item as T, action as ActionType)}
        Item={row}
      />
    </td>
  )
}

export function Table<T>({
  rows,
  columns,
  getRowId,
  onAction,
  getActionLink,
  pagination,
  emptyText = "No data available.",
}: TableProps<T>) {
  const hasActions = Boolean(onAction)
  const colCount = columns.length + (hasActions ? 1 : 0)

  return (
    <div className="space-y-4">
      <div className="overflow-auto rounded-md border">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={col.key ?? index} className="border p-2 text-left">
                  {col.header}
                </th>
              ))}
              {hasActions && <th className="border p-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <DefaultEmptyState colSpan={colCount} text={emptyText} />
            ) : (
              rows.map((row, index) => (
                <tr key={getRowId(row, index)}>
                  {columns.map((col, colIndex) => (
                    <td key={col.key ?? colIndex} className="border p-2 text-left">
                      {col.render(row)}
                    </td>
                  ))}
                  {hasActions && <ActionsCell row={row} onAction={onAction} getActionLink={getActionLink} />}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && <Pagination meta={pagination.meta} links={pagination.links} url={pagination.url} />}
    </div>
  )
}
