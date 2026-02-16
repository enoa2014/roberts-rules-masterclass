function normalizePath(input = "") {
  return String(input)
    .replaceAll("\\", "/")
    .split("/")
    .filter((part) => part && part !== ".")
    .reduce((acc, part) => {
      if (part === "..") {
        acc.pop();
      } else {
        acc.push(part);
      }
      return acc;
    }, [])
    .join("/");
}

function dirname(path) {
  const normalized = normalizePath(path);
  if (!normalized) return "";
  const parts = normalized.split("/");
  parts.pop();
  return parts.join("/");
}

function basename(path) {
  const normalized = normalizePath(path);
  if (!normalized) return "";
  const parts = normalized.split("/");
  return parts[parts.length - 1] || "";
}

function splitPath(path) {
  const normalized = normalizePath(path);
  return normalized ? normalized.split("/") : [];
}

function contentToString(content) {
  if (typeof content === "string") return content;
  if (content instanceof Uint8Array) {
    return new TextDecoder().decode(content);
  }
  if (content instanceof ArrayBuffer) {
    return new TextDecoder().decode(new Uint8Array(content));
  }
  if (content == null) return "";
  return String(content);
}

function contentToBytes(content) {
  if (content instanceof Uint8Array) return content;
  if (content instanceof ArrayBuffer) return new Uint8Array(content);
  return new TextEncoder().encode(contentToString(content));
}

export function createFsMock(seed = {}) {
  const files = new Map();
  const dirs = new Set([""]);
  const writes = [];

  function ensureDir(path) {
    let cursor = "";
    splitPath(path).forEach((part) => {
      cursor = cursor ? `${cursor}/${part}` : part;
      dirs.add(cursor);
    });
  }

  function setFile(path, content) {
    const normalized = normalizePath(path);
    const dir = dirname(normalized);
    ensureDir(dir);
    files.set(normalized, {
      bytes: contentToBytes(content),
      text: contentToString(content),
      kind: "file",
    });
  }

  Object.entries(seed).forEach(([path, content]) => setFile(path, content));

  async function exists(path) {
    const normalized = normalizePath(path);
    return files.has(normalized) || dirs.has(normalized);
  }

  async function list(path = "") {
    const normalized = normalizePath(path);
    if (!(await exists(normalized))) {
      throw new Error(`NOT_FOUND: ${normalized}`);
    }

    const children = new Map();

    files.forEach((_, filePath) => {
      const parent = dirname(filePath);
      if (parent !== normalized) return;
      const name = basename(filePath);
      children.set(name, { name, kind: "file" });
    });

    dirs.forEach((dirPath) => {
      if (!dirPath) return;
      const parent = dirname(dirPath);
      if (parent !== normalized) return;
      const name = basename(dirPath);
      children.set(name, { name, kind: "directory" });
    });

    return Array.from(children.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async function readText(path) {
    const normalized = normalizePath(path);
    const file = files.get(normalized);
    if (!file) throw new Error(`NOT_FOUND: ${normalized}`);
    return file.text;
  }

  async function readBinary(path) {
    const normalized = normalizePath(path);
    const file = files.get(normalized);
    if (!file) throw new Error(`NOT_FOUND: ${normalized}`);
    return file.bytes.buffer.slice(0);
  }

  async function readJson(path) {
    return JSON.parse(await readText(path));
  }

  async function ensureDirectory(path) {
    ensureDir(normalizePath(path));
  }

  async function writeText(path, content) {
    const normalized = normalizePath(path);
    const existed = files.has(normalized);
    setFile(normalized, content);
    writes.push({ path: normalized, type: "text", existed });
    return { path: normalized, backupPath: null };
  }

  async function writeBinary(path, content) {
    const normalized = normalizePath(path);
    const existed = files.has(normalized);
    setFile(normalized, content);
    writes.push({ path: normalized, type: "binary", existed });
    return { path: normalized, backupPath: null };
  }

  async function writeJson(path, data) {
    return writeText(path, `${JSON.stringify(data, null, 2)}\n`);
  }

  async function deletePath(path, options = {}) {
    const normalized = normalizePath(path);
    const recursive = Boolean(options?.recursive);

    if (files.has(normalized)) {
      files.delete(normalized);
      return;
    }

    if (!dirs.has(normalized)) return;
    if (!recursive) {
      const hasChildren = Array.from(files.keys()).some((item) => dirname(item) === normalized)
        || Array.from(dirs).some((item) => item && dirname(item) === normalized);
      if (hasChildren) throw new Error(`DIR_NOT_EMPTY: ${normalized}`);
    }

    Array.from(files.keys()).forEach((filePath) => {
      if (filePath === normalized || filePath.startsWith(`${normalized}/`)) {
        files.delete(filePath);
      }
    });

    Array.from(dirs).forEach((dirPath) => {
      if (dirPath === normalized || dirPath.startsWith(`${normalized}/`)) {
        dirs.delete(dirPath);
      }
    });
    dirs.add("");
  }

  async function backupFileIfExistsText(path) {
    const normalized = normalizePath(path);
    if (!(await exists(normalized)) || !files.has(normalized)) return null;
    return `.mock-backups/${Date.now()}/${normalized}`;
  }

  async function backupFileIfExistsBinary(path) {
    return backupFileIfExistsText(path);
  }

  async function verifyStructure() {
    const required = ["index.html", "data", "js", "css"];
    const missing = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of required) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await exists(item))) {
        missing.push(item);
      }
    }
    return {
      ok: missing.length === 0,
      missing,
      checkedAt: new Date().toISOString(),
    };
  }

  function openHandle() {
    return {
      name: "reading-garden-v3",
      kind: "directory",
      async getDirectoryHandle(name) {
        return {
          name,
          kind: "directory",
          async getDirectoryHandle(childName) {
            return { name: childName, kind: "directory" };
          },
          async getFileHandle(childName) {
            return { name: childName, kind: "file" };
          },
        };
      },
      async getFileHandle(name) {
        return { name, kind: "file" };
      },
    };
  }

  const adapter = {
    projectHandle: null,
    async openProject() {
      this.projectHandle = openHandle();
      return this.projectHandle;
    },
    setProjectHandle(handle) {
      this.projectHandle = handle;
    },
    getProjectHandle() {
      return this.projectHandle;
    },
    exists,
    list,
    readText,
    readBinary,
    readJson,
    ensureDirectory,
    writeText,
    writeBinary,
    writeJson,
    deletePath,
    backupFileIfExistsText,
    backupFileIfExistsBinary,
    verifyStructure,
    __getWrites() {
      return writes.slice();
    },
    __getFiles() {
      return new Map(files);
    },
  };

  return adapter;
}

