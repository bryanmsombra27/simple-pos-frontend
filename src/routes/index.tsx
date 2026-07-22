import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className=" container px-10">
      <h3 className="text-2xl font-bold my-5">Welcome Dashboard! </h3>
    </div>
  );
}
