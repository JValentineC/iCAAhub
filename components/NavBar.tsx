"use client";

import Link from "next/link";
// import React, { useState, useEffect } from "react";
// import { NAV_TABS } from "../config/constants";
import Button from "./Button";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Bell, Menu, Mic, Search, User } from "lucide-react";
import { NAV_TABS } from "../config/constants";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
   return (
    <div className="flex flex-col max-h-screen">
      <div className="flex gap-10 lg:gap-20 justify-between pt-2 mb-2 mx-4">
        <div
          className={`flex fap-4 items-center flex-shrink-0 ${
            showFullWidthSearch ? "hidden" : "flex"
          }`}
        >
           <Button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu />
          </Button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute top-12 left-0 bg-base-100 shadow-lg rounded-lg border border-base-300 p-4 z-50">
              <ul className="flex flex-col gap-2">
                {Object.entries(NAV_TABS).map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-base-content hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)} // Close menu on link click
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link href="/" className="text-2xl font-bold text-white">
            <Image
              src="/BlackiCAA.svg"
              alt="Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </Link>
        </div>
        <form
          className={`md:flex gap-4 flex-grow justify-center items-center ${
            showFullWidthSearch ? "flex" : "hidden"
          }`}
        >
          {showFullWidthSearch && (
            <Button
              onClick={() => setShowFullWidthSearch(false)}
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
            >
              <ArrowLeft />
            </Button>
          )}

          <div className="flex flex-grow items-center max-w-[600px]">
            <input
              type="search"
              placeholder="Search..."
              className="rounded-l-full border border-base-300 shadow-inner shadow-base-300/50 py-1 px-4 text-lg w-full focus:border-primary outline-none"
            />
            <Button className="py-2 px-4 rounded-r-full border-base-300 border border-1-0 flex-shrink-0">
              <Search />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
          >
            <Mic />
          </Button>
        </form>
        <div
          className={`flex-shrink-0 md:gap-2 items-center ${
            showFullWidthSearch ? "hidden" : "flex"
          }`}
        >
          <Button
            onClick={() => setShowFullWidthSearch(true)}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Search />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Mic />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>
          <Button variant="ghost" size="icon">
            <User />
          </Button>
        </div>
      </div>
    </div>
  );
}
