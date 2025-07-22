import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { useTheme } from '../../src/hooks/useTheme';
import '../setup'; // 必須！

// localStorageをモック
const localStorageMock = {
  getItem: mock((_key: string) => null),
  setItem: mock((_key: string, _value: string) => {}),
  removeItem: mock((_key: string) => {}),
  clear: mock(() => {}),
};

// matchMediaをモック
const matchMediaMock = mock((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: mock(() => {}),
  removeListener: mock(() => {}),
  addEventListener: mock(() => {}),
  removeEventListener: mock(() => {}),
  dispatchEvent: mock(() => {}),
}));

describe('useTheme フック', () => {
  beforeEach(() => {
    // DOMとlocalStorageのモックを設定
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
    });

    // document.documentElementのclassListをモック
    Object.defineProperty(document.documentElement, 'classList', {
      value: {
        toggle: mock((_className: string, _force?: boolean) => {}),
        add: mock((_className: string) => {}),
        remove: mock((_className: string) => {}),
        contains: mock((_className: string) => false),
      },
      writable: true,
    });

    // モックをリセット
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    matchMediaMock.mockClear();
    (document.documentElement.classList.toggle as any).mockClear();
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    matchMediaMock.mockClear();
  });

  test('保存された値がないときはシステム設定で初期化する', () => {
    // localStorageに保存値がない場合
    localStorageMock.getItem.mockReturnValue(null);
    // システム設定はライトモード
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: mock(() => {}),
      removeListener: mock(() => {}),
      addEventListener: mock(() => {}),
      removeEventListener: mock(() => {}),
      dispatchEvent: mock(() => {}),
    });

    const { result } = renderHook(() => useTheme());

    // 初期状態がシステム設定に基づいていることを確認
    expect(result.current.isDark).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('isDark');
    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
  });

  test('保存された値がないときはシステム設定（ダークモード）で初期化する', () => {
    // localStorageに保存値がない場合
    localStorageMock.getItem.mockReturnValue(null);
    // システム設定はダークモード
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: mock(() => {}),
      removeListener: mock(() => {}),
      addEventListener: mock(() => {}),
      removeEventListener: mock(() => {}),
      dispatchEvent: mock(() => {}),
    });

    const { result } = renderHook(() => useTheme());

    // 初期状態がシステム設定に基づいていることを確認
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });

  test('保存された設定があるときはそれで初期化する', () => {
    // localStorageに保存された値がある場合
    localStorageMock.getItem.mockReturnValue('true');

    const { result } = renderHook(() => useTheme());

    // 保存された値が使用されることを確認
    expect(result.current.isDark).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('isDark');
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });

  test('保存された設定（false）があるときはそれで初期化する', () => {
    // localStorageに保存された値がfalseの場合
    localStorageMock.getItem.mockReturnValue('false');

    const { result } = renderHook(() => useTheme());

    // 保存された値が使用されることを確認
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
  });

  test('toggle関数がテーマ状態を変更する', () => {
    // 初期状態をライトモードに設定
    localStorageMock.getItem.mockReturnValue('false');

    const { result } = renderHook(() => useTheme());

    // 初期状態を確認
    expect(result.current.isDark).toBe(false);

    // テーマを切り替え
    act(() => {
      result.current.toggle();
    });

    // 状態が変更されることを確認
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('isDark', 'true');
  });

  test('toggle関数がダークからライトへの切り替えで動作する', () => {
    // 初期状態をダークモードに設定
    localStorageMock.getItem.mockReturnValue('true');

    const { result } = renderHook(() => useTheme());

    // 初期状態を確認
    expect(result.current.isDark).toBe(true);

    // テーマを切り替え
    act(() => {
      result.current.toggle();
    });

    // 状態が変更されることを確認
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('isDark', 'false');
  });

  test('複数回のトグルが正しく動作する', () => {
    localStorageMock.getItem.mockReturnValue('false');

    const { result } = renderHook(() => useTheme());

    // 初期状態
    expect(result.current.isDark).toBe(false);

    // 1回目のトグル: light -> dark
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(true);

    // 2回目のトグル: dark -> light
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(false);

    // 3回目のトグル: light -> dark
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(true);
  });

  test('テーマ変更をlocalStorageに永続化する', () => {
    localStorageMock.getItem.mockReturnValue('false');

    const { result } = renderHook(() => useTheme());

    // テーマを切り替え
    act(() => {
      result.current.toggle();
    });

    // localStorageに保存されることを確認
    expect(localStorageMock.setItem).toHaveBeenCalledWith('isDark', 'true');

    // もう一度切り替え
    act(() => {
      result.current.toggle();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('isDark', 'false');
  });

  test('document要素にdarkクラスを正しく適用する', () => {
    localStorageMock.getItem.mockReturnValue('false');

    const { result } = renderHook(() => useTheme());

    // 初期化時にclassListが操作されることを確認
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);

    // テーマ切り替え時にもclassListが操作されることを確認
    act(() => {
      result.current.toggle();
    });

    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });

  test('無効なlocalStorageデータをエラースローで処理する', () => {
    // 不正なJSONデータをモック
    localStorageMock.getItem.mockReturnValue('invalid-json');

    // JSON.parseエラーが発生することを確認
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow();
  });

  test('正しいフックインターフェースを返す', () => {
    // 有効なデータでテスト
    localStorageMock.getItem.mockReturnValue('false');

    const { result } = renderHook(() => useTheme());

    // 返り値が正しいインターフェースを持つことを確認
    expect(typeof result.current.isDark).toBe('boolean');
    expect(typeof result.current.toggle).toBe('function');
    expect(Object.keys(result.current)).toEqual(['isDark', 'toggle']);
  });
});
