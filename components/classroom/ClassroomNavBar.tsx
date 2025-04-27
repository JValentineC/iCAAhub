import React, { useState } from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface ClassroomNavBarProps {
  classroomName: string;
  menuItems: MenuItem[];
}

export default function ClassroomNavBar(props: ClassroomNavBarProps) {
  const { classroomName, menuItems } = props;

  const [selected, setSelected] = useState<string>(menuItems[0]?.label || '');

  return (
    <div className="navbar flex justify-between items-center bg-base-300 rounded-box p-4">
      {/* <span className="text-lg font-bold text-blue-500">{classroomName}</span> */}
      <div className="flex flex-wrap gap-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setSelected(item.label);
              item.onClick();
            }}
            className={`btn ${selected === item.label ? 'btn-primary' : 'btn-neutral'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// export default ClassroomNavBar;