export function createDefaultProjectSeed() {
  return {
    "index.html": "<!doctype html><html><body>root</body></html>\n",
    "book.html": "<!doctype html><html><body>book</body></html>\n",
    "css/tokens.css": ":root{--x:1;}\n",
    "js/modules/reading-module.js": "export default {};\n",
    "js/modules/characters-module.js": "export default {};\n",
    "js/modules/themes-module.js": "export default {};\n",
    "js/modules/timeline-module.js": "export default {};\n",
    "js/modules/interactive-module.js": "export default {};\n",
    "data/books.json": JSON.stringify(
      {
        books: [
          {
            id: "totto-chan",
            title: "窗边的小豆豆",
            page: "book.html?book=totto-chan",
            cover: "assets/images/totto-chan/covers/cover.svg",
          },
        ],
      },
      null,
      2
    ) + "\n",
    "data/totto-chan/registry.json": JSON.stringify(
      {
        book: {
          id: "totto-chan",
          title: "窗边的小豆豆",
        },
        modules: [
          {
            id: "reading",
            title: "阅读",
            icon: "📖",
            entry: "../../js/modules/reading-module.js",
            data: "chapters.json",
          },
        ],
      },
      null,
      2
    ) + "\n",
    "data/totto-chan/chapters.json": JSON.stringify(
      {
        chapters: [
          {
            id: 1,
            title: "第一章",
            content: ["豆豆来到新学校。"],
          },
        ],
      },
      null,
      2
    ) + "\n",
    "assets/images/totto-chan/covers/cover.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\"/>\n",
    "design-system/tokens.css": ":root{--y:2;}\n",
  };
}
