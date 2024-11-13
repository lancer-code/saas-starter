'use client'

import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

 function Navbar() {

    const pathname = usePathname();
    //if the pathname is /sign-in or /sign-up, don't show the footer
    if (pathname === "/sign-in" || pathname === "/sign-up" || pathname === '/admin' || pathname === "/dashboard") {
      return null;
    }

  const { userId } = useAuth();

  return (
    <nav>
      <div className="flex justify-between items-center p-5 shadow-md">
        <div>
          <Image src={"next.svg"} width={125} height={50} alt="Next Logo" />
        </div>
        <div>
          <ul className="flex justify-center items-start font-medium gap-4 text-lg">
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/"}>Services</Link>
            </li>
            <li>
              <Link href={"/"}>About us</Link>
            </li>
            <li>
              <Link href={"/"}>Contact us</Link>
            </li>
          </ul>
        </div>
        {userId ? (
          <div>
            <UserButton />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Link href={"/sign-in"}>
              <Button size={"lg"} variant={"default"}>
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
