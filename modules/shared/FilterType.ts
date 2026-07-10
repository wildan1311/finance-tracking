interface FilterPagination {
    q: string | number;
    size: number,
    page: number
}

const defaultFilter: FilterPagination = {
    q: "",
    size: 10,
    page: 1
};

export { defaultFilter, type FilterPagination}