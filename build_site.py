#!/usr/bin/env python3
"""Build the three blocks into a GitHub Pages ready site in docs/."""

from pathlib import Path
import shutil
import subprocess

from launch import ROOT, home_page


def main():
    for block in ("Block I", "Block II"):
        subprocess.run(["npm", "run", "build", "--", "--base", "./"], cwd=ROOT / block, check=True)

    output = ROOT / "docs"
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    (output / "index.html").write_text(
        home_page(["./block-1/", "./block-2/", "./block-3/"]), encoding="utf-8"
    )
    (output / ".nojekyll").touch()
    for number, source in enumerate((ROOT / "Block I" / "dist", ROOT / "Block II" / "dist", ROOT / "Block III" / "MCQs"), 1):
        shutil.copytree(source, output / f"block-{number}", ignore=shutil.ignore_patterns("README.md", "audit_report.md", "audit.json"))
    print(f"Ready to publish: {output}")


if __name__ == "__main__":
    main()
