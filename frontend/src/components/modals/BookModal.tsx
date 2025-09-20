import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBook, useUpdateBook } from "@/services/hooks/useBook";
import { useGetAllCategory } from "@/services/hooks/useCategory";
import type { TBookRes } from "@/types/book";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: TBookRes | null;
  mode: "create" | "edit";
  trigger?: React.ReactNode;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  book,
  mode,
  trigger,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    quantity: "",
    category_id: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    year?: string;
    quantity?: string;
    category_id?: string;
  }>({});

  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategory();

  // Reset form when modal opens/closes or book changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && book) {
        setFormData({
          title: book.title,
          author: book.author,
          year: book.year.toString(),
          quantity: book.quantity.toString(),
          category_id: book.category.id.toString(),
        });
      } else {
        setFormData({
          title: "",
          author: "",
          year: "",
          quantity: "",
          category_id: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, book]);

  const validateForm = () => {
    const newErrors: {
      title?: string;
      author?: string;
      year?: string;
      quantity?: string;
      category_id?: string;
    } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Please enter book title";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Book title must be at least 2 characters long";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Please enter author name";
    } else if (formData.author.trim().length < 2) {
      newErrors.author = "Author name must be at least 2 characters long";
    }

    if (!formData.year.trim()) {
      newErrors.year = "Please enter publication year";
    } else {
      const year = parseInt(formData.year);
      if (isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
        newErrors.year = "Please enter a valid publication year";
      }
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = "Please enter quantity";
    } else {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity < 1) {
        newErrors.quantity = "Quantity must be at least 1";
      }
    }

    // Check if categories are available
    if (categoriesLoading) {
      newErrors.category_id = "Please wait while categories are loading";
    } else if (categories.length === 0) {
      newErrors.category_id = "No categories available. Please create a category first.";
    } else if (!formData.category_id) {
      newErrors.category_id = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Additional check for categories
    if (categoriesLoading) {
      return;
    }

    if (categories.length === 0) {
      setErrors(prev => ({
        ...prev,
        category_id: "No categories available. Please create a category first."
      }));
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        year: parseInt(formData.year),
        quantity: parseInt(formData.quantity),
        category_id: parseInt(formData.category_id),
      };

      if (mode === "create") {
        await createBookMutation.mutateAsync(payload);
      } else if (mode === "edit" && book) {
        await updateBookMutation.mutateAsync({
          id: book.id,
          ...payload,
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category_id: value,
    }));
    
    // Clear error when user selects
    if (errors.category_id) {
      setErrors(prev => ({
        ...prev,
        category_id: undefined,
      }));
    }
  };

  const isLoading = createBookMutation.isPending || updateBookMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Create a new book entry in the library." 
              : "Update the book information."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter book title"
                className={errors.title ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                className={errors.author ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.author && (
                <p className="text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Publication Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="YYYY"
                  min="1800"
                  max={new Date().getFullYear()}
                  className={errors.year ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.year && (
                  <p className="text-sm text-red-600">{errors.year}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  min="1"
                  className={errors.quantity ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={handleSelectChange}
                disabled={isLoading || categoriesLoading}
              >
                <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
                  <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-red-600">
                  {errors.category_id}
                  {categories.length === 0 && (
                    <span className="block mt-1 text-xs text-gray-500">
                      You need to create at least one category before adding books.
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || categoriesLoading || categories.length === 0}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {mode === "create" ? "Adding..." : "Updating..."}
                </div>
              ) : categories.length === 0 ? (
                "No Categories"
              ) : (
                mode === "create" ? "Add Book" : "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 