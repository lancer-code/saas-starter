import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import React from 'react'
import { Button } from '../ui/button'
import { Dot, DotIcon, Option, Settings2 } from 'lucide-react'
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu'

interface TodosOptionsProps {
    CompletedFun: () => void;
    EditFun: () => void;
    DeleteFun: () => void;
  }
  

function TodosOptions( { CompletedFun, EditFun, DeleteFun }: TodosOptionsProps ) {
  return (
    <div>
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Settings2/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Button variant={'ghost'} onClick={CompletedFun} className=" text-[14px]">Completed</Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={'ghost'} className=" text-[14px]">Edit</Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={'ghost'} onClick={DeleteFun} className=" text-[14px]">Delete</Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TodosOptions