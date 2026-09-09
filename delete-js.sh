#!/usr/bin/env bash

# Hentikan script jika ada command yang error
set -e

# Ambil direktori root monorepo (lokasi script ini berada)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🧹 Memulai pembersihan file .js hasil kompilasi di folder src..."

TARGET_PATHS=(
  "$ROOT_DIR/packages"
  "$ROOT_DIR/apps/paperless-user"
  "$ROOT_DIR/apps/paperless-admin"
)

DELETED_TOTAL=0

for TARGET in "${TARGET_PATHS[@]}"; do
  if [ -d "$TARGET" ]; then
    # Hitung jumlah file yang cocok sebelum dihapus
    COUNT=$(find "$TARGET" -path "*/src/*" -type f \( -name "*.js" -o -name "*.js.map" \) | wc -l | tr -d ' ')

    if [ "$COUNT" -gt 0 ]; then
      find "$TARGET" -path "*/src/*" -type f \( -name "*.js" -o -name "*.js.map" \) -delete
      echo "  ✔ Dihapus $COUNT file dari: ${TARGET#$ROOT_DIR/}"
      DELETED_TOTAL=$((DELETED_TOTAL + COUNT))
    else
      echo "  - Bersih (tidak ada file .js liar) di: ${TARGET#$ROOT_DIR/}"
    fi
  else
    echo "  ⚠️ Direktori tidak ditemukan: ${TARGET#$ROOT_DIR/}"
  fi
done

echo "✅ Selesai! Total $DELETED_TOTAL file .js/.js.map berhasil dibersihkan."
