import React from "react";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import AnnouncementDash from "@/components/AnnouncementDash";

export default function Home() {
  return (
    <main>
      <div className="w-full mx-auto min-h-screen bg-base-200">
        <Header title="Welcome to iCAA" subtitle="Alumni hub" />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Sidebar */}
            <div className="col-span-1">
              <ProfileCard />
            </div>

            {/* Main content */}
            <div className="col-span-1 md:col-span-3">
              <AnnouncementDash />
            </div>
          </div>

          {/* Quick links / platform section */}
          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-1 h-7 rounded-full bg-secondary" />
              <h1 className="text-2xl font-bold text-secondary">Quick Access</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
              <a href="/events" className="card-elevated p-5 group cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <h2 className="font-bold text-secondary">Events</h2>
                </div>
                <p className="text-sm text-base-content/60">Browse upcoming events and gatherings.</p>
              </a>

              <a href="/newsletter" className="card-elevated p-5 group cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </span>
                  <h2 className="font-bold text-secondary">Newsletter</h2>
                </div>
                <p className="text-sm text-base-content/60">Read the latest updates from iCAA.</p>
              </a>

              <a href="/candidates" className="card-elevated p-5 group cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <h2 className="font-bold text-secondary">Hire Alumni</h2>
                </div>
                <p className="text-sm text-base-content/60">Connect with talented iCAA graduates.</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
