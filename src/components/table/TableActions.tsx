import React from "react"
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react"

import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { Action, useAccessControl } from "../../rbac"

export enum ActionType {
  Edit = 1,
  View = 2,
  Delete = 3,
}

export type TableActionsProps = {
  link?: string
  showEdit?: boolean
  handleAction: (event: any, type: number) => void
  Item: any
  dontShowDeleteBtn?: boolean
  viewShowBtn?: boolean
  editLink?: boolean
  generateLink?: boolean
  children?: React.ReactNode
}

export function TableActions({
  link,
  showEdit = true,
  handleAction,
  Item,
  dontShowDeleteBtn: viewEditOnly = false,
  viewShowBtn = false,
  children,
}: TableActionsProps) {
  const handleClick = (event: any, type: number) => {
    handleAction(event, type)
  }
  const { isAllowed, getResourceByUrl } = useAccessControl()

  const AllowedDelete = link ? isAllowed(Action.Delete, getResourceByUrl(link)) : true
  const AllowedEdit = link ? isAllowed(Action.Update, getResourceByUrl(link)) : true

  return (
    <div className="flex items-center justify-center space-x-3.5 text-center">
      {viewShowBtn && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="ml-2 rounded-2xl p-1 hover:bg-gray-200">
              <EyeIcon className="h-5 w-5 text-blue-500" onClick={() => handleClick(Item, ActionType.View)} />
            </button>
          </TooltipTrigger>
          <TooltipContent>View</TooltipContent>
        </Tooltip>
      )}

      {showEdit && AllowedEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="ml-2 rounded-2xl p-1 hover:bg-gray-200">
              <PencilIcon className="h-5 w-5 text-amber-500" onClick={() => handleClick(Item, ActionType.Edit)} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
      )}

      {!viewEditOnly && AllowedDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="ml-2 rounded-2xl p-1 hover:bg-gray-200" onClick={() => handleAction(Item, ActionType.Delete)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      )}

      {children}
    </div>
  )
}
