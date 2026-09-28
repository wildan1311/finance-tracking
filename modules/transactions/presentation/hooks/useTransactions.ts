import { useCallback, useEffect, useRef, useState } from "react";
import Transaction from "@/modules/transactions/domain/entities/Transaction";
import { PaginationResult } from "@/modules/shared/domain/PaginationHelper";

export type Filter = "all" | "income" | "expense";

/** Sent as the `offset` query param, which the API maps to the sheet page size. */
const PAGE_SIZE = 10;

interface Props {
  initialData: PaginationResult<Transaction>;
}

export default function useTransactions({ initialData }: Props) {
  const firstRender = useRef(true);

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // NOTE: the API currently honours only `page` + `offset`. `q` and `type`
      // are sent for when server-side search lands — see AGENTS.md.
      const params = new URLSearchParams({
        page: String(page),
        offset: String(PAGE_SIZE),
        q: query,
        type: filter,
      });

      const res = await fetch(`/api/transactions?${params}`);

      if (!res.ok) throw new Error("Gagal mengambil data transaksi");

      const json = await res.json();
      setData({ ...json, data: json.data.map((row: any) => Transaction.fromJson(row)) });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, query, filter]);

  useEffect(() => {
    // The server component already supplied page 1 as `initialData`.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleFilter = (value: Filter) => {
    setFilter(value);
    setPage(1);
  };

  return {
    data,
    loading,
    error,

    page,
    setPage,

    query,
    filter,

    handleSearch,
    handleFilter,

    refresh: fetchTransactions,
  };
}
