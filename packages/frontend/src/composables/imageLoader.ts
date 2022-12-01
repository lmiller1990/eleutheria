import { readonly, ref, watchEffect } from "vue";

export class ImageLoader {
  #created: number;
  #loadCount = ref(0);

  constructor(id: string, options: InitLoader) {
    this.#created = performance.now();

    function done() {
      options.onAllLoaded();
      loaders.delete(id);
    }

    watchEffect(() => {
      if (this.#loadCount.value === options.target) {
        const diff = performance.now() - this.#created;

        // wait the full minimum time before calling the callback
        if (diff < options.minimumLoadTimeMs) {
          window.setTimeout(done, options.minimumLoadTimeMs - diff);
        } else {
          // no minimum specified, or the minimum has already elapsed - just call it
          done();
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

  const loadedImageCount = ref(0);

  function onLoaded() {
    loadedImageCount.value++;
  }

  return {
    onLoaded,
    loadedImageCount: readonly(loadedImageCount),
  };
}
