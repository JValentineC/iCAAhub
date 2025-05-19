import React from "react";

const page = () => {
  return (
    <main className="bg-base-200">
    <div className="h-min-screen w-60">
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">events committee</div>
        <div className="collapse-content text-sm">
          Link here
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">engagement</div>
        <div className="collapse-content text-sm">
          Link here
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">didgital wjdnkljwnfo</div>
        <div className="collapse-content text-sm">
          link here
        </div>
      </div>
    </div>
    </main>
  );
};

export default page;
