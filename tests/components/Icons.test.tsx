import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import { EmailIcon, GitHubIcon } from '../../src/components/Icons';
import '../setup'; // 必須！

test('basic test', () => {
  expect(1 + 1).toBe(2);
});

test('DOM test', () => {
  // DOMが利用可能かチェック
  console.log('Document available:', typeof document !== 'undefined');
  console.log('Window available:', typeof window !== 'undefined');

  if (typeof document !== 'undefined') {
    document.body.innerHTML = '<div id="test">Hello</div>';
    const element = document.getElementById('test');
    expect(element?.textContent).toBe('Hello');
  } else {
    throw new Error('DOM is not available');
  }
});

describe('Icons Component', () => {
  describe('GitHubIcon', () => {
    test('renders github icon with default styling in light mode', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toBeInTheDocument();
      expect(githubIcon).toHaveAttribute('src', '/github-icon.svg');
    });

    test('applies dark mode styling when isDarkMode is true', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={true} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toHaveClass('brightness-0', 'invert');
    });

    test('does not apply invert in light mode', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toHaveClass('brightness-0');
      expect(githubIcon).not.toHaveClass('invert');
    });

    test('accepts custom className', () => {
      const customClass = 'w-6 h-6';
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon className={customClass} isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toHaveClass('w-6', 'h-6');
    });

    test('handles undefined className gracefully', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toBeInTheDocument();
      // className が undefined でもエラーにならないことを確認
    });

    test('has transition effect', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('EmailIcon', () => {
    test('renders email icon with default styling in light mode', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon isDarkMode={false} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toBeInTheDocument();
      expect(emailIcon).toHaveAttribute('src', '/email-icon.svg');
    });

    test('applies dark mode styling when isDarkMode is true', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon isDarkMode={true} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toHaveClass('brightness-0', 'invert');
    });

    test('does not apply invert in light mode', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon isDarkMode={false} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toHaveClass('brightness-0');
      expect(emailIcon).not.toHaveClass('invert');
    });

    test('accepts custom className', () => {
      const customClass = 'w-4 h-4';
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon className={customClass} isDarkMode={false} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toHaveClass('w-4', 'h-4');
    });

    test('has transition effect', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon isDarkMode={false} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Icon Props Interface', () => {
    test('all icons accept optional className prop', () => {
      const customClass = 'custom-icon-class';

      // GitHubIcon と EmailIcon のみ className を受け取る
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(
          <div>
            <GitHubIcon className={customClass} isDarkMode={false} />
            <EmailIcon className={customClass} isDarkMode={false} />
          </div>
        ));
      });

      const githubIcon = getByAltText('github icon');
      const emailIcon = getByAltText('email icon');

      expect(githubIcon).toHaveClass(customClass);
      expect(emailIcon).toHaveClass(customClass);
    });

    test('icons with isDarkMode prop respond to theme changes', () => {
      let rerender: any, getByAltText: any;
      act(() => {
        ({ rerender, getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).not.toHaveClass('invert');

      // ダークモードに変更
      act(() => {
        rerender(<GitHubIcon isDarkMode={true} />);
      });
      expect(githubIcon).toHaveClass('invert');
    });
  });
});
