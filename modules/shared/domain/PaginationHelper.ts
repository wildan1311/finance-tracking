export interface PaginationResult<T>{
    size: number;
    page: number;
    totalPage: number;
    data: T[];
}

class PaginationHelper {
    static calculateTotalPages(totalData: number, pageSize: number) {
        return Math.ceil(totalData / pageSize);
    }

    static prepareDataForPagination<T>(page: number, pageSize: number, totalData: number, data: T[]) {
        return {
            size: pageSize,
            page,
            totalPage: this.calculateTotalPages(totalData, pageSize),
            data
        };
    }
}

export default PaginationHelper;