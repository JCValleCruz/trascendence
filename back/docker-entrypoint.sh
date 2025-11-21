#!/bin/sh
set -e

# Crear directorio si no existe
mkdir -p /app/data

# Seedear solo si la base de datos no existe
if [ ! -f /app/data/dev.sqlite ]; then
  echo "Database not found. Seeding..."
  npm run seed
else
  echo "Database already exists. Skipping seed."
fi

# Iniciar la aplicación
exec "$@"
