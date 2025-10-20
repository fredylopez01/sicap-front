import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserRoundPen } from "lucide-react";
import { EditUserForm } from "./EditUserForm";
import { User } from "@/interfaces";
import { useState } from "react";

interface props {
  user: User;
  onUserUpdated: (updatedRecord: User) => void;
}

export function EditUserModal({ user, onUserUpdated }: props) {
  const [isOpen, setIsOpen] = useState(false);
  const handleUpdateSuccess = (updatedRecord: User) => {
    onUserUpdated(updatedRecord);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          className="btn-record-details"
          size={"default"}
        >
          <UserRoundPen />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-auto record-datails-modal-container">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            {user.names + " " + user.lastNames}
          </DialogDescription>
        </DialogHeader>

        <EditUserForm
          initialUserData={user}
          onUserUpdated={handleUpdateSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
