"use client";
import TodosOptions from "@/components/Dashboard/TodosOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

import React, { useCallback, useState } from "react";

function Dashboard() {
  const { userId } = useAuth();
  const [Rerender, setRerender] = useState(false);
  const [Todos, setTodos] = useState([]);
  const [newTitle, setnewTitle] = useState("");

  const CompletedTodoAction = useCallback((todoId: string) => {
    try {
      axios.post("/api/todos/completed", { todoId });
      Rerender ? setRerender(false) : setRerender(true);
    } catch (error) {}
  }, []);

  const EditTodoAction = useCallback((todoId: string, title: string) => {
    try {
      axios.post("/api/todos/edit-todo", { todoId, title });
      Rerender ? setRerender(false) : setRerender(true);
    } catch (error) {}
  }, []);

  const DeleteTodoAction = useCallback((todoId: string) => {
    try {
      axios.post("/api/todos/delete-todo", { todoId });
      Rerender ? setRerender(false) : setRerender(true);
    } catch (error) {}
  }, []);

  const GetTodos = useCallback(() => {
    try {
      const todosList = axios.get("/api/todos/get-todos");
      setTodos(todosList.data);
    } catch (error) {}
  }, []);

  const SearchTodos = () => {
    console.log("Completed");
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-slate-200">
        <div className="w-96 mx-auto md:w-[600px] lg:w-[700px]">
          <div className="flex items-center rounded-lg gap-3 shadow-md bg-white justify-center px-5 py-10">
            <Input
              placeholder="Search Todos"
              className=" pl-7 text-lg h-16 rounded-full"
            />
            <Button className="w-12 h-12 md:w-16  rounded-full">
              <span className="text-[24px] mb-1">+</span>
            </Button>
          </div>

          <div className="w-96 shadow-md mx-auto md:w-[600px] lg:w-[700px] mt-9 rounded-md bg-white px-5 py-10">
            <div className="flex justify-between">
              <p className="text-[18px] font-medium">Total: {}</p>
              <p className="text-[18px] font-medium">Completed: {}</p>
              <p className="text-[18px] font-medium">Remaining: {}</p>
            </div>

            {/* Todos items list will be shown here */}

            <div className="flex justify-center mt-8 items-center flex-col w-full max-w-[900px] mx-auto gap-3">
              {Todos.map((todo) => (
                <div
                  key={todo.todoId}
                  className={`h-[75px] flex justify-between items-center w-full px-6  shadow-[0_4px_20px_rgba(0,0,0,0.09)] hover:shadow-[0_4px_20px_rgba(0, 0, 0, 0.1)] hover:scale-105 hover:shadow-blue-500/30 rounded-2xl bg-white/70 backdrop-blur-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100 `}>
                
                  {/* Todo content here */}
                  <div className="w-full flex justify-between items-center ">
                    <div
                      className={
                        todo.compeleted
                          ? "text-gray-400 line-through transition ease-in"
                          : "" }>
                      
                    
                      {todo.title}
                    </div>
                    <div>

                      <TodosOptions
                        CompletedFun={() => {
                          CompletedTodoAction(todo.todoId);
                          todo.compeleted = true; }}
                        
                        EditFun={() =>   EditTodoAction(todo.todoId, newTitle)}
                        DeleteFun={() => DeleteTodoAction(todo.todoId)}/>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
