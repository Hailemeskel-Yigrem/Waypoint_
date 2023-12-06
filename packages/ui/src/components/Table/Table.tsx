import React from 'react';
import styles from './Table.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}
export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  emptyMessage?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  emptyMessage = 'No data',
}: TableProps<T>) {
  if (data.length === 0) return <p>{emptyMessage}</p>;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} className={styles.th}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={String(row[keyField] ?? i)} className={styles.tr}>
            {columns.map((c) => (
              <td key={c.key} className={styles.td}>
                {c.render ? c.render(row) : String(row[c.key] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
