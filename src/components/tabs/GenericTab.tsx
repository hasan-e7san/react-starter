import { TableActions } from "../table/TableActions"
import { TabsContent } from "../ui/tabs"

export type GenericTabProps = {
  key: string
  data: any[]
  handleAction: (item: any, type?: number) => void
}

export function GenericTab({ key, data, handleAction }: GenericTabProps) {
  return (
    <TabsContent value={key} className="mt-4">
      <div className="h-40 w-full overflow-auto rounded-md border p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border p-2 text-left pb-2">Note</th>
              <th className="border p-2 text-left pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td className="border p-2 text-left pb-2">{item.text}</td>
                <td className="flex justify-left border p-2 text-center">
                  <TableActions link="form-card" handleAction={handleAction} Item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TabsContent>
  )
}