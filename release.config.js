const logs = require("npmlog");
const { sync } = require("execa");

const plugins = [];
const noteKeywords = ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"];
const { GITHUB_SHA, GITHUB_REPOSITORY, GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL } = process.env;

const successCmd = `
echo 'RELEASE_TAG=v\${nextRelease.version}' >> $GITHUB_ENV
echo 'RELEASE_VERSION=\${nextRelease.version}' >> $GITHUB_ENV
echo '::set-output name=release-tag::v\${nextRelease.version}'
echo '::set-output name=release-version::\${nextRelease.version}'
`;

const [owner, repo] = String(GITHUB_REPOSITORY).toLowerCase().split("/");

const addPlugin = (plugin, options) => {
  logs.info(`${plugin} enabled ${options && "with options:"}`);
  options && logs.info(null, options);
  return plugins.push([plugin, options]);
};

logs.info(`Executing semantic-release config setup`);

try {
  const { stdout: authorName } = sync("git", ["log", "-1", "--pretty=format:%an", GITHUB_SHA]);
  const { stdout: authorEmail } = sync("git", ["log", "-1", "--pretty=format:%ae", GITHUB_SHA]);
  authorName && !GIT_AUTHOR_NAME && (process.env.GIT_AUTHOR_NAME = `${authorName}`);
  authorEmail && !GIT_AUTHOR_EMAIL && (process.env.GIT_AUTHOR_EMAIL = `${authorEmail}`);
} catch (e) {
  logs.error(`Unable to set GIT_COMMITTER_NAME and GIT_COMMITTER_EMAIL`, e);
}

addPlugin("@semantic-release/exec", {
  successCmd,
  prepareCmd: `docker build . -t ${owner}/${repo} --target prod-server --build-arg NPM_TOKEN=$NPM_TOKEN`,
});

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

addPlugin("@eclass/semantic-release-docker", {
  baseImageName: `${owner}/${repo}`,
  registries: [
    {
      url: "ghcr.io",
      imageName: `ghcr.io/${owner}/${repo}`,
      user: "DOCKER_USERNAME",
      password: "DOCKER_PASSWORD",
    },
  ],
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

module.exports = {
  branches: [
    // maintenance releases
    "+([0-9])?(.{+([0-9]),x}).x",

    // release channels
    "main",

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
  repositoryUrl: "https://github.com/otedesco/authorization.git",

  plugins,
};
