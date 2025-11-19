# Solución para el Error "Cannot find module './350.js'"

## ¿Por qué ocurre este error?

Este error es causado por un **caché corrupto de Next.js/webpack**. Ocurre cuando:

1. **Múltiples procesos de Node** están corriendo simultáneamente
2. **Hot-reload falla** durante el desarrollo
3. **Cambios en archivos** mientras el servidor está compilando
4. **Caché de webpack** se corrompe por interrupciones

## Solución Rápida

He agregado scripts útiles en `package.json`:

### Para Windows:
```bash
npm run clean:win
npm run dev
```

### Para desarrollo con limpieza automática:
```bash
npm run dev:clean
```

### Para build con limpieza:
```bash
npm run build:clean
```

## Solución Manual

Si el error persiste, ejecuta estos comandos en PowerShell:

```powershell
# 1. Detener todos los procesos de Node
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

# 2. Eliminar el caché de Next.js
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# 3. Eliminar caché de node_modules
Remove-Item -Path node_modules/.cache -Recurse -Force -ErrorAction SilentlyContinue

# 4. Reconstruir y reiniciar
npm run build
npm run dev
```

## Prevención

- **Cierra el servidor** antes de hacer cambios grandes
- **Espera** a que termine la compilación antes de hacer más cambios
- **No ejecutes múltiples instancias** de `npm run dev` simultáneamente
- **Usa `npm run dev:clean`** si el problema es recurrente

## Nota

Este es un problema conocido de Next.js 13.x con webpack. Si el problema persiste frecuentemente, considera actualizar a Next.js 14+ que tiene mejor manejo del caché.

