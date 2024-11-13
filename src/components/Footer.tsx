'use client'

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  
  
  const pathname = usePathname();
  //if the pathname is /sign-in or /sign-up, don't show the footer
  if (pathname === "/sign-in" || pathname === "/sign-up" || pathname === '/admin' || pathname === "/dashboard") {
    return null;
  }

  return <div>Footer</div>;
};

export default Footer;
