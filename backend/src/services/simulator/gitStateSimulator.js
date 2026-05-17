function createInitialGitState(initialFiles = []) {
  return {
    isGitRepo: false,
    currentBranch: "main",
    branches: ["main"],
    files: [...initialFiles],
    trackedFiles: [],
    stagedFiles: [],
    commits: []
  };
}

function cloneState(state) {
  return {
    ...state,
    branches: [...(state.branches || [])],
    files: [...(state.files || [])],
    trackedFiles: [...(state.trackedFiles || [])],
    stagedFiles: [...(state.stagedFiles || [])],
    commits: [...(state.commits || [])]
  };
}

function ensureGitRepo(state) {
  if (!state.isGitRepo) {
    return {
      ok: false,
      message: "fatal: not a git repository. 먼저 git init을 실행하세요."
    };
  }

  return {
    ok: true,
    message: null
  };
}

function applyGitCommand(state, parsed) {
  const nextState = cloneState(state);

  if (!parsed || parsed.category !== "git") {
    return {
      ok: false,
      message: "Git 명령어가 아닙니다.",
      state: nextState
    };
  }

  const subcommand = parsed.subcommand;

  switch (subcommand) {
    case "init":
      return gitInit(nextState);

    case "status":
      return gitStatus(nextState);

    case "add":
      return gitAdd(nextState, parsed.args);

    case "commit":
      return gitCommit(nextState, parsed.options);

    case "reset":
      return gitReset(nextState, parsed.args);

    case "restore":
      return gitRestore(nextState, parsed.args, parsed.options);

    case "branch":
      return gitBranch(nextState, parsed.args);

    default:
      return {
        ok: false,
        message: `지원하지 않는 git 명령어입니다: git ${subcommand}`,
        state: nextState
      };
  }
}

function gitInit(state) {
  if (state.isGitRepo) {
    return {
      ok: true,
      message: "Reinitialized existing Git repository.",
      state
    };
  }

  state.isGitRepo = true;

  if (!state.currentBranch) {
    state.currentBranch = "main";
  }

  if (!state.branches || state.branches.length === 0) {
    state.branches = ["main"];
  }

  return {
    ok: true,
    message: "Initialized empty Git repository.",
    state
  };
}

function gitStatus(state) {
  const repoCheck = ensureGitRepo(state);

  if (!repoCheck.ok) {
    return {
      ok: false,
      message: repoCheck.message,
      state
    };
  }

  const staged = state.stagedFiles || [];
  const tracked = state.trackedFiles || [];

  const untracked = state.files.filter((file) => {
    return !tracked.includes(file) && !staged.includes(file);
  });

  let message = `On branch ${state.currentBranch}\n`;

  if (staged.length === 0 && untracked.length === 0) {
    message += "nothing to commit, working tree clean";
  } else {
    if (staged.length > 0) {
      message += "\nChanges to be committed:\n";
      for (const file of staged) {
        message += `  new file: ${file}\n`;
      }
    }

    if (untracked.length > 0) {
      message += "\nUntracked files:\n";
      for (const file of untracked) {
        message += `  ${file}\n`;
      }
    }
  }

  return {
    ok: true,
    message,
    state
  };
}

function gitAdd(state, args) {
  const repoCheck = ensureGitRepo(state);

  if (!repoCheck.ok) {
    return {
      ok: false,
      message: repoCheck.message,
      state
    };
  }

  if (!args || args.length === 0) {
    return {
      ok: false,
      message: "Nothing specified, nothing added.",
      state
    };
  }

  const target = args[0];

  if (target === ".") {
    for (const file of state.files) {
      if (!state.stagedFiles.includes(file)) {
        state.stagedFiles.push(file);
      }
    }

    return {
      ok: true,
      message: "Added all files to staging area.",
      state
    };
  }

  if (!state.files.includes(target)) {
    return {
      ok: false,
      message: `fatal: pathspec '${target}' did not match any files`,
      state
    };
  }

  if (!state.stagedFiles.includes(target)) {
    state.stagedFiles.push(target);
  }

  return {
    ok: true,
    message: `Added ${target} to staging area.`,
    state
  };
}

function gitCommit(state, options) {
  const repoCheck = ensureGitRepo(state);

  if (!repoCheck.ok) {
    return {
      ok: false,
      message: repoCheck.message,
      state
    };
  }

  if (!state.stagedFiles || state.stagedFiles.length === 0) {
    return {
      ok: false,
      message: "nothing to commit",
      state
    };
  }

  const message = options && options.m ? options.m : null;

  if (!message) {
    return {
      ok: false,
      message: "커밋 메시지가 필요합니다. 예: git commit -m 'message'",
      state
    };
  }

  const commit = {
    id: state.commits.length + 1,
    branch: state.currentBranch,
    message,
    files: [...state.stagedFiles]
  };

  state.commits.push(commit);

  for (const file of state.stagedFiles) {
    if (!state.trackedFiles.includes(file)) {
      state.trackedFiles.push(file);
    }
  }

  state.stagedFiles = [];

  return {
    ok: true,
    message: `[${state.currentBranch} ${commit.id}] ${message}`,
    state
  };
}

function gitReset(state, args) {
  const repoCheck = ensureGitRepo(state);

  if (!repoCheck.ok) {
    return {
      ok: false,
      message: repoCheck.message,
      state
    };
  }

  if (!args || args.length === 0) {
    state.stagedFiles = [];

    return {
      ok: true,
      message: "Unstaged all files.",
      state
    };
  }

  const target = args[0];

  if (!state.stagedFiles.includes(target)) {
    return {
      ok: true,
      message: `${target} is not staged.`,
      state
    };
  }

  state.stagedFiles = state.stagedFiles.filter((file) => file !== target);

  return {
    ok: true,
    message: `Unstaged ${target}.`,
    state
  };
}

function gitRestore(state, args, options) {
  const repoCheck = ensureGitRepo(state);

  if (!repoCheck.ok) {
    return {
      ok: false,
      message: repoCheck.message,
      state
    };
  }

  const hasStagedOption = options && Object.prototype.hasOwnProperty.call(options, "staged");

  if (!hasStagedOption) {
    return {
      ok: false,
      message: "현재는 git restore --staged <file> 형식만 지원합니다.",
      state
    };
  }

  const target = args && args.length > 0
    ? args[0]
    : options.staged;

  if (!target || target === true) {
    return {
      ok: false,
      message: "restore할 파일을 입력하세요.",
      state
    };
  }

  if (!state.stagedFiles.includes(target)) {
    return {
      ok: true,
      message: `${target} is not staged.`,
      state
    };
  }

  state.stagedFiles = state.stagedFiles.filter((file) => file !== target);

  return {
    ok: true,
    message: `Unstaged ${target}.`,
    state
  };
}

function gitBranch(state, args) {
  const repoCheck = ensureGitRepo(state);

  if (!repoCheck.ok) {
    return {
      ok: false,
      message: repoCheck.message,
      state
    };
  }

  if (!args || args.length === 0) {
    const message = state.branches
      .map((branch) => {
        if (branch === state.currentBranch) {
          return `* ${branch}`;
        }

        return `  ${branch}`;
      })
      .join("\n");

    return {
      ok: true,
      message,
      state
    };
  }

  const newBranch = args[0];

  if (state.branches.includes(newBranch)) {
    return {
      ok: false,
      message: `fatal: a branch named '${newBranch}' already exists`,
      state
    };
  }

  state.branches.push(newBranch);

  return {
    ok: true,
    message: `Created branch ${newBranch}.`,
    state
  };
}

module.exports = {
  createInitialGitState,
  applyGitCommand
};