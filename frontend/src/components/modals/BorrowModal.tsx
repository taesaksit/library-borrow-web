import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2 } from "lucide-react";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dueDate: string) => void;
  bookTitle: string;
  isLoading?: boolean;
}

const BorrowModal: React.FC<BorrowModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
  isLoading = false,
}) => {
  const [dueDate, setDueDate] = useState("");

  const handleConfirm = () => {
    if (dueDate) {
      onConfirm(dueDate);
    }
  };

  const handleClose = () => {
    setDueDate("");
    onClose();
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Borrow Book
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="book-title" className="text-sm font-medium">
              Book Title
            </Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md border">
              <span className="text-sm text-gray-700">{bookTitle}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="due-date" className="text-sm font-medium">
              Due Date *
            </Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={minDate}
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Please select when you plan to return this book
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!dueDate || isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Borrowing...
                </>
              ) : (
                "Borrow Book"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowModal; 