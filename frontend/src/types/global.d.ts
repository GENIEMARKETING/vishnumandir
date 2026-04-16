export {};

declare global {
  interface Window {
    Zeffy?: {
      bind?: () => void;
    };
  }
}

