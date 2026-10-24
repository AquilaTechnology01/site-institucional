"""Atualiza referências CSS/JS na fonte para publicação estática, sem dependências.

Execute após editar CSS/JS. O build normal continua sem modificar as fontes.
"""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import hashlib
import re

ROOT = Path(__file__).resolve().parent.parent


def refresh(root=ROOT):
    changed = []
    for page in [*root.glob('*.html'), root / 'portfolio/index.html']:
        def replace(match):
            tag = match[0]
            attribute = re.search(r'(?:href|src)="([^"]+)"', tag)
            if not attribute:
                return tag
            url = urlsplit(attribute[1])
            if url.scheme or url.netloc or Path(url.path).suffix not in {'.css', '.js'}:
                return tag
            asset = root / unquote(url.path).lstrip('/') if url.path.startswith('/') else page.parent / unquote(url.path)
            if not asset.resolve().is_relative_to(root.resolve()) or not asset.is_file():
                raise ValueError(f'Recurso ausente ou fora do projeto: {url.path}')
            fingerprint = hashlib.sha256(asset.read_bytes()).hexdigest()[:16]
            return tag.replace(attribute[1], url.path + '?v=' + fingerprint)
        original = page.read_text()
        content = re.sub(r'<link\b[^>]*>|<script\b[^>]*src="[^"]+"[^>]*></script>', replace, original)
        if content != original:
            page.write_text(content)
            changed.append(page.relative_to(root).as_posix())
    return changed


if __name__ == '__main__':
    print('Referências atualizadas: ' + ', '.join(refresh()))
