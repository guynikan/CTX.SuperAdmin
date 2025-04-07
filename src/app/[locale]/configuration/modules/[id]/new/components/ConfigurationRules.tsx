"use client";

import { useState, useCallback, useEffect } from "react";
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

import { useSegmentTypes } from "@/hooks/segments/useSegmentTypes";
import { useSegmentValuesByType } from "@/hooks/segments/useSegmentValues";

const OPERATOR_OPTIONS = [
  { label: "Igual", value: 0 },
  { label: "Diferente", value: 1 },
];

const LOGICAL_OPERATORS = [
  { label: "OR", value: 0 },
  { label: "AND", value: 1 },
];

const initialRule = (): Rule => ({
  id: Date.now(),
  segmentType: "",
  comparisonOperator: 0,
  values: [],
  logicalOperator: 1,
});

type Props = {
  ruleset: Ruleset;
  onChange: (updated: Ruleset) => void;
};

export default function ConfigurationRules({ onChange }: Props) {
  const [rules, setRules] = useState<Rule[]>([initialRule()]);
  const [ruleName, setRuleName] = useState("Minha Regra");
  const [currentSegmentId, setCurrentSegmentId] = useState<string>("");
  const [segmentValuesCache, setSegmentValuesCache] = useState<Record<string, any[]>>({});

  const { data: segmentTypes = [] } = useSegmentTypes();
  const { data: segmentValues = [] } = useSegmentValuesByType(currentSegmentId);

  const updateRule = (id: number, field: keyof Rule, value: any) => {
    setRules((prevRules) =>
      prevRules.map((rule) => {
        if (rule.id !== id) return rule;
        const updatedValue = field === "values" ? (Array.isArray(value) ? value : [value]) : value;
        return { ...rule, [field]: updatedValue };
      })
    );
  };

  const addRule = () => {
    setRules((prev) => {
      const last = prev[prev.length - 1];
      const newRule: Rule = { ...last, id: Date.now() };
      return [...prev, newRule];
    });
  };

  const removeRule = (id: number) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const handleSegmentTypeChange = (ruleId: number, segmentId: string) => {
    updateRule(ruleId, "segmentType", segmentId);
    updateRule(ruleId, "values", []);
    setCurrentSegmentId(segmentId);
  };

  const formatRuleset = useCallback((): Ruleset => ({
    name: ruleName,
    logicalOperator: 0,
    enabled: true,
    priority: 0,
    ruleConditions: rules,
  }), [ruleName, rules]);
  

  useEffect(() => {
    onChange(formatRuleset());
    if (currentSegmentId && segmentValues.length > 0) {
      setSegmentValuesCache((prev) => ({
        ...prev,
        [currentSegmentId]: segmentValues,
      }));
    }
  }, [currentSegmentId, segmentValues, formatRuleset, onChange]);

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

      {rules.map((rule, index) => {
        const values = segmentValuesCache[rule.segmentType] || [];

        return (
          <Stack key={rule.id} direction="row" spacing={2} sx={styles.row}>
            {index !== 0 && (
              <FormControl sx={{ ...styles.formControl, ...styles.smallAnd }} size="small">
                <InputLabel id={`operator-label-${rule.id}`}>Operador</InputLabel>
                <Select
                  labelId={`operator-label-${rule.id}`}
                  label="Operador"
                  value={rule.logicalOperator}
                  onChange={(e: SelectChangeEvent<number>) =>
                    updateRule(rule.id, "logicalOperator", Number(e.target.value))
                  }
                >
                  {LOGICAL_OPERATORS.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
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
                onChange={(e) => handleSegmentTypeChange(rule.id, e.target.value)}
              >
                {segmentTypes.map((segment) => (
                  <MenuItem key={segment.id} value={segment.id}>{segment.name}</MenuItem>
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
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={styles.formControl} size="small">
              <InputLabel id={`value-label-${rule.id}`}>Valor</InputLabel>
              <Select
                labelId={`value-label-${rule.id}`}
                label="Valor"
                value={rule.values[0] || ""}
                onChange={(e) => updateRule(rule.id, "values", [e.target.value])}
              >
                {values.map((val) => (
                  <MenuItem key={val.id} value={val.id}>{val.displayName}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton onClick={() => removeRule(rule.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      })}

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
