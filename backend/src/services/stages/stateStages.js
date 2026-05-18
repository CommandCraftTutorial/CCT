const stateStages = [
  {
    id: "git-1",
    category: "git",
    title: "Git 저장소 초기화",
    mission: "현재 폴더를 Git 저장소로 초기화하세요.",
    difficulty: "기초",
    description:
      "새 프로젝트 폴더가 아직 Git으로 관리되고 있지 않습니다. git init 명령어를 사용해 Git 저장소를 초기화하세요.",
    initialFiles: [],
    clearCondition:
      "state.isGitRepo === true",
    examples: [
      "git init"
    ]
  },
  {
    id: "git-2",
    category: "git",
    title: "README.md 첫 커밋",
    mission: "README.md 파일을 staging area에 올리고 커밋하세요.",
    difficulty: "기초",
    description:
      "프로젝트 설명 파일인 README.md가 있습니다. 이 파일을 Git에 추가하고 첫 커밋으로 남기세요.",
    initialFiles: ["README.md"],
    clearCondition:
      "README.md가 trackedFiles에 포함되고, README.md를 포함한 commit이 존재해야 합니다.",
    examples: [
      "git init",
      "git add README.md",
      "git commit -m 'add README'"
    ]
  },
  {
    id: "git-3",
    category: "git",
    title: "불필요한 debug.log 제외하기",
    mission: "debug.log는 제외하고 app.js만 커밋하세요.",
    difficulty: "중급",
    description:
      "현재 폴더에는 README.md, app.js, debug.log가 있습니다. debug.log는 커밋하면 안 됩니다. app.js만 커밋에 포함되도록 처리하세요.",
    initialFiles: ["README.md", "app.js", "debug.log"],
    clearCondition:
      "app.js는 커밋에 포함되고, debug.log는 어떤 커밋에도 포함되지 않아야 합니다.",
    examples: [
      "git init",
      "git add debug.log",
      "git restore --staged debug.log",
      "git add app.js",
      "git commit -m 'add app'"
    ]
  }
];

function getStateStages() {
  return stateStages;
}

function getStateStageById(id) {
  return stateStages.find((stage) => stage.id === String(id));
}

function getStateStagesByCategory(category) {
  return stateStages.filter((stage) => stage.category === category);
}

module.exports = {
  getStateStages,
  getStateStageById,
  getStateStagesByCategory
};