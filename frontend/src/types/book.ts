export interface TBookRes {
    title: string
    author: string
    year: number
    quantity: number
    available_quantity: number
    id: number
    category: Category
  }
  
  export interface Category {
    id: number
    name: string
  }

  export interface TBookCreate {
    title: string
    author: string
    year: number
    quantity: number
    category_id: number
  }

  export interface TBookUpdate {
    id: number
    title: string
    author: string
    year: number
    quantity: number
    category_id: number
  }
  