"use client";
import AiAddTodo from "@/components/Dashboard/AiAddTodo";
import TodosOptions from "@/components/Dashboard/TodosOptions";
import { useDebounceCallback } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

import React, { useCallback, useEffect, useState } from "react";

function Dashboard() {
  const { userId } = useAuth();
  const [Rerender, setRerender] = useState(false);
  const [Todos, setTodos] = useState([
    { todoId: "5456564", title: "Honda", compeleted: false },
    { todoId: "54325", title: "Honda", compeleted: false },
    { todoId: "54542345", title: "Honda", compeleted: false }
  ]);

  const [newTodo, setNewTodo] = useState("");



  const CompletedTodoAction = useCallback(async (todoId: string) => {
    try {
      setRerender(true);
      const res = await axios.post("/api/todos/completed", { todoId });
      if (!res.ok) {
        throw new Error();
      }
    } catch (error) {
      console.log("CompletedTodo", error);
    } finally {
      setRerender(false);
    }
  }, []);

  const DeleteTodoAction = useCallback(async (todoId: string) => {
    try {
      setRerender(true);
      const res = await axios.post("/api/todos/delete-todo", { todoId });
      if (!res.ok) {
        throw new Error();
      }
      Rerender ? setRerender(false) : setRerender(true);
    } catch (error) {
      console.log("DeleteTodo", error);
    } finally {
      setRerender(false);
    }
  }, []);

  const GetTodos = useCallback(async () => {
    console.log("get Todos"  )
    try {
      setRerender(true);
      const todosList = await axios.get(
        `/api/todos/get-todos?search=${newTodo}`
      );
      setTodos(todosList.data);
    } catch (error) {
      console.log("GetTodos", error);
    } finally {
      setRerender(false);
    }
  }, []);

  const AddTodo = useCallback(async () => {
    try {
      setRerender(true);
      const res = await axios.post("/api/todos/create-todo", { title:newTodo });
      if (!res.ok) {
        throw new Error();
      }
    } catch (error) {
      console.log("AddTodo", error);
    } finally {
      setRerender(false);
    }
  }, []);

  const SearchTodos = () => {
    try {
      setRerender(true);
    } catch (error) {}
  };

  const getTodos = useDebounceCallback(GetTodos, 300);

  // useEffect(() => {
  //   GetTodos();
  //   return () => {};
  // }, [Rerender, Todos]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-slate-200">
        <div className="w-96 mx-auto md:w-[600px] lg:w-[700px]">
          <div className="flex items-center rounded-lg gap-3 shadow-md bg-white justify-center px-5 py-10">
            <Input
              onChange={(e) => {
                setNewTodo(e.target.value);
                getTodos()
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

          <div className="w-96 shadow-md mx-auto md:w-[600px] lg:w-[700px] mt-9 rounded-md bg-white px-5 py-10 overflow-y-auto max-h-[600px]">
            <div className="flex justify-between">
              <p className="text-[18px] font-medium">Total: {}</p>
              <p className="text-[18px] font-medium">Completed: {}</p>
              <p className="text-[18px] font-medium">Remaining: {}</p>
            </div>

            {/* Todos items list will be shown here */}

            <div className="flex justify-center mt-8 items-center flex-col w-full max-w-[850px] mx-auto gap-3">
              {Todos.map((todo) => (
                <div
                  key={todo.todoId}
                  className={`h-[75px] flex justify-between items-center w-full px-6  shadow-[0_4px_20px_rgba(0,0,0,0.09)] hover:shadow-[0_4px_20px_rgba(0, 0, 0, 0.1)] hover:scale-105 hover:shadow-blue-500/30 rounded-2xl bg-white/70 backdrop-blur-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100 `}
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
                        DeleteFun={() => DeleteTodoAction(todo.todoId)}
                      />
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
