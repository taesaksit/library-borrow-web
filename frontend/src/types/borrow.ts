export interface TActiveBorrowResponse {
    borrow_id: string
    book: string
    user: string
    borrow_date: string
    due_date: string
    return_date: string
    status: string
  }
  
  export interface TReturnBorrowResponse {
    borrow_id: number
    book: string
    return_date: string
    status: string
  }

  export interface TBorrowBookRequest {
    book_id: number
    due_date: string
  }

  export interface TBorrowBookResponse {
    borrow_id: number
    book: string
    borrow_date: string
    due_date: string
    status: string
  }

  export interface TReturnBookRequest {
    borrow_id: string
  }

  export interface TReturnBookResponse {
    borrow_id: string
    book: string
    return_date: string
    status: string
  }