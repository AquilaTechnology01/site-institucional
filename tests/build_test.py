"""Regressão do empacotamento e das garantias de limpeza, sem dependências."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from build import build, minify_css
from version_assets import refresh


class BuildTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = tempfile.TemporaryDirectory()
        cls.root = Path(cls.temporary.name)
        for name in ['src', 'portfolio']:
            shutil.copytree(ROOT / name, cls.root / name)
        for p in [*ROOT.glob('*.html'),ROOT/'styles.css',ROOT/'robots.txt',ROOT/'sitemap.xml',ROOT/'_headers']:
            shutil.copy2(p, cls.root / p.name)
    @classmethod
    def tearDownClass(cls):
        cls.temporary.cleanup()

    def test_build_preserves_source_and_routes_and_cleans_stale_files(self):
        source = self.root/'portfolio/index.html'
        before = source.read_bytes()
        output = self.root/'dist'
        output.mkdir(exist_ok=True)
        (output/'stale-secret.txt').write_text('fixture')
        (self.root/'src/.env').write_text('TEST_ONLY=fixture')
        (self.root/'src/debug.log').write_text('fixture')
        (self.root/'src/data/private.json').write_text('{}')
        manifest = build(self.root)
        self.assertEqual(source.read_bytes(), before)
        for name in ['stale-secret.txt','src/.env','src/debug.log','src/data/private.json','docs','tests','scripts']:
            self.assertFalse((output/name).exists(), name)
        for name in ['index.html','portfolio/index.html','pdv.html','FAQ.html','blog.html','privacidade.html','termos.html','lgpd.html']:
            self.assertIn(name, manifest)
        projects=json.loads((output/'src/data/projects.json').read_text())
        self.assertEqual(len(projects), 8)
        self.assertEqual(projects,json.loads((self.root/'src/data/projects.json').read_text()))

    def test_content_hashes_cache_scope_and_repeatability(self):
        first=build(self.root)
        fingerprints={name:hashlib.sha256((self.root/'dist'/name).read_bytes()).hexdigest() for name in first}
        second=build(self.root)
        self.assertEqual(first,second)
        self.assertEqual(fingerprints,{name:hashlib.sha256((self.root/'dist'/name).read_bytes()).hexdigest() for name in second})
        for name in first:
            if name.startswith('assets/runtime/'):
                match=re.search(r'\.([a-f0-9]{16})\.(css|js)$',name)
                self.assertIsNotNone(match)
                self.assertEqual(match[1], fingerprints[name][:16])
        headers=(self.root/'dist/_headers').read_text()
        self.assertIn('/assets/runtime/*', headers)
        self.assertNotIn('\n/*\n', headers)
        self.assertNotIn('immutable', headers.split('/assets/runtime/*')[0])
        self.assertIn('/src/js/*\n  Cache-Control: no-cache', headers)

    def test_failed_validation_preserves_previous_dist(self):
        build(self.root)
        old=(self.root/'dist/index.html').read_bytes()
        source=self.root/'index.html';original=source.read_bytes()
        try:
            source.write_text(source.read_text().replace('</main>','<img src="/missing-file.png" /></main>'))
            with self.assertRaises(ValueError):build(self.root)
            self.assertEqual((self.root/'dist/index.html').read_bytes(),old)
        finally:source.write_bytes(original)

    def test_asset_version_changes_with_css_and_build_uses_bundles(self):
        stylesheet = self.root/'styles.css'
        original = stylesheet.read_bytes()
        try:
            refresh(self.root)
            before = (self.root/'index.html').read_text()
            stylesheet.write_bytes(original + b'\n/* cache regression fixture */\n')
            refresh(self.root)
            after = (self.root/'index.html').read_text()
            pattern = r'href="styles.css\?v=([a-f0-9]+)"'
            self.assertNotEqual(re.search(pattern, before)[1], re.search(pattern, after)[1])
            build(self.root)
            published = (self.root/'dist/index.html').read_text()
            self.assertRegex(published, r'href="/assets/runtime/home\.[a-f0-9]+\.css"')
            self.assertNotIn('src="/src/js/consent.js', published)
        finally:
            stylesheet.write_bytes(original)
            refresh(self.root)

    def test_static_catalog_rejects_unsafe_navigation(self):
        catalog = self.root/'src/data/projects.json'
        original = catalog.read_bytes()
        try:
            projects = json.loads(original)
            projects[0]['caseStudyUrl'] = 'javascript:alert(1)'
            catalog.write_text(json.dumps(projects))
            build(self.root)
            html = (self.root/'dist/portfolio/index.html').read_text()
            self.assertNotIn('href="javascript:', html)
            self.assertIn('Conversar sobre este projeto', html)
        finally:
            catalog.write_bytes(original)

    def test_css_minification_keeps_strings_and_math(self):
        css='/* comment */ .x { content: "a : b; /* literal */"; width: calc(100% - 2rem); --token: "a  b"; }'
        result=minify_css(css)
        self.assertIn('"a : b; /* literal */"', result)
        self.assertIn('calc(100% - 2rem)',result)
        self.assertIn('"a  b"',result)
        self.assertNotIn('/* comment */',result)
        self.assertIn('.form :invalid', minify_css('.form :invalid { color: red; }'))

if __name__=='__main__':unittest.main()
