"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Paper, Button, TextField, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { Home } from "@mui/icons-material";

const schema = yup.object().shape({
  title: yup.string().required("O título é obrigatório"),
  description: yup.string().optional(),
  type: yup.string().required("O tipo de configuração é obrigatório"),
});

const configurationTypes = [
  { id: "1", name: "Formulário" },
  { id: "2", name: "Workflow" },
  { id: "3", name: "Relatório" },
];

export default function ConfigurationPage() {

  const { dictionary } = useDictionary();
  
  const [activeTab, setActiveTab] = useState(0);
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId");
  const moduleName = searchParams.get("name");

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
    },
  });

  const selectedType = watch("type"); // 🔥 Acompanha o valor do select

  const onSubmit = (data) => {
    const payload = {
      ...data,
      moduleId,
    };
    console.log("Form Submitted", payload);
  };

  const fields = [
    { id: 1, name: "Matrícula", type: "Texto" },
    { id: 2, name: "Data de nascimento", type: "Data" },
    { id: 3, name: "Gênero", type: "Select" },
    { id: 4, name: "PPE", type: "Radio" },
  ];

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Home fontSize="small" sx={{ color: "#757575" }} />
          <Typography variant="subtitle2" sx={{ color: "#757575" }}>Home / {dictionary?.rootName} / {moduleName} </Typography>
        </Box>  
        <Typography variant="h6" mt={2}>Nova configuração</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Título" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Descrição (opcional)" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                <InputLabel>Tipo de Configuração</InputLabel>
                <Select {...field} label="Tipo de Configuração">
                  {configurationTypes.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>Salvar</Button>
        </form>
      </Paper>

      {/* 🔥 Só exibe as abas se o tipo selecionado for "Formulário" */}
      {selectedType === "1" && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>Formulário</Typography>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="CAMPOS" />
            <Tab label="SEÇÕES" />
            <Tab label="REGRAS" />
          </Tabs>

          {activeTab === 0 && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nome</strong></TableCell>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell><strong>Ações</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>
                        <IconButton color="primary"><EditIcon /></IconButton>
                        <IconButton color="error"><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Button variant="outlined" sx={{ mt: 2, float: "right" }}>Novo Campo</Button>
        </Paper>
      )}
    </>
  );
}
