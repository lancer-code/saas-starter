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
}

export default function TodoEditDialog({
  todoId,
  title,
  isOpen,
  onClose,
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
      // if (res.status === 200) {
      //   // Update the specific todo in the todosList
      //   const updatedTodos = todosList.map(
      //     (todo: any) =>
      //       todo.id === todoId
      //         ? { ...todo, title: title } // Update the todo that matches the ID
      //         : todo // Keep other todos unchanged
      //   );

      //   setTodosList(updatedTodos); // Update local storage
      // } else {
      //   throw new Error("Failed to update todo");
      // }
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
            onClick={() => {
              EditTodoAction(todoId, EdittedTodo);
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
