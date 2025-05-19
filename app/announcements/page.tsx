"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Button from "@/components/Button";
import Header from "@/components/Header";
import DeleteAnnouncement from "@/components/DeleteAnnouncement";

type PostType = {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
};

async function getPost(): Promise<PostType[]> {
  const response = await fetch("/api/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

export default function AnnouncementsPage() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const initialPosts = await getPost(); // Fetch posts initially
      setPosts(initialPosts);
    };
    fetchPosts();
  }, []);

  const handleDelete = (id: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  return (
    <div className="bg-info">
      <Header title="What's New" subtitle="Announcements!" />

      <div className="container mx-auto min-h-screen flex flex-col items-center border-2 border-info-content">
        <div>
          <Link href={"/announcements/make-announcement"}>
            <Button className="mt-8 btn btn-outline btn-info-content">
              Make an Announcement
            </Button>
          </Link>
        </div>
        <div className="w-full px-4">
          {posts.map((post) => (
            <div key={post.id} className="chat chat-start mb-4">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt={`${post.author.name}'s avatar`}
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${post.author.name}`}
                  />
                </div>
              </div>
              <div className="chat-header text-xl text-info-content">
                {post.author.name}
              </div>
              <div className="chat-bubble text-info">
                <div><b>{post.title}</b></div>
                <p>{post.content}</p>
              </div>
              <div className="chat-footer text-info-content">
                <div> </div>
                <time className="text-xs opacity-50 ml-2">
                  {post.createdAt
                    ? format(new Date(post.createdAt), "PPpp")
                    : "Unknown date"}
                </time>
                <div>
                  {" "}
                  <DeleteAnnouncement
                    postID={post.id}
                    onDelete={handleDelete}
                  />{" "}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
