import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, AlertTriangle, Clock } from "lucide-react";

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
  borrowId: string;
  isLoading?: boolean;
}

const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
  borrowId,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Return Book
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Request Book Return</p>
              <p>This will submit a return request for admin approval</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Book Details</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Title:</span> {bookTitle}
              </div>
              <div>
                <span className="font-medium">Borrow ID:</span> {borrowId}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Process Information</p>
              <p>After submission, your return will be reviewed by an admin</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant="default"
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Return Request"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnModal; 