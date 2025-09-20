const queryKeyBook = {
  GET_ALL_BOOK: "GET_ALL_BOOK",
};

const queryKeyCategory = {
  GET_ALL_CATEGORY: "GET_ALL_CATEGORY",
};

const querykeyBorrow = {
  GET_ACTIVE_BORROW :"GET_ACTIVE_BORROW",
  GET_CURRENT_BORROW: "GET_CURRENT_BORROW"
}

export const querykey = {
  ...queryKeyBook,
  ...queryKeyCategory,
  ...querykeyBorrow
};
