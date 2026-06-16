"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import type { SortDirection } from "@/types/markets";

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  align?: "left" | "right";
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  initialSortKey?: keyof T;
  initialSortDir?: SortDirection;
  onRowClick?: (row: T) => void;
  caption?: string;
}

function compare<T>(a: T, b: T, key: keyof T, dir: SortDirection): number {
  const factor = dir === "asc" ? 1 : -1;
  const av = a[key];
  const bv = b[key];
  if (typeof av === "number" && typeof bv === "number") {
    return (av - bv) * factor;
  }
  return String(av).localeCompare(String(bv)) * factor;
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  initialSortKey,
  initialSortDir = "desc",
  onRowClick,
  caption,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(initialSortKey);
  const [sortDir, setSortDir] = useState<SortDirection>(initialSortDir);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [rows, sortKey, sortDir]);

  function toggleSort(key: keyof T) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <table className="w-full border-collapse text-sm">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead>
        <tr className="border-b border-edge text-xs uppercase tracking-wide text-dim">
          {columns.map((col) => {
            const active = sortKey === col.key;
            return (
              <th
                key={String(col.key)}
                scope="col"
                aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                className={`px-3 py-2 font-medium ${col.align === "right" ? "text-right" : "text-left"}`}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={`inline-flex items-center gap-1 hover:text-hi ${
                      col.align === "right" ? "flex-row-reverse" : ""
                    } ${active ? "text-accent" : ""}`}
                  >
                    {col.label}
                    {active ? (
                      sortDir === "asc" ? (
                        <ArrowUp size={12} aria-hidden="true" />
                      ) : (
                        <ArrowDown size={12} aria-hidden="true" />
                      )
                    ) : null}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={`border-b border-edge-soft ${
              onRowClick ? "cursor-pointer hover:bg-surface" : ""
            }`}
          >
            {columns.map((col) => (
              <td
                key={String(col.key)}
                className={`px-3 py-2 ${col.align === "right" ? "text-right" : "text-left"}`}
              >
                {col.render ? col.render(row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
