import { TableActions, ActionType } from "./TableActions"
import { Pagination } from "./Pagination"

type SpecialDay = {
  id: number | string
  name: string
  start: string | Date
  end: string | Date
  floatingHoliday?: boolean
}

type PaginationMeta = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
}

type PaginationData = {
  meta: PaginationMeta
  links: Record<string, string | null>
  url: string
}

type SpecialDaysTableProps = {
  rows: SpecialDay[]
  onAction: (item: SpecialDay, action: ActionType) => void
  pagination?: PaginationData
}

function formatDate(value: string | Date) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString()
}

export function SpecialDaysTable({ rows, onAction, pagination }: SpecialDaysTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-auto rounded-md border">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Start</th>
              <th className="border p-2 text-left">End</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="border p-2 text-center" colSpan={4}>
                  No special days found.
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2 text-left">
                    {item.name}
                    {item.floatingHoliday ? " (Floating Holiday)" : ""}
                  </td>
                  <td className="border p-2 text-left">{formatDate(item.start)}</td>
                  <td className="border p-2 text-left">{formatDate(item.end)}</td>
                  <td className="border p-2 text-center">
                    <TableActions
                      link={`/preferences/special-days/${item.id}`}
                      handleAction={(row, action) => onAction(row as SpecialDay, action as ActionType)}
                      Item={item}
                    />
                  </td>
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

export default SpecialDaysTable
