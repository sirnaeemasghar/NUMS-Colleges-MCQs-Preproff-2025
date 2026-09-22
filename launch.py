#!/usr/bin/env python3
"""Launch the NUMS study home page and all three existing block sites."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser


ROOT = Path(__file__).resolve().parent
BLOCKS = [
    ("Block 1", ROOT / "Block I" / "dist", True),
    ("Block 2", ROOT / "Block II" / "dist", False),
    ("Block 3", ROOT / "Block III" / "MCQs", False),
]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


class BlockOneHandler(QuietHandler):
    """Let Block I's browser router handle direct links and page refreshes."""

    def do_GET(self):
        requested = self.translate_path(self.path)
        if not Path(requested).exists() and not self.path.startswith("/assets/"):
            self.path = "/index.html"
        super().do_GET()


class HomeHandler(QuietHandler):
    block_urls = []

    def do_GET(self):
        if self.path not in ("/", "/index.html"):
            self.send_error(404)
            return
        content = home_page(self.block_urls).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)


def home_page(block_urls):
        cards = "".join(
            f'<a class="card" href="{url}"><span class="number">0{i}</span>'
            f'<span class="label">Block {i}</span><span class="arrow" aria-hidden="true">↗</span></a>'
            for i, url in enumerate(block_urls, 1)
        )
        page = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>NUMS Pre-Prof MCQs</title>
<style>
:root{{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#17313d;background:#f3f8f8}}
*{{box-sizing:border-box}}body{{margin:0;min-height:100vh;display:grid;place-items:center;padding:32px}}
main{{width:min(100%,950px)}}.eyebrow{{font-size:.78rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#168578}}
h1{{font-size:clamp(2.5rem,7vw,5rem);letter-spacing:-.055em;line-height:1.05;margin:15px 0 16px}}
p{{font-size:1.12rem;color:#5f7780;margin:0 0 45px}}
.grid{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}}
.card{{min-height:190px;background:#fff;border:1px solid #dce9e8;border-radius:20px;padding:25px;text-decoration:none;color:inherit;display:flex;flex-direction:column;box-shadow:0 12px 35px #163d4510;transition:transform .2s,border-color .2s,box-shadow .2s}}
.card:hover,.card:focus-visible{{transform:translateY(-4px);border-color:#168578;box-shadow:0 18px 40px #163d4520;outline:none}}
.number{{font-size:.8rem;font-weight:800;letter-spacing:.16em;color:#168578}}.label{{font-size:1.7rem;font-weight:800;margin-top:auto}}.arrow{{align-self:flex-end;font-size:1.5rem;color:#168578}}
footer{{margin-top:50px;text-align:center;color:#5f7780;font-size:.92rem;line-height:1.8}}
footer a{{color:#087c70;font-weight:700;text-decoration:none}}footer a:hover,footer a:focus-visible{{text-decoration:underline}}
.heart{{color:#e65370}}.share{{display:block;margin-top:10px;font-size:.82rem;overflow-wrap:anywhere}}
@media(max-width:650px){{.grid{{grid-template-columns:1fr}}.card{{min-height:120px}}p{{margin-bottom:30px}}}}
</style></head><body><main><div class="eyebrow">Your study hub</div><h1>NUMS Pre-Prof MCQs</h1>
<p>Choose a block to start studying.</p><nav class="grid" aria-label="Study blocks">{cards}</nav>
<footer>Created with <span class="heart" aria-label="love">♥</span> by <a href="https://github.com/sirnaeemasghar">Naeem Asghar</a><br>
Enjoying this study hub? <a href="https://github.com/sirnaeemasghar/NUMS-Colleges-MCQs-Preproff-2025">Give it a star on GitHub ★</a>
<span class="share">Share this site: <a href="https://sirnaeemasghar.github.io/NUMS-Colleges-MCQs-Preproff-2025/">sirnaeemasghar.github.io/NUMS-Colleges-MCQs-Preproff-2025/</a></span></footer>
</main></body></html>"""
        return page


def serve(handler, directory=None):
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(handler, directory=str(directory)) if directory else handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def main():
    missing = [str(path) for _, path, _ in BLOCKS if not (path / "index.html").is_file()]
    if missing:
        raise SystemExit("Missing web page(s):\n" + "\n".join(missing))

    block_servers = [serve(BlockOneHandler if spa else QuietHandler, path) for _, path, spa in BLOCKS]
    HomeHandler.block_urls = [f"http://127.0.0.1:{server.server_port}/" for server in block_servers]
    home = serve(HomeHandler)
    url = f"http://127.0.0.1:{home.server_port}/"
    print(f"NUMS Pre-Prof MCQs is ready: {url}", flush=True)
    print("Keep this window open while studying. Press Ctrl+C to stop.", flush=True)
    webbrowser.open(url)
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        print("\nStopping servers.")
    finally:
        home.shutdown()
        for server in block_servers:
            server.shutdown()


if __name__ == "__main__":
    main()
