#!/bin/bash
# Script para publicar el proyecto a GitHub
# Ejecutar después de autenticar: git push -u origin main

cd "$(dirname "$0")"

echo "🔗 Remoto configurado:"
git remote -v

echo ""
echo "📤 Para publicar, ejecuta:"
echo "git push -u origin main"
echo ""
echo "Si no tienes autenticación, configura primero:"
echo "- GitHub CLI: gh auth login"
echo "- O token: git config --global credential.helper store"
echo "- O SSH: git remote set-url origin git@github.com:juanpduque/ai-first.git"