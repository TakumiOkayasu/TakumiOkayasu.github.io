// test/setup.ts
import { afterEach, beforeAll } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { cleanup } from '@testing-library/react';
import { setupCustomMatchers } from './matchers';

// Happy DOMのグローバル登録
GlobalRegistrator.register();

// カスタムマッチャーのセットアップ
setupCustomMatchers();

// fetchモックの型定義
type MockFetch = typeof fetch & {
  mockResponses?: Map<string, any>;
  mockError?: Error | null;
};

// グローバルfetchモックの作成
function createFetchMock(): MockFetch {
  const mockResponses = new Map<string, any>();

  const fetchMock = (async (input: RequestInfo | URL, _init?: RequestInit): Promise<Response> => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input instanceof Request
            ? input.url
            : '';

    console.log(`Mocked fetch called with: ${url}`);

    // エラーモックが設定されている場合
    if ((fetchMock as MockFetch).mockError) {
      throw (fetchMock as MockFetch).mockError;
    }

    // URL別のレスポンスを返す
    for (const [pattern, response] of mockResponses) {
      if (url.includes(pattern)) {
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // デフォルトレスポンス
    return new Response(JSON.stringify({ mock: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  // 必須の静的メソッドを追加
  (fetchMock as any).preconnect = (url: string) => {
    console.log(`Preconnect called with: ${url}`);
  };

  // カスタムプロパティを追加
  (fetchMock as MockFetch).mockResponses = mockResponses;
  (fetchMock as MockFetch).mockError = null;

  return fetchMock as MockFetch;
}

// グローバル変数として保持
let globalFetchMock: MockFetch;

// グローバルな設定
beforeAll(() => {
  // fetchのモック
  globalFetchMock = createFetchMock();
  global.fetch = globalFetchMock;

  // ResizeObserverのモック
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // IntersectionObserverのモック
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;

  // matchMediaのモック
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  // scrollToのモック
  window.HTMLElement.prototype.scrollTo = () => {};
  window.scrollTo = () => {};
});

// 各テスト後のクリーンアップ
afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  localStorage.clear();
  sessionStorage.clear();

  // fetchモックをリセット
  if (globalFetchMock) {
    globalFetchMock.mockResponses?.clear();
    globalFetchMock.mockError = null;
  }
});

// テスト用のユーティリティ関数をエクスポート

/**
 * 特定のURLパターンに対してモックレスポンスを設定
 */
export const mockFetchResponse = (
  urlPattern: string,
  responseData: any,
  _options: ResponseInit = {}
) => {
  if (!globalFetchMock.mockResponses) {
    globalFetchMock.mockResponses = new Map();
  }
  globalFetchMock.mockResponses.set(urlPattern, responseData);
};

/**
 * すべてのfetchリクエストに対して同じレスポンスを返す
 */
export const mockFetchGlobal = (responseData: any, options: ResponseInit = {}) => {
  global.fetch = Object.assign(
    async (): Promise<Response> => {
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
    },
    { preconnect: () => {} }
  ) as typeof fetch;
};

/**
 * fetchでエラーを発生させる
 */
export const mockFetchError = (error: Error) => {
  if (globalFetchMock) {
    globalFetchMock.mockError = error;
  }
};

/**
 * 複数のエンドポイントを一度にモック
 */
export const mockFetchMultiple = (responses: Record<string, any>) => {
  Object.entries(responses).forEach(([pattern, data]) => {
    mockFetchResponse(pattern, data);
  });
};

// 代替案: より簡潔な実装
export const simpleMockFetch = () => {
  // @ts-ignore - 型の問題を回避
  global.fetch = async (input: RequestInfo | URL, _init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    console.log(`Fetch called: ${url}`);
    return new Response(JSON.stringify({ mock: true }));
  };

  // @ts-ignore
  global.fetch.preconnect = () => {};
};
