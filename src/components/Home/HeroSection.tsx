"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function HeroSection() {
  const router = useRouter();
  const { userId } = useAuth();

  const [Prompt, setPrompt] = useState("");

  const getGeneratedTodos = () => {
    //local storage prompt
    localStorage.setItem("Hero-Prompt", Prompt);

    if (!userId) {
      return router.push("/sign-in");
    }

    return router.push("/dashboard");
  };

  return (
    <section
      className="
    min-h-screen    bg-gradient-to-br    from-white    via-blue-50    to-purple-50    dark:from-gray-900    dark:via-gray-800    dark:to-gray-900    relative overflow-hidden
  "
    >
      {/* Gradient Overlays */}
      <div
        className="
      absolute
      inset-0
      bg-[radial-gradient(at_top_left,rgba(79,70,229,0.1)_0%,transparent_50%)]
      dark:bg-[radial-gradient(at_top_left,rgba(79,70,229,0.15)_0%,transparent_50%)]
    "
      ></div>
      <div
        className="
      absolute
      inset-0
      bg-[radial-gradient(at_bottom_right,rgba(59,130,246,0.1)_0%,transparent_50%)]
      dark:bg-[radial-gradient(at_bottom_right,rgba(59,130,246,0.15)_0%,transparent_50%)]
    "
      ></div>

      {/* Main Content Container */}
      <div
        className="
      relative
      container
      mx-auto
      px-4
      py-20
      sm:py-32
      flex
      flex-col
      items-center
      justify-center
      gap-8
      mt-12
    "
      >
        {/* Hero Title */}
        <h1
          className="
        text-4xl
        sm:text-5xl
        md:text-6xl
        font-bold
        text-center
        bg-clip-text
        text-transparent
        bg-gradient-to-r
        from-gray-900
        to-gray-600
        dark:from-white
        dark:to-gray-200
        mb-7
        
        md:h-32
      "
        >
          Smart organization, seamless productivit with{" "}
          <span
            className="
        
  bg-clip-text 
  text-transparent 
  bg-gradient-to-r 
  from-purple-600 
  via-blue-500 
  to-purple-500 
  font-extrabold
  animate-gradient
"
          >
            AI
          </span>
        </h1>

        {/* Input and Button Container */}
        <div
          className="
        relative
        flex
        flex-col
        sm:flex-row
        items-center
        justify-center
        gap-4
        sm:gap-0
        w-full
        max-w-[900px]
        mx-auto
        px-4
      "
        >
          <Input
            required
            placeholder="write what todos list you want"
            onChange={(e) => setPrompt(e.target.value)}
            className="
            rounded-full 
            w-full
            
            sm:w-[600px] 
            md:w-[600px] 
            lg:w-[700px] 
            h-16
            sm:h-16
            px-6
            bg-white/80
            backdrop-blur-sm
            border-[1.5px]
            border-transparent
            bg-clip-padding
            focus:border-[2px]
            
            focus:border-blue-500/50
            hover:border-gray-300/60
            transition-all
            duration-300
            shadow-[0_0_10px_rgba(79,70,229,0.1)]
            focus:shadow-[0_0_20px_rgba(79,70,229,0.2)]
            focus:outline-none
            placeholder:text-gray-500
            text-base
            sm:text-lg
            
            
          "
          />
          <Link
            href={"/"}
            className="
            sm:absolute 
            md:right-[110px]
            sm:right-[30px]
            w-full
            sm:w-auto
          "
          >
            <Button
              onClick={getGeneratedTodos}
              className="
              rounded-full 
              w-full
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
            >
              Create
            </Button>
          </Link>
        </div>

        {/* Optional: Add a subtitle or description */}
        <p
          className="
        mt-6
        text-gray-600
        dark:text-gray-300
        text-center
        text-lg
        max-w-[600px]
        mx-auto
        px-4
      "
        >
          Let AI help you organize your tasks and boost your productivity
        </p>

        {/* Optional: Add floating decoration elements */}
        <div
          className="
        absolute
        top-20
        left-10
        w-20
        h-20
        bg-blue-500/10
        rounded-full
        blur-xl
        animate-pulse
      "
        ></div>
        <div
          className="
        absolute
        bottom-20
        right-10
        w-32
        h-32
        bg-purple-500/10
        rounded-full
        blur-xl
        animate-pulse
      "
        ></div>
      </div>
    </section>
  );
}

export default HeroSection;
