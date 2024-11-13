import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useCallback, useRef, useState } from "react";

export default function TodoEditDialog(todoId: any, title: any) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);



  const EditTodoAction = useCallback(async (todoId: string, title: string) => {
    try {
      const res = await axios.post("/api/todos/edit-todo", { todoId, title });

      if (!res.ok) {
        throw new Error();
      }

      //   Rerender ? setRerender(false) : setRerender(true);
    } catch (error) {
      console.log(error);
    }
  }, []);


  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogDescription>Make changes to your todo item</DialogDescription>
      </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              ref={inputRef}
              id="new-todo"
              defaultValue={title}
              className="w-full"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isEditing}>
            {isEditing ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
    </DialogContent>
  );
}

