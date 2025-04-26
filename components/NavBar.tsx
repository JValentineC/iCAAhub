"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { NAV_TABS } from "../config/constants";
import { useUser } from '@auth0/nextjs-auth0';

export default function Navbar() {
  const { user, isLoading: isUserLoading } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    console.log("Dropdown state:", !isDropdownOpen); // Debugging
  };
  const closeDropdown = () => {
    setIsDropdownOpen(false); // Close dropdown
  };

  const [time, setTime] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date("2025-02-14T00:00:00"); // Predetermined start date

    const calculateElapsedTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime(); // Difference in milliseconds

      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 365;
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

      return { years, days, hours, minutes, seconds };
    };

    const interval = setInterval(() => {
      setTime(calculateElapsedTime());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="flex flex-wrap w-full">
      <div className="navbar bg-info">
        <div className="navbar-start">
          <div className="dropdown dropdown-start">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost rounded-field"
              onClick={() => {
                toggleDropdown();
                console.log("Button clicked"); // Debugging
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul className="menu sm:menu-sm md:menu-md lg:menu-lg dropdown-content bg-base-100 z-[1] mt-3 w-52 p-2 shadow">
              {Object.entries(NAV_TABS).map(([title, url], idx) => (
                <li key={idx} onClick={closeDropdown}>
                  <Link href={url}>{title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            {/* Hide countdown on small screens */}
            <div className="hidden sm:flex flex-col p-2 bg-neutral text-secondary rounded-box ">
              <span className="countdown font-mono text-3xl md:text-4xl lg:text-5xl">
                <span
                  style={{ "--value": time.years } as React.CSSProperties}
                  aria-live="polite"
                  aria-label="years"
                >
                  {time.years}
                </span>
              </span>
              years
            </div>
            <div className="hidden sm:flex flex-col p-2 bg-neutral text-secondary rounded-box ">
              <span className="countdown font-mono text-3xl md:text-4xl lg:text-5xl">
                <span
                  style={{ "--value": time.days } as React.CSSProperties}
                  aria-live="polite"
                  aria-label="days"
                >
                  {time.days}
                </span>
              </span>
              days
            </div>
            <div className="hidden sm:flex flex-col p-2 bg-neutral text-secondary rounded-box ">
              <span className="countdown font-mono text-3xl md:text-4xl lg:text-5xl">
                <span
                  style={{ "--value": time.hours } as React.CSSProperties}
                  aria-live="polite"
                  aria-label="hours"
                >
                  {time.hours}
                </span>
              </span>
              hours
            </div>
            <div className="hidden sm:flex flex-col p-2 bg-neutral text-secondary rounded-box ">
              <span className="countdown font-mono text-3xl md:text-4xl lg:text-5xl">
                <span
                  style={{ "--value": time.minutes } as React.CSSProperties}
                  aria-live="polite"
                  aria-label="minutes"
                >
                  {time.minutes}
                </span>
              </span>
              min
            </div>
            <div className="hidden sm:flex flex-col p-2 bg-neutral text-secondary rounded-box ">
              <span className="countdown font-mono text-3xl md:text-4xl lg:text-5xl">
                <span
                  style={{ "--value": time.seconds } as React.CSSProperties}
                  aria-live="polite"
                  aria-label="seconds"
                >
                  {time.seconds}
                </span>
              </span>
              sec
            </div>
          </div>
        </div>
        <div className="navbar-end">
          {isUserLoading ? (
            <></>
          ) : user ? (
            <Link className="btn mx-2" href="/api/auth/logout">
              Log Out
            </Link>
          ) : (
            <>
              <Link
                className="btn mx-2"
                href={"/api/auth/login?screen_hint=signup"}
              >
                Sign Up
              </Link>
              <Link className="btn mx-2" href={"/api/auth/login"}>
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
