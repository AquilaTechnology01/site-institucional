"""Empacota somente os arquivos públicos do site estático. Sem dependências."""
from pathlib import Path
import shutil
from render_portfolio import render

root = Path(__file__).resolve().parent.parent
render(root)
output = root / 'dist'
output.mkdir(exist_ok=True)
for page in root.glob('*.html'):
    shutil.copy2(page, output / page.name)
for name in ['styles.css', 'robots.txt', 'sitemap.xml']:
    shutil.copy2(root / name, output / name)
for name in ['src', 'portfolio']:
    shutil.copytree(root / name, output / name, dirs_exist_ok=True)
print('Arquivos públicos preparados em dist/. Nenhum deploy executado.')
