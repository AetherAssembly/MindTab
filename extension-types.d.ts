interface Window {
  __MindTab: any;
}

declare var chrome: any;

declare function importScripts(...urls: string[]): void;

declare const DEFAULTS: Record<string, any>;

interface Element {
  checked: boolean;
  dataset: DOMStringMap;
  disabled: boolean;
  files: FileList | null;
  focus(): void;
  click(): void;
  style: CSSStyleDeclaration;
  validity: ValidityState;
  value: any;
}

interface Node {
  dataset: DOMStringMap;
}

interface EventTarget {
  checked: boolean;
  files: FileList | null;
  value: any;
}
