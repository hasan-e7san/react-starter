import { Link } from "react-router-dom"

export interface PaginationProps {
  meta: any
  links: Record<string, string | null>
  url: string
}

export function Pagination({ meta, links, url }: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(meta.currentPage - 1) * meta.itemsPerPage + 1}</span> to <span className="font-medium">{meta.currentPage * meta.itemsPerPage}</span> of <span className="font-medium">{meta.totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md border shadow-sm" aria-label="Pagination">
            {Object.entries(links).map(([key, link]) =>
              link ? (
                <Link
                  key={key}
                  to={url + link.substring(link.lastIndexOf("?") + 1)}
                  className={`relative z-10 inline-flex items-center ${meta.currentPage.toString() === key ? "bg-indigo-600 text-white" : "text-black"} px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              ) : (
                <span
                  key={key}
                  className={`relative z-10 inline-flex items-center ${meta.currentPage.toString() === key ? "bg-indigo-600 text-white" : "text-black"} px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
