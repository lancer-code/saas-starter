import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React from "react";
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
  todoId: string;
  title: string;
}

function TodosOptions({
  CompletedFun,
  DeleteFun,
  todoId,
  title,
}: TodosOptionsProps) {

  return (
    <div>
      <Dialog>
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
                  className=" text-[14px]"
                >
                  Completed
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
              <DialogTrigger asChild>
              <Button variant="ghost" className="text-[14px]">Edit</Button>
                </DialogTrigger>
                
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant={"ghost"}
                  onClick={DeleteFun}
                  className=" text-[14px]"
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <TodoEditDialog todoId={todoId} title={title} />
        </Dialog>
    </div>
  );
}

export default TodosOptions;
