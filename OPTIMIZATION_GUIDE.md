# Guía de Optimización de Archivos

Este documento contiene recomendaciones para optimizar imágenes y videos antes de subirlos al proyecto.

## ✅ Optimizaciones Implementadas

### Configuración Next.js
- ✅ Optimización automática de imágenes (AVIF, WebP)
- ✅ Lazy loading en todas las imágenes
- ✅ Decoding asíncrono para imágenes
- ✅ Preload metadata para videos
- ✅ GPU acceleration para animaciones

### Componentes Optimizados
- ✅ `SectionHero.tsx` - Videos con preload="metadata"
- ✅ `CommunityHubHorizontalScroll.tsx` - Lazy loading en imágenes y videos
- ✅ `Gallery.tsx` - Lazy loading en imágenes y videos
- ✅ `PortfolioStacking.tsx` - Lazy loading en todas las imágenes
- ✅ `BunkerNavbar.tsx` - Lazy loading en imagen de fondo
- ✅ `BunkerSlider.tsx` - Lazy loading en imágenes

## 📋 Recomendaciones para Nuevos Archivos

### Imágenes

#### Formatos Recomendados
1. **WebP** (Prioridad)
   - Calidad: 80-85% para fotos
   - Calidad: 90-95% para imágenes críticas
   - Herramienta: [Squoosh.app](https://squoosh.app)

2. **AVIF** (Si es posible)
   - Calidad: 75-80%
   - Mejor compresión que WebP
   - Soporte: ~85% navegadores

3. **JPEG** (Fallback)
   - Calidad: 80-85%
   - Usar solo si WebP no está disponible

#### Tamaños Recomendados
- **Hero/Slider**: 1920x1080px (Full HD) o 2560x1440px (2K)
- **Portfolio cards**: 1200x800px o 1600x1200px
- **Thumbnails**: 400x300px o 600x400px
- **Gallery**: 1920x1080px máximo

#### Peso Objetivo
- Hero images: **200-400 KB**
- Portfolio images: **150-300 KB**
- Thumbnails: **50-100 KB**
- ⚠️ **Evitar imágenes > 500 KB**

### Videos

#### Formatos Recomendados
1. **WebM** (Prioridad)
   - Codec: VP9 o AV1
   - Bitrate: 2-4 Mbps para 1080p
   - Herramienta: [HandBrake](https://handbrake.fr)

2. **MP4** (Fallback)
   - Codec: H.264
   - Bitrate: 3-5 Mbps para 1080p
   - Compatibilidad universal

#### Configuración Recomendada
- **Resolución**: 1920x1080px (1080p) máximo
- **Frame rate**: 24-30 fps
- **Bitrate**: 2-4 Mbps
- **Duración**: 10-30 segundos para loops

#### Peso Objetivo
- Videos cortos (10-30s): **2-5 MB**
- Videos de hero: **5-10 MB máximo**
- ⚠️ **Evitar videos > 15 MB**

## 🛠️ Herramientas Recomendadas

### Para Imágenes
1. **Squoosh.app** (Google) - Conversión y compresión online
2. **ImageOptim** - Compresión automática
3. **Sharp** (Node.js) - Procesamiento programático
4. **Next.js Image Optimization** - Automático en producción

### Para Videos
1. **HandBrake** - Conversión y compresión
2. **FFmpeg** - Línea de comandos
3. **Cloudinary** - Si usas servicio externo

## 📝 Checklist de Optimización

Antes de subir nuevos archivos:

- [ ] Convertir imágenes a WebP (con fallback JPEG)
- [ ] Redimensionar al tamaño exacto que se usa
- [ ] Comprimir imágenes (objetivo: < 300 KB)
- [ ] Convertir videos a WebM + MP4
- [ ] Limitar resolución de videos a 1080p
- [ ] Verificar que el peso del archivo esté dentro del objetivo
- [ ] Probar carga en conexión lenta (3G throttling en DevTools)

## 🚀 Comandos Útiles

### FFmpeg - Convertir Video a WebM
```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

### FFmpeg - Convertir Video a MP4 (H.264)
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k output.mp4
```

### FFmpeg - Redimensionar Video
```bash
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -preset slow -crf 22 output.mp4
```

## 📊 Métricas de Rendimiento

### Objetivos
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms

### Cómo Medir
1. Abre Chrome DevTools
2. Ve a la pestaña "Lighthouse"
3. Ejecuta un análisis de rendimiento
4. Revisa las métricas y recomendaciones

## ⚠️ Notas Importantes

1. **No optimizar imágenes que ya están en el proyecto** sin verificar que las animaciones GSAP sigan funcionando
2. **Mantener aspect ratios** para evitar layout shifts
3. **Usar lazy loading** para imágenes fuera del viewport inicial
4. **Preload solo videos críticos** (hero videos)
5. **Monitorear Core Web Vitals** en producción

## 🔄 Próximos Pasos

Si necesitas optimizar archivos existentes:
1. Hacer backup de los archivos originales
2. Convertir a formatos optimizados
3. Probar en desarrollo local
4. Verificar que las animaciones funcionen correctamente
5. Hacer commit de los cambios

