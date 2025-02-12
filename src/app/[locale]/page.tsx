"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useContext } from "react";
import { DictionaryContext } from "@/i18n/DictionaryProvider";

interface ResponseData {
  name: string;
  sprites: {
    front_default: string | null;
  };
  height: number;
  weight: number;
  types: { type: { name: string } }[];
}

export default function Home() {
  const { register, handleSubmit } = useForm<{ name: string }>();
  const [searchValue, setSearchValue] = useState("");
 
  const dictionary = useContext(DictionaryContext)?.dictionary;

  const fetchData = async (): Promise<ResponseData> => {
    if (!searchValue) throw new Error("Nenhum  valor de busca especificado");
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchValue.toLowerCase()}`
    );
    if (!response.ok) {
      throw new Error("Pokémon não encontrado");
    }
    return response.json();
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["example", searchValue],
    queryFn: fetchData,
  });

  const onSubmit = (data: { name: string }) => {
    if (!data.name.trim()) return;
    setSearchValue(data.name);
    refetch();
  };

  return (
    <div>
     <h1>{dictionary?.greeting}</h1>
      <Box display="flex" flexDirection="column" alignItems="center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Nome do Pokémon"
            {...register("name", { required: true })}
            sx={{ mb: 2, mr: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Procurar
          </Button>
        </form>
        {isLoading && <CircularProgress sx={{ mt: 2 }} />}
        {isError && (
          <Typography color="error" mt={2}>
            Resultado não encontrado!
          </Typography>
        )}
        {data && data.sprites.front_default && (
          <Card sx={{ mt: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h5">{data.name?.toUpperCase()}</Typography>
              {data.sprites.front_default ? (
                <Image
                  src={data.sprites.front_default}
                  alt={data.name}
                  width={100}
                  height={100}
                  unoptimized
                />
              ) : (
                <Typography color="textSecondary">
                  Imagem não disponível
                </Typography>
              )}
              <Typography>Altura: {data.height / 10}m</Typography>
              <Typography>Peso: {data.weight / 10}kg</Typography>
              <Typography>
                Tipos: {data.types?.map((t) => t.type.name).join(", ")}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </div>
  );
}
