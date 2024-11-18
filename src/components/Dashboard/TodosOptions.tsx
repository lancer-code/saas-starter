import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dot, DotIcon, Option, Settings2 } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import TodoEditDialog from "./TodoEdit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";

interface TodosOptionsProps {
  CompletedFun: () => void;
  DeleteFun: () => void;
  EditTodos: () => void;
  todoId: string;
  title: string;
}

function TodosOptions({
  CompletedFun,
  DeleteFun,
  todoId,
  title,
  EditTodos,
}: TodosOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Settings2 />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Button
                  variant={"ghost"}
                  onClick={CompletedFun}
                  className="w-full text-[14px] text-left justify-start"
                >
                  Completed
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DialogTrigger asChild>
                  <Button variant={"ghost"} className="w-full text-[14px] text-left justify-start">
                    Edit
                  </Button>
                </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant={"ghost"}
                  onClick={DeleteFun}
                  className="w-full text-[14px] text-left justify-start"
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <TodoEditDialog
          todoId={todoId}
          title={title}
          EditTodos={EditTodos}
          isOpen={isOpen} // Pass the state directly
          onClose={() => setIsOpen(false)} // Pass the function to close
        />
      </Dialog>
    </div>
  );
}

export default TodosOptions;
