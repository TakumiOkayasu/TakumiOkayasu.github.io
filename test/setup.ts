// Bunネイティブテストのセットアップ
import { beforeAll, afterEach } from "bun:test";
import "@testing-library/jest-dom";

// Happy DOMのグローバル登録（Reactコンポーネントテスト用）
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

// グローバルなモック
beforeAll(() => {
  // fetch APIのモック
  global.fetch = async (url: string | URL | Request) => {
    console.log(`Mocked fetch called with: ${url}`);
    return new Response(JSON.stringify({ mock: true }));
  };

  // その他の必要なグローバルモック
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// 各テスト後のクリーンアップ
afterEach(() => {
  // DOMのクリーンアップ
  document.body.innerHTML = "";

  // ローカルストレージのクリア
  localStorage.clear();
  sessionStorage.clear();
});
