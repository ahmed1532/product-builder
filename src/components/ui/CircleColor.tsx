import  { HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<HTMLSpanElement>{
  color: string;

}

const CircleColor = ({ color,...rest }: IProps) => {
  return (
    <span
      className={`w-5 h-5 rounded-full cursor-pointer block mb-1`}{...rest}
      style={{ backgroundColor: color }}
    />
  );
};

export default CircleColor;
