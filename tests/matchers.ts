import { expect } from "bun:test";

// Bunのマッチャー型定義
type MatcherResult = {
  pass: boolean;
  message: () => string;
};

// カスタムマッチャーの実装（型安全版）
const bunDomMatchers = {
  toBeInTheDocument(this: any, received: unknown): MatcherResult {
    const element = received as Element | null;
    const pass = element !== null && element !== undefined && document.body.contains(element);

    return {
      pass,
      message: () => pass
        ? `expected element not to be in the document`
        : `expected element to be in the document`
    };
  },

  toBeVisible(this: any, received: unknown): MatcherResult {
    const element = received as HTMLElement;
    if (!element || !document.body.contains(element)) {
      return {
        pass: false,
        message: () => `expected element to be visible but it's not in the document`
      };
    }

    const style = getComputedStyle(element);
    const isVisible =
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0;

    return {
      pass: isVisible,
      message: () => isVisible
        ? `expected element not to be visible`
        : `expected element to be visible`
    };
  },

  toHaveClass(this: any, received: unknown, ...expectedClasses: string[]): MatcherResult {
    const element = received as Element;
    if (!element || !element.classList) {
      return {
        pass: false,
        message: () => `expected element to have classes but element is invalid`
      };
    }

    const elementClasses = Array.from(element.classList);
    const pass = expectedClasses.every(className => elementClasses.includes(className));

    return {
      pass,
      message: () => pass
        ? `expected element not to have classes: ${expectedClasses.join(', ')}`
        : `expected element to have classes: ${expectedClasses.join(', ')}, but has: ${elementClasses.join(', ')}`
    };
  },

  toHaveTextContent(this: any, received: unknown, expectedText: string | RegExp): MatcherResult {
    const element = received as HTMLElement;
    if (!element) {
      return {
        pass: false,
        message: () => `expected element to have text content but element is invalid`
      };
    }

    const actualText = element.textContent || '';

    const pass = typeof expectedText === 'string'
      ? actualText.includes(expectedText)
      : expectedText.test(actualText);

    return {
      pass,
      message: () => pass
        ? `expected element not to have text content: ${expectedText}`
        : `expected element to have text content: ${expectedText}, but has: ${actualText}`
    };
  },

  toBeEmpty(this: any, received: unknown): MatcherResult {
    const element = received as HTMLElement;
    if (!element) {
      return {
        pass: false,
        message: () => `expected element to be empty but element is invalid`
      };
    }

    const pass = !element.innerHTML.trim();

    return {
      pass,
      message: () => pass
        ? `expected element not to be empty`
        : `expected element to be empty but has content: ${element.innerHTML}`
    };
  },

  toHaveAttribute(this: any, received: unknown, attrName: string, expectedValue?: string): MatcherResult {
    const element = received as Element;
    if (!element) {
      return {
        pass: false,
        message: () => `expected element to have attribute but element is invalid`
      };
    }

    const hasAttr = element.hasAttribute(attrName);

    if (expectedValue === undefined) {
      return {
        pass: hasAttr,
        message: () => hasAttr
          ? `expected element not to have attribute: ${attrName}`
          : `expected element to have attribute: ${attrName}`
      };
    }

    const actualValue = element.getAttribute(attrName);
    const pass = actualValue === expectedValue;

    return {
      pass,
      message: () => pass
        ? `expected element not to have attribute ${attrName}="${expectedValue}"`
        : `expected element to have attribute ${attrName}="${expectedValue}", but has: ${attrName}="${actualValue}"`
    };
  },

  toBeDisabled(this: any, received: unknown): MatcherResult {
    const element = received as HTMLElement;
    if (!element) {
      return {
        pass: false,
        message: () => `expected element to be disabled but element is invalid`
      };
    }

    const pass = element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';

    return {
      pass,
      message: () => pass
        ? `expected element not to be disabled`
        : `expected element to be disabled`
    };
  },

  toBeEnabled(this: any, received: unknown): MatcherResult {
    const element = received as HTMLElement;
    if (!element) {
      return {
        pass: false,
        message: () => `expected element to be enabled but element is invalid`
      };
    }

    const pass = !element.hasAttribute('disabled') && element.getAttribute('aria-disabled') !== 'true';

    return {
      pass,
      message: () => pass
        ? `expected element not to be enabled`
        : `expected element to be enabled`
    };
  },

  toHaveValue(this: any, received: unknown, expectedValue: string | number | string[]): MatcherResult {
    const element = received as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (!element || !('value' in element)) {
      return {
        pass: false,
        message: () => `expected element to have value but element is invalid`
      };
    }

    const actualValue = element.value;

    const pass = Array.isArray(expectedValue)
      ? expectedValue.includes(actualValue)
      : String(actualValue) === String(expectedValue);

    return {
      pass,
      message: () => pass
        ? `expected element not to have value: ${expectedValue}`
        : `expected element to have value: ${expectedValue}, but has: ${actualValue}`
    };
  },

  toContainElement(this: any, received: unknown, descendant: unknown): MatcherResult {
    const ancestor = received as Element;
    const descendantElement = descendant as Element | null;

    if (!ancestor) {
      return {
        pass: false,
        message: () => `expected element to contain descendant but ancestor is invalid`
      };
    }

    if (!descendantElement) {
      return {
        pass: false,
        message: () => `expected element to contain descendant but descendant is null`
      };
    }

    const pass = ancestor.contains(descendantElement);

    return {
      pass,
      message: () => pass
        ? `expected element not to contain the descendant element`
        : `expected element to contain the descendant element`
    };
  }
};

// Bunのexpectにマッチャーを追加（型安全な方法）
export function setupCustomMatchers() {
  // @ts-ignore - Bunの内部APIを使用
  expect.extend(bunDomMatchers);
}

// 型定義をグローバルに追加
declare module "bun:test" {
  interface Matchers<R = void> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeEmpty(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toContainElement(element: Element | null): R;
    toHaveAttribute(attr: string, value?: any): R;
    toHaveClass(...classNames: string[]): R;
    toHaveTextContent(text: string | RegExp): R;
    toHaveValue(value: string | string[] | number): R;
  }
}
