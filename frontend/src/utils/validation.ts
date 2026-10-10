/**
 * SMILES Validation Utilities
 * Validates basic syntax, atom balancing, parentheses, and ring closure indices.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  details?: string;
}

export const validateSmiles = (smiles: string): ValidationResult => {
  const trimmed = smiles.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a SMILES string.',
    };
  }

  // Check for forbidden characters (spaces, tabs, newlines inside the string)
  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      error: 'SMILES strings cannot contain spaces or whitespace.',
      details: 'Remove any spaces between atoms or bonds.'
    };
  }

  // Check balanced parentheses (branches)
  let parenDepth = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === '(') {
      parenDepth++;
    } else if (char === ')') {
      parenDepth--;
      if (parenDepth < 0) {
        return {
          isValid: false,
          error: `Unmatched closing parenthesis ')' at position ${i + 1}.`,
          details: 'Molecular branch closed before opening.'
        };
      }
    }
  }

  if (parenDepth > 0) {
    return {
      isValid: false,
      error: `Unclosed branch parenthesis '(' (${parenDepth} unclosed).`,
      details: 'Ensure every opening parenthesis has a matching closing parenthesis.'
    };
  }

  // Check balanced square brackets (explicit atom definitions)
  let bracketDepth = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === '[') {
      bracketDepth++;
      if (bracketDepth > 1) {
        return {
          isValid: false,
          error: `Nested square brackets are not permitted at position ${i + 1}.`,
        };
      }
    } else if (char === ']') {
      bracketDepth--;
      if (bracketDepth < 0) {
        return {
          isValid: false,
          error: `Unmatched closing bracket ']' at position ${i + 1}.`,
        };
      }
    }
  }

  if (bracketDepth > 0) {
    return {
      isValid: false,
      error: 'Unclosed square bracket \'[\'.',
      details: 'Explicit atom expressions like [NH3+] or [nH] must be closed.'
    };
  }

  // Check ring closures balance (digits 1-9)
  const digitCounts: Record<string, number> = {};
  let inBracket = false;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === '[') inBracket = true;
    else if (char === ']') inBracket = false;
    else if (!inBracket && /[0-9]/.test(char)) {
      digitCounts[char] = (digitCounts[char] || 0) + 1;
    }
  }

  for (const [digit, count] of Object.entries(digitCounts)) {
    if (count % 2 !== 0) {
      return {
        isValid: false,
        error: `Unpaired ring closure index '${digit}' (found ${count} occurrences).`,
        details: 'Ring opening and closing indices must appear in pairs.'
      };
    }
  }

  // Check basic allowed character set in SMILES
  const validPattern = /^[A-Za-z0-9()[\]=#$:/+@.%-]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in SMILES string.',
      details: 'Only standard IUPAC/OpenSMILES notation characters are allowed.'
    };
  }

  return { isValid: true };
};
