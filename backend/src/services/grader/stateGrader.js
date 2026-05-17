function gradeStage(stageId, state) {
  switch (String(stageId)) {
    case "git-1":
      return gradeGitInit(state);

    case "git-2":
      return gradeGitReadmeCommit(state);

    case "git-3":
      return gradeGitCommitAppWithoutDebug(state);

    default:
      return {
        cleared: false,
        message: `알 수 없는 스테이지입니다: ${stageId}`,
        hint: "stageId가 stateGrader에 등록되어 있는지 확인하세요."
      };
  }
}

function gradeGitInit(state) {
  if (state.isGitRepo === true) {
    return {
      cleared: true,
      message: "스테이지 클리어! Git 저장소 초기화에 성공했습니다.",
      hint: null
    };
  }

  return {
    cleared: false,
    message: "아직 Git 저장소가 초기화되지 않았습니다.",
    hint: "git init 명령어를 사용해보세요."
  };
}

function gradeGitReadmeCommit(state) {
  const hasReadme = state.files.includes("README.md");
  const isReadmeTracked = state.trackedFiles.includes("README.md");
  const hasReadmeCommit = state.commits.some((commit) => {
    return commit.files.includes("README.md");
  });

  if (hasReadme && isReadmeTracked && hasReadmeCommit) {
    return {
      cleared: true,
      message: "스테이지 클리어! README.md 파일을 성공적으로 커밋했습니다.",
      hint: null
    };
  }

  if (!hasReadme) {
    return {
      cleared: false,
      message: "README.md 파일이 없습니다.",
      hint: "README.md 파일이 있는 상태에서 진행해야 합니다."
    };
  }

  if (!isReadmeTracked) {
    return {
      cleared: false,
      message: "README.md가 아직 Git에 추적되지 않았습니다.",
      hint: "git add README.md 후 git commit -m '메시지'를 실행해보세요."
    };
  }

  return {
    cleared: false,
    message: "README.md가 아직 커밋되지 않았습니다.",
    hint: "git commit -m 'add README' 명령어를 사용해보세요."
  };
}

function gradeGitCommitAppWithoutDebug(state) {
  const hasAppCommit = state.commits.some((commit) => {
    return commit.files.includes("app.js");
  });

  const debugWasCommitted = state.commits.some((commit) => {
    return commit.files.includes("debug.log");
  });

  const isAppTracked = state.trackedFiles.includes("app.js");

  if (hasAppCommit && isAppTracked && !debugWasCommitted) {
    return {
      cleared: true,
      message: "스테이지 클리어! app.js만 커밋하고 debug.log는 제외했습니다.",
      hint: null
    };
  }

  if (debugWasCommitted) {
    return {
      cleared: false,
      message: "debug.log가 커밋에 포함되었습니다.",
      hint: "debug.log는 커밋하면 안 됩니다. git restore --staged debug.log 또는 git reset debug.log를 사용해보세요."
    };
  }

  if (!isAppTracked || !hasAppCommit) {
    return {
      cleared: false,
      message: "app.js가 아직 커밋되지 않았습니다.",
      hint: "git add app.js 후 git commit -m 'add app'을 실행해보세요."
    };
  }

  return {
    cleared: false,
    message: "아직 목표 상태에 도달하지 못했습니다.",
    hint: "app.js는 커밋하고 debug.log는 제외해야 합니다."
  };
}

module.exports = {
  gradeStage
};