import React, { useState } from "react";
interface DropdownProps {
  placeholder: string;
  data: any;
  onSelectItem: (item: any) => void;
  filedKey: string;
  value: string | undefined | null;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <button
          type="button"
          className="px-4 py-2 text-[pink] border-[pink] border-[1.5px] w-full rounded-md"
          onClick={toggleDropdown}
          disabled={props.disabled}
        >
          {props.value ? props.value : props?.placeholder}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-full rounded-lg shadow-lg bg-white max-h-[150px] overflow-auto z-[1000]">
            {props.data?.length > 0 &&
              props.data?.map((item: any, index: number) => {
                return (
                  <div
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 o"
                    onClick={() => {
                      closeDropdown();
                      props.onSelectItem(item);
                    }}
                    key={index}
                  >
                    {item[props.filedKey]}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
