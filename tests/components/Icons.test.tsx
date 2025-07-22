import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import { EmailIcon, GitHubIcon } from '../../src/components/Icons';
import '../setup'; // 必須！

describe('Icons コンポーネント', () => {
  describe('GitHubIcon', () => {
    test('ライトモードでデフォルトスタイリングのGitHubアイコンをレンダリングする', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toBeInTheDocument();
      expect(githubIcon).toHaveAttribute('src', '/github-icon.svg');
    });

    test('isDarkModeがtrueのときダークモードスタイリングを適用する', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={true} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toHaveClass('brightness-0', 'invert');
    });

    test('ライトモードでinvertを適用しない', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toHaveClass('brightness-0');
      expect(githubIcon).not.toHaveClass('invert');
    });

    test('カスタムclassNameを受け付ける', () => {
      const customClass = 'w-6 h-6';
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon className={customClass} isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toHaveClass('w-6', 'h-6');
    });

    test('undefinedのclassNameを適切に処理する', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toBeInTheDocument();
      // className が undefined でもエラーにならないことを確認
    });

    test('トランジション効果を持つ', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<GitHubIcon isDarkMode={false} />));
      });

      const githubIcon = getByAltText('github icon');
      expect(githubIcon).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('EmailIcon', () => {
    test('ライトモードでデフォルトスタイリングのメールアイコンをレンダリングする', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon isDarkMode={false} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toBeInTheDocument();
      expect(emailIcon).toHaveAttribute('src', '/email-icon.svg');
    });

    test('isDarkModeがtrueのときダークモードスタイリングを適用する', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon isDarkMode={true} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toHaveClass('brightness-0', 'invert');
    });

    test('ライトモードでinvertを適用しない', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon isDarkMode={false} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toHaveClass('brightness-0');
      expect(emailIcon).not.toHaveClass('invert');
    });

    test('カスタムclassNameを受け付ける', () => {
      const customClass = 'w-4 h-4';
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon className={customClass} isDarkMode={false} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toHaveClass('w-4', 'h-4');
    });

    test('トランジション効果を持つ', () => {
      let getByAltText: any;
      act(() => {
        ({ getByAltText } = render(<EmailIcon isDarkMode={false} />));
      });

      const emailIcon = getByAltText('email icon');
      expect(emailIcon).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Icon Props Interface', () => {
    test('すべてのアイコンがオプションのclassNameプロップを受け付ける', () => {
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

    test('isDarkModeプロップを持つアイコンがテーマ変更に反応する', () => {
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
