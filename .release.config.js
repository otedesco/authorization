const { existsSync } = require("fs");
const log = require("npmlog");

const plugins = [];

const { GITHUB_REPOSITORY } = process.env;
const [owner, repo] = String(GITHUB_REPOSITORY).toLowerCase().split("/");
const noteKeywords = ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"];

const addPlugin = (plugin, options) => {
  log.info(`${plugin} enabled ${options && "with options:"}`);
  options && log.info(null, options);
  return plugins.push([plugin, options]);
};

log.info(`Executing semantic-release config setup`);

addPlugin("@semantic-release/commit-analyzer", {
  preset: "conventionalcommits",
  releaseRules: [
    { type: "feat", release: "minor" },
    { type: "fix", release: "patch" },
    { type: "perf", release: "patch" },
    { type: "revert", release: "patch" },
    { type: "docs", release: "minor" },
    { type: "style", release: "patch" },
    { type: "refactor", release: "patch" },
    { type: "test", release: "patch" },
    { type: "build", release: "patch" },
    { type: "ci", release: "patch" },
    { type: "chore", release: false },
  ],
  parserOpts: {
    noteKeywords,
  },
});

addPlugin("@semantic-release/release-notes-generator", {
  preset: "conventionalcommits",
  parserOpts: {
    noteKeywords,
  },
  writerOpts: {
    commitsSort: ["subject", "scope"],
  },
  presetConfig: {
    types: [
      { type: "feat", section: "🍕 Features" },
      { type: "feature", section: "🍕 Features" },
      { type: "fix", section: "🐛 Bug Fixes" },
      { type: "perf", section: "🔥 Performance Improvements" },
      { type: "revert", section: "⏩ Reverts" },
      { type: "docs", section: "📝 Documentation" },
      { type: "style", section: "🎨 Styles" },
      { type: "refactor", section: "🧑‍💻 Code Refactoring" },
      { type: "test", section: "✅ Tests" },
      { type: "build", section: "🤖 Build System" },
      { type: "ci", section: "🔁 Continuous Integration" },
    ],
  },
});

addPlugin("@semantic-release/changelog", {
  changelogFile: "./docs/CHANGELOG.md",
  changelogTitle: `# 📦 ${owner}/${repo} changelog

[![conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic versioning](https://img.shields.io/badge/semantic%20versioning-2.0.0-green.svg)](https://semver.org)

> All notable changes to this project will be documented in this file`,
});

addPlugin("@semantic-release/npm", {
  tarballDir: "pack",
});

addPlugin("@semantic-release/git", {
  assets: ["docs/CHANGELOG.md", "package.json", "pnpm-lock.yaml", "docs/diagram.svg"],
  message: `chore(<%= nextRelease.type %>): release <%= nextRelease.version %> <%= nextRelease.channel !== null ? \`on \${nextRelease.channel} channel \` : '' %>[skip ci]\n\n<%= nextRelease.notes %>`,
});

addPlugin("@semantic-release/github", {
  addReleases: "bottom",
  assets: [
    {
      path: "pack/*.tgz",
      label: "Static distribution",
    },
  ],
});

const dockerExists = existsSync("./Dockerfile");
if (dockerExists) {
  addPlugin("@eclass/semantic-release-docker", {
    baseImageName: `${owner}/${repo}`,
    registries: [
      {
        url: "ghcr.io",
        imageName: `ghcr.io/${owner}/${repo}`,
        user: "GITHUB_REPOSITORY_OWNER",
        password: "GITHUB_TOKEN",
      },
    ],
  });
}

if (process.env.GITHUB_ACTIONS !== undefined) {
  addPlugin("@semantic-release/exec", {
    prepareCmd: `docker build . -t ghcr.io/${owner}/${repo} --target prod-server --build-arg NPM_TOKEN=$NPM_TOKEN`,
  });
}

module.exports = {
  branches: [
    // release channels
    "main",
    "next",
    "next-major",

    // pre-releases
    {
      name: "stage",
      prerelease: true,
    },
    {
      name: "develop",
      prerelease: true,
    },
  ],
  plugins,
};

// {
//   "branches": [
//     "main"
//   ],
//   "repositoryUrl": "https://github.com/otedesco/authorization.git",
//   "plugins": [
//     "@semantic-release/commit-analyzer",
//     "@semantic-release/release-notes-generator",
//     [
//       "@semantic-release/changelog",
//       {
//         "changelogFile": "./docs/CHANGELOG.md"
//       }
//     ],
//     "@semantic-release/npm",
//     [
//       "@semantic-release/exec",
//       {
//         "prepareCmd": "docker build . -t otedesco/authorization --target prod-server --build-arg NPM_TOKEN=$NPM_TOKEN"
//       }
//     ],
//     [
//       "@semantic-release-plus/docker",
//       {
//         "name": "otedesco/authorization:latest",
//         "registry": "ghcr.io"
//       }
//     ],
//     [
//       "@semantic-release/git",
//       {
//         "assets": [
//           "./docs/CHANGELOG.md",
//           "./package.json"
//         ],
//         "message": "release(version): Release authorization service ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
//       }
//     ],
//     [
//       "@semantic-release/github",
//       {
//         "successComment": false,
//         "failTitle": false
//       }
//     ]
//   ]
// }
