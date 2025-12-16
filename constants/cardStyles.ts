/**
 * Style constants for portfolio cards
 */

/**
 * Mobile card styles
 */
export const MOBILE_CARD_STYLES = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    height: '100%',
    padding: '16px',
    gap: '10px',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
    gap: '6px',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    gap: '0',
    marginTop: '8px',
  },
  imagesContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    flex: '1 1 auto',
    width: '100%',
    minHeight: 0,
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '48%',
    overflow: 'hidden' as const,
    flexShrink: 0,
  },
} as const;

/**
 * Desktop card styles
 */
export const DESKTOP_CARD_STYLES = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    width: '100%',
    height: '100%',
    gap: '8px',
    padding: '8px',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    gap: '16px',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    gap: '0',
    marginTop: '40px',
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden' as const,
  },
  imageStyle: {
    width: '85%',
    height: '85%',
    objectFit: 'cover' as const,
    borderRadius: '12px',
  },
} as const;

/**
 * Fullscreen card styles
 */
export const FULLSCREEN_CARD_STYLES = {
  container: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden' as const,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block' as const,
    position: 'relative' as const,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
} as const;

