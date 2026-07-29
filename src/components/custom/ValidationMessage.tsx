import type { FC } from "react";

interface ValidationMessageProps {
  message: string;
}
const ValidationMessage: FC<ValidationMessageProps> = ({ message }) => {
  return <span className="font-semibold text-red-500">{message}</span>;
};

export default ValidationMessage;
