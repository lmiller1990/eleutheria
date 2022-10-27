import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";

type EmitterEvents = {
  "authentication:changed": () => void;
};

const emitter =
  new (class extends (EventEmitter as new () => TypedEmitter<EmitterEvents>) {})();

export function useEmitter() {
  return emitter;
}
