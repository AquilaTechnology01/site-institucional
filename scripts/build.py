"""Build estático determinístico, sem dependências e sem modificar o código-fonte."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import hashlib
import json
import re
import shutil
import tempfile
from render_portfolio import render

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_EXTENSIONS = {'.html', '.css', '.js', '.json', '.png', '.webp', '.avif', '.jpg', '.jpeg', '.svg', '.ico'}
EXTENSIONLESS_IMAGES = {'src/img/PDV/home', 'src/img/PDV/login'}


def minify_css(source):
    """Remove comentários/espaços externos; preserva literais e espaços de calc()."""
    strings = []
    def protect(match):
        value = match[0]
        if value.startswith('/*'):
            return ''
        strings.append(value)
        return f'__AQUILA_STRING_{len(strings) - 1}__'
    text = re.sub(r'''"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|/\*[\s\S]*?\*/''', protect, source)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s*([{};,>])\s*', r'\1', text)
    # Um espaço antes de : pode ser combinador descendente (.form :invalid).
    text = re.sub(r':\s+', ':', text).replace(';}', '}').strip()
    for index, value in enumerate(strings):
        text = text.replace(f'__AQUILA_STRING_{index}__', value)
    return text


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if value and key in ('src', 'href'):
                self.urls.append(value)
            elif value and key == 'srcset':
                self.urls.extend(item.strip().split()[0] for item in value.split(','))


def validate(output):
    """Falha antes de substituir dist se uma página ou catálogo aponta a arquivo ausente."""
    for page in output.rglob('*.html'):
        parser = References()
        parser.feed(page.read_text())
        for value in parser.urls:
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path:
                continue
            target = output / unquote(url.path).lstrip('/') if value.startswith('/') else page.parent / unquote(url.path)
            if not target.resolve().is_relative_to(output.resolve()):
                raise ValueError(f'Referência fora do site: {page.name}')
            if not target.exists():
                raise ValueError(f'Recurso ausente: {page.relative_to(output)} → {value}')
    for project in json.loads((output / 'src/data/projects.json').read_text()):
        images = [project['image'], *[item['src'] for item in project.get('gallery', [])], *[item['src'] for item in project.get('imageVariants', [])]]
        for value in images:
            target = output / unquote(value).lstrip('/')
            if not target.resolve().is_relative_to(output.resolve()) or not target.is_file():
                raise ValueError('Imagem do catálogo ausente ou fora da saída')


def build(root=ROOT):
    output = root / 'dist'
    if output.is_symlink():
        raise ValueError('dist não pode ser link simbólico')
    with tempfile.TemporaryDirectory(prefix='.build-', dir=root) as temporary:
        work = Path(temporary)
        stage = work / 'site'
        stage.mkdir()
        for page in root.glob('*.html'):
            shutil.copy2(page, stage / page.name)
        for name in ['styles.css', 'robots.txt', 'sitemap.xml', '_headers']:
            shutil.copy2(root / name, stage / name)
        # Mantém URLs legadas dos arquivos públicos; nunca copia diretórios ocultos,
        # logs, bancos, mapas de fonte, caches Python, .env ou arquivos arbitrários.
        for name in ['src', 'portfolio']:
            for source in (root / name).rglob('*'):
                relative = source.relative_to(root)
                if source.is_symlink():
                    raise ValueError(f'Link simbólico não permitido na origem pública: {relative}')
                if not source.is_file() or any(part.startswith('.') or part == '__pycache__' for part in relative.parts):
                    continue
                if source.suffix.lower() not in PUBLIC_EXTENSIONS and relative.as_posix() not in EXTENSIONLESS_IMAGES:
                    continue
                if source.suffix == '.json' and relative.as_posix() != 'src/data/projects.json':
                    continue
                destination = stage / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
        render(root, stage)
        catalog = stage / 'src/data/projects.json'
        catalog.write_text(json.dumps(json.loads(catalog.read_text()), ensure_ascii=False, separators=(',', ':')))
        runtime = stage / 'assets/runtime'
        runtime.mkdir(parents=True)
        manifest = {}
        def bundle(label, sources, extension):
            contents = [ (root / source).read_text() for source in sources ]
            text = minify_css('\n'.join(contents)) if extension == 'css' else '\n;\n'.join(contents)
            data = text.encode()
            digest = hashlib.sha256(data).hexdigest()[:16]
            path = runtime / f'{label}.{digest}.{extension}'
            path.write_bytes(data)
            return '/' + path.relative_to(stage).as_posix()
        common_css = bundle('site', ['styles.css', 'src/consent.css'], 'css')
        portfolio_css = bundle('portfolio', ['src/portfolio.css'], 'css')
        common_js = bundle('site', ['src/js/main.js', 'src/js/consent.js'], 'js')
        contact_js = bundle('home', ['src/js/contact.js', 'src/js/executive-slider.js', 'src/js/showcase.js'], 'js')
        portfolio_js = bundle('portfolio', ['src/js/portfolio-core.js', 'src/js/portfolio.js'], 'js')
        home_css = bundle('home', ['styles.css', 'src/consent.css', 'src/executive-slider.css'], 'css')
        replacements = {'/styles.css':common_css, '/src/portfolio.css':portfolio_css, '/src/js/main.js':common_js, '/src/js/contact.js':contact_js, '/src/js/portfolio-core.js':portfolio_js}
        removed = {'/src/js/showcase.js','/src/executive-slider.css','/src/js/executive-slider.js','/src/consent.css','/src/js/consent.js','/src/js/portfolio.js'}
        for page in stage.rglob('*.html'):
            def replace_tag(match):
                tag = match[0]
                attribute = re.search(r'(?:href|src)="([^"]+)"', tag)
                if not attribute:
                    return tag
                normalized = '/' + attribute[1].lstrip('/')
                if normalized in removed:
                    return ''
                if normalized == '/styles.css' and page == stage / 'index.html':
                    return tag.replace(attribute[1], home_css)
                if normalized in replacements:
                    return tag.replace(attribute[1], replacements[normalized])
                return tag
            page.write_text(re.sub(r'<link\b[^>]*>|<script\b[^>]*src="[^"]+"[^>]*></script>', replace_tag, page.read_text()))
        validate(stage)
        for path in stage.rglob('*'):
            if path.is_file():
                manifest[path.relative_to(stage).as_posix()] = path.stat().st_size
        # Troca somente depois de validar. Em caso de falha, restaura a saída anterior.
        previous = work / 'previous'
        if output.exists():
            output.replace(previous)
        try:
            stage.replace(output)
        except Exception:
            if previous.exists():
                previous.replace(output)
            raise
    return manifest


if __name__ == '__main__':
    files = build()
    print(f'Build validado em dist/: {len(files)} arquivos, {sum(files.values())} bytes. Nenhum deploy executado.')
