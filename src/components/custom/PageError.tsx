import type { FC } from "react";

interface PageErrorProps {}
const PageError: FC<PageErrorProps> = ({}) => {
  return (
    <div className="relative">
      <img
        src="404.svg"
        className="object-cover bg-center h-dvh w-full"
      />
      <div className="absolute top-60 left-120 space-y-5 text-center rounded-2xl p-10 shadow-2xl bg-white">
        <h1 className="text-center font-semibold text-4xl">
          Algo malio sal 🤕
        </h1>
        <span className=" mt-10 block">
          No se encontro la página o el contenido no esta disponible por el
          momento.
        </span>
        <span> Le recomiendo se ponga datos pobre.</span>
      </div>
    </div>
  );
};

export default PageError;
