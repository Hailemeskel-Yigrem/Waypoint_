from pathlib import Path

root = Path(__file__).resolve().parents[1]
fixes = [
    ("packages/shared/src/date.test.ts", "from '../utils/date.js'", "from './utils/date.js'"),
    ("packages/shared/src/money.test.ts", "from '../utils/money.js'", "from './utils/money.js'"),
    ("packages/shared/src/events.test.ts", "from '../events.js'", "from './events.js'"),
    ("packages/shared/src/pagination.test.ts", "from '../types/pagination.js'", "from './types/pagination.js'"),
    ("packages/shared/src/result.test.ts", "from '../result.js'", "from './result.js'"),
    ("packages/shared/src/slug.test.ts", "from '../utils/slug.js'", "from './utils/slug.js'"),
]
for rel, old, new in fixes:
    path = root / rel
    text = path.read_text(encoding="utf-8")
    path.write_text(text.replace(old, new), encoding="utf-8")
    print("fixed", rel)
