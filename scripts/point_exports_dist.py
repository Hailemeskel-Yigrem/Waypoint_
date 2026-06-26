#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
for pkg_json in ROOT.glob("packages/*/package.json"):
    dist = pkg_json.parent / "dist" / "index.js"
    src = pkg_json.parent / "src" / "index.ts"
    data = json.loads(pkg_json.read_text(encoding="utf-8"))
    if dist.exists():
        data["main"] = "./dist/index.js"
        data["types"] = "./dist/index.d.ts"
        data["exports"] = {
            ".": {
                "types": "./dist/index.d.ts",
                "import": "./dist/index.js",
                "default": "./dist/index.js",
            }
        }
    elif src.exists():
        data["main"] = "./src/index.ts"
        data["types"] = "./src/index.ts"
        data["exports"] = {
            ".": {
                "types": "./src/index.ts",
                "import": "./src/index.ts",
                "default": "./src/index.ts",
            }
        }
    pkg_json.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(pkg_json.parent.name, "->", data["main"])
