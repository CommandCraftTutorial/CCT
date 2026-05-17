/**
 * 사용자가 입력한 CLI 명령어를 공통 형식으로 파싱하는 함수
 *
 * 예시:
 * "git commit -m 'first commit'"
 *
 * 결과:
 * {
 *   ok: ture,
 *   raw: "git commit -m 'first commit'",
 *   category: "git",
 *   command: "git",
 *   subcommand: "commit",
 *   args: [],
 *   options: { m: "first commit" },
 *   tokens: ["git", "commit", "-m", "first commit"]
 * }
 */

const VALID_CATEGORIES = ["git", "linux", "gdb", "pdb"];

const COMMANDS_BY_CATEGORY = {
  git: ["git"],

  linux: [
    "ls",
    "cd",
    "pwd",
    "mkdir",
    "touch",
    "rm",
    "cp",
    "mv",
    "cat",
    "echo"
  ],

  gdb: [
    "gdb",
    "break",
    "b",
    "run",
    "r",
    "print",
    "p",
    "continue",
    "c",
    "next",
    "n",
    "step",
    "s",
    "list",
    "l",
    "quit",
    "q"
  ],

  pdb: [
    "pdb",
    "break",
    "b",
    "continue",
    "c",
    "next",
    "n",
    "step",
    "s",
    "print",
    "p",
    "where",
    "w",
    "list",
    "l",
    "quit",
    "q",
    "until",
    "unt"
  ]
};

function tokenize(input) {
  const tokens = [];
  let current = "";
  let quote = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if ((char === '"' || char === "'") && quote === null) {
      quote = char;
      continue;
    }

    if (char === quote) {
      quote = null;
      continue;
    }

    if (char === " " && quote === null) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (quote !== null) {
    return {
      tokens: [],
      error: "따옴표가 닫히지 않았습니다."
    };
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return {
    tokens,
    error: null
  };
}

function normalizeCategory(category) {
  if (!category) return null;

  const normalized = String(category).toLowerCase();

  if (!VALID_CATEGORIES.includes(normalized)) {
    return null;
  }

  return normalized;
}

function isCommandAllowedInCategory(command, category) {
  const allowedCommands = COMMANDS_BY_CATEGORY[category];

  if (!allowedCommands) {
    return false;
  }

  return allowedCommands.includes(command);
}

function parseOptionsAndArgs(tokens) {
  const options = {};
  const args = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.startsWith("--")) {
      const optionName = token.slice(2);
      const nextToken = tokens[i + 1];

      if (!optionName) {
        args.push(token);
        continue;
      }

      if (nextToken && !nextToken.startsWith("-")) {
        options[optionName] = nextToken;
        i++;
      } else {
        options[optionName] = true;
      }

      continue;
    }

    if (token.startsWith("-") && token.length > 1) {
      const optionName = token.slice(1);
      const nextToken = tokens[i + 1];

      if (nextToken && !nextToken.startsWith("-")) {
        options[optionName] = nextToken;
        i++;
      } else {
        options[optionName] = true;
      }

      continue;
    }

    args.push(token);
  }

  return { options, args };
}

function parseCommand(input, category) {
  const raw = String(input || "").trim();
  const normalizedCategory = normalizeCategory(category);

  if (!raw) {
    return {
      ok: false,
      raw,
      category: normalizedCategory,
      command: null,
      subcommand: null,
      args: [],
      options: {},
      tokens: [],
      error: "명령어가 비어 있습니다."
    };
  }

  if (!normalizedCategory) {
    return {
      ok: false,
      raw,
      category: null,
      command: null,
      subcommand: null,
      args: [],
      options: {},
      tokens: [],
      error: "올바른 카테고리가 필요합니다. category는 git, linux, gdb, pdb 중 하나여야 합니다."
    };
  }

  const tokenizeResult = tokenize(raw);

  if (tokenizeResult.error) {
    return {
      ok: false,
      raw,
      category: normalizedCategory,
      command: null,
      subcommand: null,
      args: [],
      options: {},
      tokens: [],
      error: tokenizeResult.error
    };
  }

  const tokens = tokenizeResult.tokens;
  const command = tokens[0];

  if (!command) {
    return {
      ok: false,
      raw,
      category: normalizedCategory,
      command: null,
      subcommand: null,
      args: [],
      options: {},
      tokens,
      error: "명령어를 해석할 수 없습니다."
    };
  }

  if (!isCommandAllowedInCategory(command, normalizedCategory)) {
    return {
      ok: false,
      raw,
      category: normalizedCategory,
      command,
      subcommand: null,
      args: [],
      options: {},
      tokens,
      error: `${normalizedCategory} 카테고리에서 사용할 수 없는 명령어입니다: ${command}`
    };
  }

  let subcommand = null;
  let remainingTokens = tokens.slice(1);

  if (normalizedCategory === "git") {
    subcommand = tokens[1] || null;
    remainingTokens = tokens.slice(2);

    if (!subcommand) {
      return {
        ok: false,
        raw,
        category: normalizedCategory,
        command,
        subcommand,
        args: [],
        options: {},
        tokens,
        error: "git 명령어에는 하위 명령어가 필요합니다. 예: git init, git add README.md"
      };
    }
  }

  const { options, args } = parseOptionsAndArgs(remainingTokens);

  return {
    ok: true,
    raw,
    category: normalizedCategory,
    command,
    subcommand,
    args,
    options,
    tokens
  };
}

module.exports = {
  parseCommand,
  tokenize,
  COMMANDS_BY_CATEGORY
};