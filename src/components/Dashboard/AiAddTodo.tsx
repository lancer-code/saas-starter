import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "usehooks-ts";

export default function AiAddTodo() {
  const [isLoading, setisLoading] = useState(false);
  const { toast } = useToast();
  const [inputPrompt, setinputPrompt] = useLocalStorage("input-prompt", "");
  const [aiGeneratedTodos, setaiGeneratedTodos] = useLocalStorage("ai-Generated-Todos", false);
  const [isOpen, setIsOpen] = useState(false);

  const GenerateTodos = async () => {
    if (!inputPrompt) return;

    try {
      console.log(inputPrompt);
      setisLoading(true);
      const res = await axios.post("/api/todos/generate-todos", {
        prompt: inputPrompt,
      });

      if (res.status != 200) {
        throw new Error();
      }
      aiGeneratedTodos ? setaiGeneratedTodos(false) : setaiGeneratedTodos(true)
      setIsOpen(false);
      return toast({
        title: "Success",
        description: "Todos Generated Successfully",
        variant: "default",
      });
    } catch (error) {
      console.log("GeneratedTodos", error);

      toast({
        title: "Something went wrong",
        description: "Failed to Generate, Please try again later",
        variant: "destructive",
      });
    } finally {
      setisLoading(false);
    }
  };

  const handleGenerate = async () => {
    await GenerateTodos();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full h-12 text-[18px] md:w-16  rounded-full 
              sm:w-auto
              bg-gradient-to-r 
              from-[#4F46E5] 
              to-[#06B6D4] 
              text-white 
              font-semibold 
              py-5
              md:py-6
              sm:py-3 
              px-8
              text-base
              sm:text-lg
              backdrop-blur-sm 
              hover:bg-gradient-to-l 
              transition-all 
              duration-300 
              shadow-[0_0_20px_rgba(79,70,229,0.3)] 
              hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] 
              hover:scale-105
              border-none
              animate-gradient
            "
          variant="default"
        >
          Ai
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle hidden />
        <DialogDescription />
        <div className="flex  justify-start flex-col">
          <h4 className="text-lg font-semibold leading-none tracking-tight mb-10">
            AI Todos Generator
          </h4>

          <div className="w-full space-y-2">
            <Label htmlFor="prompt">Write your Prompt</Label>
            <Textarea
              required
              value={inputPrompt}
              disabled={isLoading}
              onChange={(e) => {
                setinputPrompt(e.target.value);
              }}
              className="h-[166px]"
              placeholder="Descrbe what you want..."
              id="prompt"
            />
          </div>
          <div className="w-full mt-5">
            <Button
              className="w-full h-[50px]  bg-gradient-to-r 
              from-[#4F46E5] 
              to-[#06B6D4] 
              text-white 
              font-semibold 
              py-5
              md:py-6
              sm:py-3 
              px-8
              text-base
              sm:text-lg
              backdrop-blur-sm 
              hover:bg-gradient-to-l 
              transition-all 
              duration-300 
              shadow-[0_0_20px_rgba(79,70,229,0.3)] 
              hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] 
              hover:scale-105
              border-none
              animate-gradient "
              disabled={isLoading}
              onClick={handleGenerate}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className=" ease-in animate-spin" />
              ) : (
                "Create Todos"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
