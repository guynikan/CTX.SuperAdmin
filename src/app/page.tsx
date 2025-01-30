"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
interface Pokemon {
  name: string;
  url: string;
}

interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}
export default function Home() {
  const queryClient = useQueryClient();

  // Queries
  const { data } = useQuery({ queryKey: ["test"], queryFn: get });

  async function get(): Promise<PokemonApiResponse> {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return JSON.parse(JSON.stringify(json));
  }

  // Mutations
  const mutation = useMutation({
    mutationFn: post,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
  });

  async function post() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: Math.random(), title: "New Todo" });
      }, 1000);
    });
  }

  return (
    <div>
      <h1>SuperAdmin</h1>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <TextField label="Material Text Field" />
        <Box m={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => mutation.mutate()}
            sx={{ marginRight: 2 }}
          >
            Mutate
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["test"] })
            }
          >
            Invalidate Query
          </Button>
        </Box>
        {data?.results ? (
          <Box>
            {data.results.map((item: Pokemon) => (
              <Box key={item.name} p={1} m={1}>
                <Card>
                  <CardContent>{item.name}</CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </div>
  );
}
