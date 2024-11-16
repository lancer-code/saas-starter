import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dialog } from "@radix-ui/react-dialog";
import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

interface TodoEditDialogProps {
  todoId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  EditTodos: () => void;
}

export default function TodoEditDialog({
  todoId,
  title,
  isOpen,
  onClose,
  EditTodos
}: TodoEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [EdittedTodo, setEdittedTodo] = useState(title);
  const [todosList, setTodosList] = useLocalStorage("get-todos", []);

  const EditTodoAction = useCallback(async (todoId: string, title: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/todos/edit-todo", { todoId, title });

      if (res.status != 200) {
        throw new Error();
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>Make changes to your todo item</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="w-full">
            <Input
              onChange={(e) => setEdittedTodo(e.target.value)}
              id="new-todo"
              value={EdittedTodo}
              className="w-full"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async() => {
             await EditTodoAction(todoId, EdittedTodo);
             await EditTodos()
              onClose(); // Close the dialog after saving
            }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
