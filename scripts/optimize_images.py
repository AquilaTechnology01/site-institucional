"""Gera miniaturas do catálogo. Pillow é necessário só nesta tarefa de manutenção.

Uso: python3 scripts/optimize_images.py. O build e o site não dependem de Pillow.
Imagens integrais e logotipos não são substituídos.
"""
from pathlib import Path
from urllib.parse import unquote
import json
import re
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

def optimize(root=ROOT):
    # Favicon específico de 64 px; os logotipos originais permanecem intactos.
    for variant in ['preto', 'branco']:
        with Image.open(root / f'src/img/logo/logo-{variant}.png') as original:
            image = original.convert('RGBA')
            image = image.crop(image.getbbox())
            image.thumbnail((64, 64), Image.Resampling.LANCZOS)
            canvas = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
            canvas.alpha_composite(image, ((64 - image.width) // 2, (64 - image.height) // 2))
            canvas.save(root / f'src/img/optimized/favicon-{variant}.png', optimize=True)
    catalog = root / 'src/data/projects.json'
    projects = json.loads(catalog.read_text())
    for project in projects:
        if project['id'] == 'aquila-pdv':
            project['image'] = '/src/img/optimized/pdv-home.webp'
        if not re.fullmatch(r'[a-z0-9-]+', project['id']):
            raise ValueError('ID de projeto inválido')
        source = root / unquote(project['image']).lstrip('/')
        if source.suffix == '.svg':
            continue
        destination = root / ('portfolio/img/thumbs' if project['image'].startswith('/portfolio/') else 'src/img/thumbs')
        destination.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as image:
            variants = []
            for width in [480, 800]:
                if image.width <= width:
                    continue
                resized = image.convert('RGB')
                resized.thumbnail((width, width * 10))
                filename = destination / f'{project["id"]}-{width}.webp'
                resized.save(filename, quality=85, method=6)
                variants.append({'src': '/' + filename.relative_to(root).as_posix(), 'width': resized.width})
            variants.append({'src': project['image'], 'width': image.width})
            project['imageVariants'] = variants
    catalog.write_text(json.dumps(projects, ensure_ascii=False, indent=2) + '\n')

if __name__ == '__main__':
    optimize()
