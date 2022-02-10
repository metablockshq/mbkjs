/**
 * Given a path from CMS like /img/content/author/stage-profile.png,
 * generate a map of optimized images and their paths
 */

const getOptimizedBase = path => path.replace("/img", "/optimized-img")

const getOptimizedPaths = path => {
  const base = getOptimizedBase(path)
  return {
    og: base + "/og.webp",
    w80: base + "/w-80.webp",
    w240Blurred: base + "/w-240-blurred.webp",
    w240: base + "/w-240.webp",
    w480Blurred: base + "/w-480-blurred.webp",
    w480: base + "/w-480.webp",
    w720: base + "/w-720.webp",
    w960: base + "/w-960.webp",
    w1440: base + "/w-1440.webp",
  }
}

const getOgSrc = path => `${getOptimizedBase(path)}/og.webp`

const getSrcSet = path => {
  const widths = [80, 240, 480, 720, 960, 1440]
  const optimizedPaths = getOptimizedPaths(path)

  return widths
    .map(w => `${optimizedPaths["w"+w]} ${w}w`)
    .join(", ")
}

export default {getOptimizedPaths, getOgSrc, getSrcSet}
