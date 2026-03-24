"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type PostType = {
  id: number;
  title: string;
  content: string;
};

const AnnouncementDash = () => {
  const [latestPost, setLatestPost] = useState<PostType | null>(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const posts: PostType[] = await response.json();
        if (posts.length > 0) {
          setLatestPost(posts[0]);
        }
      } catch (error) {
        console.error("Error fetching latest post:", error);
      }
    };

    fetchLatestPost();
  }, []);

  return (
    <section className="px-4 py-2">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-7 rounded-full bg-primary" />
        <h1 className="text-2xl font-bold text-secondary">Announcements</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Executive Board Notes */}
        <div className="card-bordered-primary p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
              EB
            </span>
            <h2 className="font-bold text-secondary text-sm uppercase tracking-wider">
              Executive Board
            </h2>
          </div>
          <p className="text-base-content/70 text-sm leading-relaxed">
            Dear Alumni, as we step into the month of May, I invite each of us
            to reflect on the light we carry...
          </p>
          <Link
            href="/newsletter"
            className="link-primary inline-flex items-center gap-1 mt-4 text-sm"
          >
            Read full letter
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Latest Announcement */}
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </span>
            <h2 className="font-bold text-secondary text-sm uppercase tracking-wider">
              Latest Announcement
            </h2>
          </div>
          {latestPost ? (
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-1">
                {latestPost.title}
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed line-clamp-3">
                {latestPost.content}
              </p>
              <Link
                href="/announcements"
                className="link-primary inline-flex items-center gap-1 mt-4 text-sm"
              >
                View all announcements
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-base-content/50 text-sm">
              <span className="loading loading-dots loading-sm" />
              Loading latest announcement...
            </div>
          )}
        </div>

        {/* Spotlight */}
        <div className="card-dark p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs">
                ★
              </span>
              <h2 className="font-bold text-sm uppercase tracking-wider">
                Spotlight
              </h2>
            </div>
            <p className="text-white/60 text-sm">
              Alumni spotlight and featured stories coming soon.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-white/40 text-xs">Stay tuned for updates</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementDash;