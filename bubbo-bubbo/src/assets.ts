import { ExtensionType, settings, resolveTextureUrl, ResolveURLParser, extensions, Assets, UnresolvedAsset } from 'pixi.js';
import manifest from '../src/manifest.json';

export const resolveJsonUrl = {
  extension: ExtensionType.ResolveParser,
  test: (value: string) =>
    // @ts-expect-error should be fixed in the next version of pixi (RETINA_PREFIX is of type RegEx)
    settings.RETINA_PREFIX.test(value) && value.endsWith('.json'),
  parse: resolveTextureUrl.parse
} as ResolveURLParser

extensions.add(resolveJsonUrl)

/** 모든 자산 초기화 및 백그라운드 로딩 */
export async function initAssets() {
  //에셋매니페스트로 픽시 자산 초기화
  await Assets.init({ manifest })

  //로드스크린에쓸 자산 로드
  await Assets.loadBundle(['images/preload', 'default'])

  //존재하는 모든 번들 이름
  const allBundles = manifest.bundles.map(item => item.name);

  //모든 번들을 백그라운드에서 시작
  Assets.backgroundLoadBundle(allBundles)
}

/**
 * 번들이 이미 로드됐는지 체크
 * @param bundle 번들의 유니크 아이디
 * @returns 번들이 로드되었는지 여부
 */
export function isBundleLoaded(bundle: string) {
  const bundleManifest = manifest.bundles.find(b=>b.name === bundle);

  if (!bundleManifest) {
    return false;
  }

  for (const asset of bundleManifest.assets as UnresolvedAsset[]) {
    if (!Assets.cache.has(asset.alias as string)) {
      return false
    }
  }

  return true
}

export function areBundlesLoaded(bundles: string[]) {
  for (const name of bundles) {
    if (!isBundleLoaded(name)) {
      return false;
    }
  }
  
  return true;
}