"use client";

import { useCallback, useEffect, useState } from "react";
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

const SEGMENT_OPTIONS = ["Status"];
const OPERATOR_OPTIONS = [
  { label: "Igual", value: 0 },
  { label: "Diferente", value: 1 },
];
const VALUE_OPTIONS = ["Assistido", "Não Assistido"];
const LOGICAL_OPERATORS = [
  { label: "OR", value: 0 },
  { label: "AND", value: 1 },
];

const initialRule = (): Rule => ({
  id: Date.now(),
  segmentType: "Status",
  comparisonOperator: 0,
  values: ["Assistido"],
  logicalOperator: 1,
});

type Props = {
  ruleset: Ruleset;
  onChange: (updated: Ruleset) => void;
};

export default function ConfigurationRules({ onChange }: Props) {
  const [rules, setRules] = useState<Rule[]>([initialRule()]);
  const [ruleName, setRuleName] = useState("Minha Regra");

  const addRule = () => setRules((prev) => [...prev, initialRule()]);

  const removeRule = (id: number) =>
    setRules((prev) => prev.filter((rule) => rule.id !== id));

  const updateRule = (id: number, field: keyof Rule, value: any) => {
    setRules((prevRules) => {
      return prevRules.map((rule) => {
        if (rule.id !== id) return rule;
  
        let updatedValue: any;
  
        if (field === "values") {
          updatedValue = Array.isArray(value) ? value : [value];
        } else {
          updatedValue = value;
        }
  
        return {
          ...rule,
          [field]: updatedValue,
        };
      });
    });
  };

  const formatRuleset = useCallback((): Ruleset => ({
    name: ruleName,
    enabled: true,
    priority: 0,
    ruleConditions: rules,
  }), [rules, ruleName]);
  
  useEffect(() => {
    onChange(formatRuleset());
  }, [formatRuleset, onChange]);
 
  return (
    <Box sx={styles.container}>
      <TextField
        fullWidth
        label="Nome da Regra"
        size="small"
        value={ruleName}
        onChange={(e) => setRuleName(e.target.value)}
        sx={{ mb: 2 }}
      />

      {rules.map((rule, index) => (
        <Stack key={rule.id} direction="row" spacing={2} sx={styles.row}>
          {index !== 0 && (
            <FormControl sx={{ ...styles.formControl, ...styles.smallAnd }} size="small">
              <InputLabel id={`operator-label-${rule.id}`} >Operador</InputLabel>
              
              <Select
                labelId={`operator-label-${rule.id}`}
                label="Operador"
                value={rule.logicalOperator}
                onChange={(e: SelectChangeEvent<number>) =>
                  updateRule(rule.id, "logicalOperator", Number(e.target.value))
                }
              >
                {LOGICAL_OPERATORS.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl sx={styles.formControl} size="small">
            <InputLabel id={`segment-label-${rule.id}`}>Segmento</InputLabel>
            <Select
              labelId={`segment-label-${rule.id}`}
              label="Segmento"
              value={rule.segmentType}
              onChange={(e) => updateRule(rule.id, "segmentType", e.target.value)}
            >
              {SEGMENT_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl} size="small">
            <InputLabel id={`comparison-label-${rule.id}`}>Operador</InputLabel>

            <Select
              labelId={`comparison-label-${rule.id}`}
              label="Operador"
              value={rule.comparisonOperator}
              onChange={(e: SelectChangeEvent<number>) =>
                updateRule(rule.id, "comparisonOperator", Number(e.target.value))
              }
            >
              {OPERATOR_OPTIONS.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl} size="small">
            <InputLabel id={`value-label-${rule.id}`}>Valor</InputLabel>
            <Select
              labelId={`value-label-${rule.id}`}
              label="Valor"
              value={rule.values[0]}
              onChange={(e) => updateRule(rule.id, "values", [e.target.value])}
              >
              {VALUE_OPTIONS.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton data-testid="delete-icon" onClick={() => removeRule(rule.id)} color="error">
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
