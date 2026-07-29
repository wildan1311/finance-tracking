import { useCallback, useEffect, useRef, useState } from "react";
import TransactionEntity from "../../entity/TransactionEntity";
import TransactionMapper from "../../mappers/TransactionMapper";
import { PaginationResult } from "@/lib/PaginationHelper";

export type Filter = "all" | "income" | "expense";

const PAGE_SIZE = 10;

interface Props {
  initialData: PaginationResult<TransactionEntity>;
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
        const params = new URLSearchParams({
          page: String(page),
          offset: "10", // sesuaikan sama nama param size/limit kamu
          q: query,
          type: filter,
        });

        const controller = new AbortController();

        const res = await fetch(`/api/transactions?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Gagal mengambil data transaksi");

        const json = await res.json();
        const paginationData = {...json, data: json.data.map(TransactionMapper.jsonToDomain)};
        setData(paginationData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
  }, [page, query, filter]);

  useEffect(() => {
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