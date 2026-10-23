"""Gera o catálogo HTML público para leitura sem JavaScript e por buscadores."""
from pathlib import Path
from html import escape
import json
import re


def render(root):
    projects = json.loads((root / 'src/data/projects.json').read_text())
    cards = []
    for project in projects:
        if project.get('visibility') != 'public':
            continue
        title = escape(project['title'])
        image = escape(project['image'], quote=True)
        alt = escape(project['imageAlt'], quote=True)
        cards.append(f'<article class="portfolio-card"><img src="{image}" alt="{alt}" width="800" height="450" loading="lazy" /><h3>{title}</h3><p>{escape(project["summary"])}</p><a class="text-link" href="/index.html#contato">Solicitar um projeto semelhante</a></article>')
    page = root / 'portfolio/index.html'
    markup = '\n            '.join(cards)
    content = re.sub(r'(<div id="project-list"[^>]*>).*?(</div>\s*<aside)', lambda m: m[1] + '\n            ' + markup + '\n          ' + m[2], page.read_text(), flags=re.S)
    page.write_text(content)


if __name__ == '__main__':
    render(Path(__file__).resolve().parent.parent)
