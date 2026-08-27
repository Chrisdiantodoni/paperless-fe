#!/bin/bash

# Target direktori (default: direktori saat ini)
TARGET_DIR="${1:-.}"

# Ambil user dan group aktif saat ini
CURRENT_USER=$(id -un)
CURRENT_GROUP=$(id -gn)

echo "🔍 Memindai file/folder milik 'root' di: $TARGET_DIR"

# Cari semua file dan direktori yang dimiliki root
ROOT_ITEMS=$(find "$TARGET_DIR" -user root 2>/dev/null)

if [ -z "$ROOT_ITEMS" ]; then
  echo "✅ Tidak ditemukan file atau folder milik root."
  exit 0
fi

echo "⚠️ Ditemukan item milik root. Mengubah kepemilikan ke $CURRENT_USER:$CURRENT_GROUP..."

# Ubah ownership item milik root ke user saat ini (membutuhkan sudo)
sudo find "$TARGET_DIR" -user root -exec chown "$CURRENT_USER:$CURRENT_GROUP" {} +

echo "✅ Kepemilikan berhasil diperbarui!"
