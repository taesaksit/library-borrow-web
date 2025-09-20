export interface TypeDataAPI<T> {
    status: 'success' | 'error';
    message: string,
    data: T
}