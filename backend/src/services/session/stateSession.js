const { createInitialGitState } = require("../simulator/gitStateSimulator");

const sessions = {};

function getStateSession(userId, category, stageId) {
  const key = `${userId}_${category}_${stageId}`;

  if (!sessions[key]) {
    sessions[key] = createInitialState(category, stageId);
  }

  return sessions[key];
}

function setStateSession(userId, category, stageId, state) {
  const key = `${userId}_${category}_${stageId}`;
  sessions[key] = state;
  return sessions[key];
}

function resetStateSession(userId, category, stageId) {
  const key = `${userId}_${category}_${stageId}`;
  sessions[key] = createInitialState(category, stageId);
  return sessions[key];
}

function createInitialState(category, stageId) {
  if (category === "git") {
    return createInitialGitState(getInitialFilesForGitStage(stageId));
  }

  return {};
}

function getInitialFilesForGitStage(stageId) {
  switch (String(stageId)) {
    case "git-1":
      return [];

    case "git-2":
      return ["README.md"];

    case "git-3":
      return ["README.md", "app.js", "debug.log"];

    default:
      return ["README.md", "app.js", "debug.log"];
  }
}

module.exports = {
  getStateSession,
  setStateSession,
  resetStateSession
};