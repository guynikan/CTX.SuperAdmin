"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Rule, Ruleset } from "@/types/configuration";

const options = ["Status"];
const operators = [
  { label: "Igual", value: 0 },
  { label: "Diferente", value: 1 },
];
const values = ["Assistido", "Não Assistido"];
const logicalOperators = [0, 1];

type FormattedData = {
  name: string;
  enabled: boolean;
  priority: number;
  ruleConditions: {
    segmentType: string;
    comparisonOperator: number;
    values: string[];
    logicalOperator: number;
  }[];
};

type Props = {
  ruleset: Ruleset;
  onChange: (updated: Ruleset) => void;
};

export default function ConfigurationRules({ onChange }: Props) {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 1,
      segmentType: "Status",
      comparisonOperator: 0,
      values: ["Assistido"],
      logicalOperator: 0,
    },
  ]);
  const [ruleName, setRuleName] = useState("Minha Regra");

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      {
        id: Date.now(),
        segmentType: "Status",
        comparisonOperator: 0,
        values: ["Assistido"],
        logicalOperator: 1,
      },
    ]);
  };

  const removeRule = (id: number) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const handleChange = (id: number, field: keyof Rule, value: string | number | string[]) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              [field]:
                field === "values" ? (Array.isArray(value) ? value : [value]) : value,
            }
          : rule
      )
    );
  };

  useEffect(() => {
    const formattedData: FormattedData = {
      name: ruleName,
      enabled: true,
      priority: 0,
      ruleConditions: rules.map(({ segmentType, comparisonOperator, values, logicalOperator }) => ({
        segmentType,
        comparisonOperator,
        values,
        logicalOperator,
      })),
    };

    onChange(formattedData);
  }, [rules, ruleName, onChange]);

  return (
    <Box sx={styles.container}>
      <TextField
        fullWidth
        label="Nome da Regra"
        size="small"
        variant="outlined"
        value={ruleName}
        onChange={(e) => setRuleName(e.target.value)}
        sx={{ marginBottom: "10px" }}
      />

      {rules.map((rule, index) => (
        <Stack key={rule.id} direction="row" spacing={2} sx={styles.row}>
          {index !== 0 && (
            <FormControl sx={{ ...styles.formControl, ...styles.smallAnd }} size="small">
              <InputLabel>Operador</InputLabel>
              <Select
                label="Operador"
                value={rule.logicalOperator}
                onChange={(e: SelectChangeEvent) =>
                  handleChange(rule.id, "logicalOperator", e.target.value)
                }
              >
                {logicalOperators.map((op) => (
                  <MenuItem key={op} value={op}>
                    {op === 1 ? 'AND' : 'OR'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl sx={styles.formControl} size="small">
            <InputLabel>Segmento</InputLabel>
            <Select
              label="Segmento"
              value={rule.segmentType}
              onChange={(e: SelectChangeEvent) =>
                handleChange(rule.id, "segmentType", e.target.value)
              }
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl} size="small">
            <InputLabel>Operador</InputLabel>
            <Select
              label="Operador"
              value={rule.comparisonOperator}
              onChange={(e: SelectChangeEvent) =>
                handleChange(rule.id, "comparisonOperator", Number(e.target.value))
              }
            >
              {operators.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl} size="small">
            <InputLabel>Valor</InputLabel>
            <Select
              label="Valor"
              value={rule.values[0]}
              onChange={(e: SelectChangeEvent) =>
                handleChange(rule.id, "values", [ e.target.value ])
              }
            >
              {values.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton onClick={() => removeRule(rule.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addRule}
        sx={{ ...styles.button, ":hover": { backgroundColor: "#e2e2e2" } }}
      >
        Adicionar Regra
      </Button>
    </Box>
  );
}



const styles = {
  container: {
    backgroundColor: "#FFF",
    borderRadius: "8px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "100%",
    maxWidth: "900px",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "20px",
    borderBottom: "2px solid #E0E0E0",
    paddingBottom: "10px",
  },
  row: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    paddingBottom: "10px",
  },
  button: {
    marginTop: "10px",
  },
  formControl: {
    minWidth: "140px",
    flex: 1,
  },
  smallAnd: {
    minWidth: "100px",
  },
};
