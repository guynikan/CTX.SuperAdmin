'use client'

import React from 'react'
import { Box, Alert, Collapse, Typography, IconButton } from '@mui/material'
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material'
import { editor } from 'monaco-editor'

interface TemplateError {
  line: number
  message: string
  context: string
}

interface ValidationErrorsDisplayProps {
  validationErrors: editor.IMarker[]
  templateErrors?: TemplateError[]
  autocompleteError?: string
  maxVisibleErrors?: number
  collapsible?: boolean
}

export const ValidationErrorsDisplay: React.FC<ValidationErrorsDisplayProps> = ({
  validationErrors = [],
  templateErrors = [],
  autocompleteError,
  maxVisibleErrors = 3,
  collapsible = false
}) => {
  const [expanded, setExpanded] = React.useState(!collapsible)
  
  const totalErrors = validationErrors.length + templateErrors.length + (autocompleteError ? 1 : 0)
  
  if (totalErrors === 0) {
    return null
  }
  
  const visibleValidationErrors = validationErrors.slice(0, maxVisibleErrors)
  const visibleTemplateErrors = templateErrors.slice(0, Math.max(0, maxVisibleErrors - visibleValidationErrors.length))
  const remainingErrorsCount = totalErrors - visibleValidationErrors.length - visibleTemplateErrors.length - (autocompleteError ? 1 : 0)
  
  const ErrorsContent = () => (
    <>
      {/* Autocomplete Error */}
      {autocompleteError && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{ fontSize: '0.875rem' }}
        >
          <Typography variant="body2">
            <strong>Autocomplete Error:</strong> {autocompleteError}
          </Typography>
        </Alert>
      )}
      
      {/* Schema validation errors */}
      {visibleValidationErrors.map((error, index) => (
        <Alert
          key={`schema-${index}`}
          severity="error"
          variant="outlined"
          sx={{ 
            mt: (index > 0 || autocompleteError) ? 1 : 0, 
            fontSize: '0.875rem' 
          }}
        >
          <Typography variant="body2">
            <strong>Line {error.startLineNumber}:</strong> {error.message}
          </Typography>
        </Alert>
      ))}
      
      {/* Template expression errors */}
      {visibleTemplateErrors.map((error, index) => (
        <Alert
          key={`template-${index}`}
          severity="warning"
          variant="outlined"
          sx={{ 
            mt: (validationErrors.length > 0 || index > 0 || autocompleteError) ? 1 : 0, 
            fontSize: '0.875rem' 
          }}
        >
          <Typography variant="body2">
            <strong>Line {error.line}:</strong> {error.message}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Context: {error.context}
          </Typography>
        </Alert>
      ))}
      
      {/* Show count if there are more errors */}
      {remainingErrorsCount > 0 && (
        <Alert severity="info" variant="outlined" sx={{ mt: 1, fontSize: '0.875rem' }}>
          <Typography variant="body2">
            +{remainingErrorsCount} more error{remainingErrorsCount > 1 ? 's' : ''}...
            {collapsible && !expanded && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Click to expand and see all errors
              </Typography>
            )}
          </Typography>
        </Alert>
      )}
    </>
  )
  
  if (!collapsible) {
    return (
      <Box mt={1}>
        <ErrorsContent />
      </Box>
    )
  }
  
  return (
    <Box mt={1}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          p: 1,
          border: '1px solid',
          borderColor: 'error.main',
          borderRadius: 1,
          bgcolor: 'error.light',
          color: 'error.contrastText',
          mb: expanded ? 1 : 0
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          <strong>{totalErrors} Validation Error{totalErrors > 1 ? 's' : ''}</strong>
        </Typography>
        <IconButton size="small" sx={{ color: 'inherit' }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      <Collapse in={expanded}>
        <ErrorsContent />
      </Collapse>
    </Box>
  )
}
