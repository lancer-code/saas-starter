"use client";
import AiAddTodo from "@/components/Dashboard/AiAddTodo";
import TodosOptions from "@/components/Dashboard/TodosOptions";
import { useDebounceCallback, useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function Dashboard() {
  const [isLoading, setisLoading] = useState(false);

  const [newTodo, setNewTodo] = useState("");
  const [TotalTodos, setTotalTodos] = useState(0);
  const [RemainingTodos, setRemainingTodos] = useState(0);
  const [CompletedTodos, setCompletedTodos] = useState(0);
  const [todosList, setTodosList, removeGetTodos] = useLocalStorage(
    "get-todos",
    []
  );


  const CompletedTodoAction = useCallback(async (todoId: string) => {
    try {
      setisLoading(true);
      const res = await axios.post("/api/todos/completed", { todoId });
      if (res.status != 200) {
        throw new Error();
      }
    } catch (error) {
      console.log("CompletedTodo", error);
    } finally {
      setisLoading(false);
    }
  }, []);

  const DeleteTodoAction = useCallback(async (todoId: string) => {
    try {
      setisLoading(true);
      const res = await axios.post("/api/todos/delete-todo", { todoId });
      if (res.status != 200) {
        throw new Error();
      }
      setTotalTodos(TotalTodos - 1);
    } catch (error) {
      console.log("DeleteTodo", error);
    } finally {
      setisLoading(false);
    }
  }, []);

  const GetTodos = useCallback(async () => {
    try {
      setisLoading(true);
      const todosList = await axios.get(
        `/api/todos/get-todos?search=${newTodo}`
      );
      setTodosList(todosList.data.todos);
      setCompletedTodos(todosList.data.totalTodosCompleted);
      setRemainingTodos(todosList.data.totalTodosRemaining);
      setTotalTodos(todosList.data.totalTodos);
    } catch (error) {
      console.log("GetTodos", error);
    } finally {
      setisLoading(false);
    }
  }, [newTodo]);

  const AddTodo = useCallback(async () => {
    try {
      setisLoading(true);
      const res = await axios.post("/api/todos/add-todo", {
        title: newTodo,
      });
      if (res.status != 200) {
        throw new Error();
      }
      setTotalTodos(TotalTodos + 1);
    } catch (error) {
      console.log("AddTodo", error);
    } finally {
      setisLoading(false);
      setNewTodo("");
    }
  }, [newTodo]);

  const getTodos = useDebounceCallback(GetTodos, 300);

  useEffect(() => {
    GetTodos();
    console.log("UDe effect");
    return () => {
      removeGetTodos();
    };
  }, [TotalTodos]);

  return (
    <>
      <div className="flex justify-center flex-col gap-20 items-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-aurora"></div>
        <h1
          className="text-4xl lg:text-6xl tracking-tighter bg-clip-text 
    text-transparent 
    bg-gradient-to-r 
    from-purple-600 
    via-blue-500 
    to-purple-500 
    font-extrabold
    animate-gradient
    relative z-10
    "
        >
          Create and Generate Todos
        </h1>
        <div className="flex flex-col justify-center items-center ">
          <div className="w-96 mx-auto md:w-[600px] lg:w-[700px]">
            <div className="flex items-center rounded-lg gap-3 shadow-md bg-white justify-center px-5 py-10">
              <Input
                value={newTodo}
                onChange={(e) => {
                  setNewTodo(e.target.value);
                  getTodos();
                }}
                placeholder="Search Todos"
                className=" pl-7 text-lg h-16 rounded-full"
              />
              <Button
                onClick={AddTodo}
                className="w-12 h-12 md:w-16  rounded-full"
              >
                <span className="text-[24px] mb-1">+</span>
              </Button>

              <AiAddTodo />
            </div>

            <div className="w-96 shadow-md mx-auto md:w-[600px] lg:w-[700px] mt-9 h-[500px] rounded-md bg-white px-5 py-10 overflow-y-auto max-h-[600px]">
              <div className="flex justify-between">
                <p className="text-[18px] font-medium">Total: {TotalTodos}</p>
                <p className="text-[18px] font-medium">
                  Completed: {CompletedTodos}
                </p>
                <p className="text-[18px] font-medium">
                  Remaining: {RemainingTodos}
                </p>
              </div>

              {/* Todos items list will be shown here */}

              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-[200px]">
                  <Loader2 className="animate-spin ease-in" />
                </div>
              ) : (
                <div className="flex justify-center mt-8 items-center flex-col w-full max-w-[850px]  mx-auto gap-3">
                  {todosList.map((todo) => (
                    <div
                      key={todo.todoId}
                    className={`h-[75px] flex justify-between items-center w-full px-6 
                    shadow-[0_4px_20px_rgba(0,0,0,0.15)] 
                    hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] 
                    hover:scale-105 
                    hover:shadow-purple-500/30 
                    rounded-2xl 
                    bg-white/10 
                    backdrop-blur-md 
                    border border-white/10 
                    transition-all duration-300`}
                    >
                      {/* Todo content here */}
                      <div className="w-full flex justify-between items-center ">
                        <div
                          className={
                            todo.compeleted
                              ? "text-gray-400 line-through transition ease-in"
                              : ""
                          }
                        >
                          {todo.title}
                        </div>
                        <div>
                          <TodosOptions
                            CompletedFun={() => {
                              CompletedTodoAction(todo.todoId);
                              todo.compeleted = true;
                            }}

                            todoId={todo.todoId}
                            title={todo.title}

                            DeleteFun={() => {
                              DeleteTodoAction(todo.todoId);
                            }}

                            EditTodos={async() => {
                             await GetTodos()
                              //Transfering through three Components
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
