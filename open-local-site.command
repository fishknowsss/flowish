#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

export VOLTA_HOME="${VOLTA_HOME:-$HOME/.volta}"
export PATH="$VOLTA_HOME/bin:$PATH"

HOST="127.0.0.1"

if ! command -v node >/dev/null 2>&1; then
  echo "未找到 node。请先安装 Node，或把 ~/.volta/bin 加入 PATH。"
  exit 1
fi

exec node "./scripts/open-local-site.mjs"
