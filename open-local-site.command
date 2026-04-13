#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

export VOLTA_HOME="${VOLTA_HOME:-$HOME/.volta}"
export PATH="$VOLTA_HOME/bin:$PATH"

HOST="127.0.0.1"
PORT="4173"
URL="http://${HOST}:${PORT}/"

if ! command -v npm >/dev/null 2>&1; then
  echo "未找到 npm。请先安装 Node，或把 ~/.volta/bin 加入 PATH。"
  exit 1
fi

(
  for _ in {1..30}; do
    if curl -fsS "$URL" >/dev/null 2>&1; then
      open "$URL" >/dev/null 2>&1
      exit 0
    fi
    sleep 1
  done

  printf '浏览器未自动打开，请手动访问 %s\n' "$URL"
) &

exec npm run dev -- --host "$HOST" --port "$PORT"
