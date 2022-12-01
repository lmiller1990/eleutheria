import { readonly, ref, watchEffect } from "vue";

const loadedImageCount = ref(0);

function onLoaded() {
  loadedImageCount.value++;
}

export class ImageLoader {
  #id: string;
  #options: InitLoader;
  #created: number;
  #loadCount = ref(0);

  constructor(id: string, options: InitLoader) {
    this.#id = id;
    this.#options = options;
    this.#created = performance.now();

    watchEffect(() => {
      if (this.#loadCount.value === options.target) {
        const diff = performance.now() - this.#created;

        // wait the full minimum time before calling the callback
        if (diff < options.minimumLoadTimeMs) {
          window.setTimeout(
            options.onAllLoaded,
            options.minimumLoadTimeMs - diff
          );
        } else {
          // no minimum specified, or the minimum has already elapsed - just call it
          options.onAllLoaded();
        }
      }
    });
  }

  addLoader(el: HTMLImageElement) {
    el.onload = () => {
      this.#loadCount.value++;
    };
  }
}

const loaders = new Map<string, ImageLoader>();

interface InitLoader {
  target: number;
  minimumLoadTimeMs: number;
  onAllLoaded: () => void;
}

export function useImageLoader(id: string, options?: InitLoader) {
  if (!options) {
    const loader = loaders.get(id);

    if (!loader) {
      throw Error(`No loader with ${id} found.`);
    }

    return loader;
  }

  if (loaders.has(id)) {
    throw Error(`Loader with ${id} already exists.`);
  }

  loaders.set(id, new ImageLoader(id, options));

  return {
    onLoaded,
    loadedImageCount: readonly(loadedImageCount),
  };
}
