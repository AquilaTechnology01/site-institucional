"""Verifica sitemap, metadados e catálogo disponíveis no HTML publicado."""
from pathlib import Path
from html.parser import HTMLParser
import base64
import hashlib
import json
import re
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://www.aquilatechnology.com.br'


class Tags(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class SEOTest(unittest.TestCase):
    def test_sitemap_and_metadata(self):
        urls = ET.parse(ROOT / 'sitemap.xml').findall('{*}url/{*}loc')
        self.assertEqual(len(urls), 8)
        titles = set()
        for element in urls:
            url = element.text
            path = url.removeprefix(BASE).strip('/')
            path = 'index.html' if not path else 'portfolio/index.html' if path == 'portfolio' else path
            text = (ROOT / path).read_text()
            tags = Tags(text).tags
            canonicals = [a['href'] for t, a in tags if t == 'link' and a.get('rel') == 'canonical']
            self.assertEqual(canonicals, [url])
            self.assertEqual(len(re.findall('<h1[ >]', text)), 1)
            title = re.search(r'<title>(.*?)</title>', text)[1]
            self.assertNotIn(title, titles)
            titles.add(title)
            self.assertTrue(any(t == 'meta' and a.get('name') == 'description' and a.get('content') for t, a in tags))
            self.assertNotIn('noindex', text.lower())
            for content in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
                json.loads(content)
                digest = base64.b64encode(hashlib.sha256(content.encode()).digest()).decode()
                self.assertIn("'sha256-" + digest + "'", text)
        self.assertIn('Sitemap: ' + BASE + '/sitemap.xml', (ROOT / 'robots.txt').read_text())

    def test_static_portfolio(self):
        text = (ROOT / 'portfolio/index.html').read_text()
        projects = json.loads((ROOT / 'src/data/projects.json').read_text())
        for project in projects:
            if project['visibility'] == 'public':
                self.assertIn('<h3>' + project['title'] + '</h3>', text)


if __name__ == '__main__':
    unittest.main()
