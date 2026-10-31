#!/bin/sh
# Rebuild the local tools the video skills need in a fresh Linux / cloud container.
# Free, local installs only: nothing here signs up for or calls a paid service.
#   sh scripts/setup-video-skills.sh
# Afterwards, for lemo-opuscar renders:  export PATH="$HOME/.local/ffmpeg7/bin:$PATH"
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)

# xilo-opus-video: numpy + Python Playwright. Pin Playwright to the version whose
# Chromium is already on the machine (the Node playwright package), so no browser download is needed.
PW=$(node -p "require('playwright/package.json').version" 2>/dev/null || echo 1.63.0)
python3 -m pip install -q numpy "playwright==$PW"
python3 "$ROOT/.claude/skills/xilo-opus-video/scripts/check_env.py"

# lemo-opuscar wants ffmpeg 7+ (6.x breaks its loudness mux). Ubuntu 24.04 ships 6.1, so take the
# static 7.x build that the imageio-ffmpeg wheel carries and keep it out of the system PATH.
F7=$HOME/.local/ffmpeg7/bin
if [ ! -x "$F7/ffmpeg" ]; then
  tmp=$(mktemp -d)
  python3 -m pip download -q --no-deps imageio-ffmpeg -d "$tmp"
  python3 -m zipfile -e "$tmp"/imageio_ffmpeg-*.whl "$tmp/x"
  mkdir -p "$F7" && cp "$tmp"/x/imageio_ffmpeg/binaries/ffmpeg-* "$F7/ffmpeg" && chmod +x "$F7/ffmpeg"
  rm -rf "$tmp"
fi
"$F7/ffmpeg" -version | head -1

# lemo-opuscar: style library into ~/lemo-opuscar plus its core Node/Python packages.
sh "$ROOT/.claude/skills/lemo-opuscar/scripts/setup.sh" deps

# mg-styles-15 (kit, not a skill): Node packages and the soundtrack toolkit in its own venv.
# matplotlib 3.9.1 (pinned upstream) has no Python 3.13 wheel; 3.9.4 is the nearest that does.
MG=$ROOT/kits/mg-styles-15
if [ -f "$MG/package.json" ]; then
  (cd "$MG" && npm install --no-audit --no-fund --loglevel=error)
  [ -x "$MG/.venv/bin/python" ] || python3 -m venv "$MG/.venv"
  "$MG/.venv/bin/pip" install -q numpy==2.4.6 scipy==1.16.3 soundfile==0.14.0 numba==0.66.0 \
    pedalboard==0.9.25 pyloudnorm==0.2.0 matplotlib==3.9.4
  echo "mg-styles-15: render with"
  echo "  MG_CHROME=/opt/pw-browsers/chromium MG_GPU_ARGS='--no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader' node harness/render.mjs demos/<name>"
fi

# hyperframes: the CLI runs through npx; doctor reports what is missing.
npx -y hyperframes doctor || true
