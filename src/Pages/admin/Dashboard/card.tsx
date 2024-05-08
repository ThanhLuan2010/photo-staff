import React from "react";

interface CardProps {
  lable: string;
  value: number;
  onClick?: () => void;
}
const Cart: React.FC<CardProps> = ({ value, lable, onClick }) => {
  return (
    <div
      className="bg-white border-[1px]
      border-[pink] 
      h-[100px] 
      rounded-xl
      flex
      flex-col
      justify-center
      hover:bg-[pink]
      cursor-pointer
      w-full
      hover:text-white
      text-[pink]
      "
      onClick={onClick}
    >
      <div className="text-4xl font-bold text-center">{value}</div>
      <div className="mt-1 text-center">{lable}</div>
    </div>
  );
};

export default Cart;
