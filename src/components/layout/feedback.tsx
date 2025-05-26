import { PlusCircle } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import FeedbackForm from "../forms/feedback-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const Feedback = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={true} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle strokeWidth={1.75} size={22} />
            Write Your Feedback
          </DialogTitle>
          <DialogDescription>
            Your thoughts help us make this platform better for everyone
            learning English. Share your ideas, suggestions, or report any
            issues — we&apos;re listening!
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm />
      </DialogContent>
    </Dialog>
  );
};

export default Feedback;
