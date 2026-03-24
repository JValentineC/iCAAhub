import React from "react";
import Image from "next/image";

function ProfileCard() {
  const user = {
    name: "Jonathan Ramirez",
    role: "Admin",
    cycle: 53,
    avatarUrl:
      "https://res.cloudinary.com/dlyycwdgp/image/upload/v1744773737/Jonathon_Headshots_qnqbda.jpg",
  };

  return (
    <div className="card-elevated m-4 p-6 flex flex-col items-center gap-4">
      {/* Avatar */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden">
          <Image
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-base-100" />
      </div>

      {/* User Info */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-secondary">{user.name}</h2>
        <p className="text-sm text-base-content/60">{`Cycle #${user.cycle}`}</p>
        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {user.role}
        </span>
      </div>

      {/* Action */}
      <a
        href="/admin"
        className="btn btn-primary btn-sm w-full mt-1 text-white"
      >
        Admin Dashboard
      </a>
    </div>
  );
}

export default ProfileCard;
