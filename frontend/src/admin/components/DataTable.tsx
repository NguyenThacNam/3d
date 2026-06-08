import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  empty?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  actions,
  empty = 'Chưa có dữ liệu.',
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-primary-100 bg-primary-50/60">
              {columns.map((col) => (
                <th key={col.key} className={`px-5 py-3.5 font-bold text-primary-700 ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-5 py-3.5 text-right font-bold text-primary-700">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-12 text-center text-primary-500">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="border-b border-primary-50 transition-colors last:border-0 hover:bg-primary-50/40">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3.5 text-primary-800 ${col.className ?? ''}`}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  {actions && <td className="px-5 py-3.5 text-right">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
