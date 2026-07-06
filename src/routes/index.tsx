import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const pokemonQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: () =>
    fetch("https://pokeapi.co/api/v2/pokemon/ditto").then((r) => r.json()),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pokemonQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(pokemonQuery);

  return (
    <div className="p-2">
      <h3>Welcome Home {data.name}!</h3>
    </div>
  );
}
