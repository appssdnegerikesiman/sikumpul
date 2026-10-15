"""Package source and production build; exclude local dependencies and secrets."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
target = root.parent / 'jurnal-7-kaih.zip'
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    for item in root.rglob('*'):
        relative = item.relative_to(root)
        if any(part in {'node_modules', '.git'} for part in relative.parts):
            continue
        if not item.is_file() or item.name in {'.env', '.env.local', '.clasp.json'}:
            continue
        archive.write(item, relative.as_posix())
print(target)
