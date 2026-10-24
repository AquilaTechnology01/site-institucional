"""Gera o catálogo HTML sem JS. O build pode escrever numa saída separada."""
from pathlib import Path
from html import escape
import json
import re


def render(root, destination=None):
    projects = json.loads((root / 'src/data/projects.json').read_text())
    cards = []
    for project in projects:
        if project.get('visibility') != 'public':
            continue
        title = escape(project['title'])
        image = escape(project['image'], quote=True)
        alt = escape(project['imageAlt'], quote=True)
        variants = project.get('imageVariants', [])
        responsive = ''
        if variants:
            srcset = ', '.join(f'{item["src"]} {int(item["width"])}w' for item in variants)
            responsive = f' srcset="{escape(srcset, quote=True)}" sizes="(max-width: 480px) 92vw, (max-width: 900px) 44vw, 26vw"'
        cards.append(f'<article class="portfolio-card"><img src="{image}"{responsive} alt="{alt}" width="800" height="450" loading="lazy" /><h3>{title}</h3><p>{escape(project["summary"])}</p><a class="text-link" href="/index.html#contato">Solicitar um projeto semelhante</a></article>')
    page = root / 'portfolio/index.html'
    markup = '\n            '.join(cards)
    content, count = re.subn(r'(<div id="project-list"[^>]*>).*?(</div>\s*<aside)', lambda m: m[1] + '\n            ' + markup + '\n          ' + m[2], page.read_text(), flags=re.S)
    if count != 1:
        raise ValueError('Estrutura do catálogo não reconhecida; geração interrompida.')
    target = (destination or root) / 'portfolio/index.html'
    target.write_text(content)


if __name__ == '__main__':
    render(Path(__file__).resolve().parent.parent)
