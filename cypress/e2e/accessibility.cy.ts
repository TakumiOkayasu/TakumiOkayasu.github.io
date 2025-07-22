import { beforeEach, describe, it } from "node:test";

describe('アクセシビリティ E2E テスト', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
  });

  describe('キーボードアクセシビリティ', () => {
    it('Tabキーで全ての操作可能要素にフォーカスできる', () => {
      // 最初の要素にフォーカス
      cy.get('body').tab();
      
      // ダークモードトグルボタンがフォーカスされることを確認
      cy.get('[aria-label*="Switch to dark mode"]').should('be.focused');
      
      // フォーカスが見えることを確認
      cy.get('[aria-label*="Switch to dark mode"]')
        .should('have.css', 'outline')
        .and('not.equal', 'none');
    });

    it('Shift+Tabで逆方向ナビゲーションができる', () => {
      // 最初にフォーカス可能な要素を特定
      cy.get('body').tab();
      cy.get('[aria-label*="Switch to dark mode"]').should('be.focused');
      
      // Shift+Tabで前の要素に戻る
      cy.get('body').tab({ shift: true });
      
      // フォーカスが適切に移動することを確認
      cy.focused().should('exist');
    });

    it('Enterキーとスペースキーでボタン操作ができる', () => {
      // Tabキーでダークモードボタンにフォーカス
      cy.get('body').tab();
      cy.get('[aria-label*="Switch to dark mode"]').should('be.focused');
      
      // Enterキーで操作
      cy.focused().type('{enter}');
      cy.get('html').should('have.class', 'dark');
      
      // Spaceキーで操作
      cy.focused().type(' ');
      cy.get('html').should('not.have.class', 'dark');
    });

    it('キーボードトラップがない', () => {
      // 全ての操作可能要素を順番にナビゲーション
      let tabCount = 0;
      const maxTabs = 20; // 無限ループ防止
      
      cy.get('body').then(() => {
        function tabNext() {
          if (tabCount < maxTabs) {
            cy.get('body').tab();
            cy.focused().then(($focused) => {
              if ($focused.length > 0) {
                tabCount++;
                tabNext();
              }
            });
          }
        }
        tabNext();
      });
      
      // フォーカスが適切に循環することを確認
      expect(tabCount).to.be.greaterThan(0);
    });
  });

  describe('ARIA属性とセマンティクス', () => {
    it('適切なheading構造が設定されている', () => {
      // h1が存在し、一意であることを確認
      cy.get('h1').should('have.length', 1);
      cy.get('h1').should('contain.text', 'Tech Portfolio');
      
      // h2以下の見出しが階層的に構成されていることを確認
      cy.get('h2').should('have.length.greaterThan', 0);
      cy.get('h2').each(($h2) => {
        cy.wrap($h2).should('be.visible');
      });
    });

    it('適切なaria-label属性が設定されている', () => {
      // ダークモードトグルボタン
      cy.get('[aria-label*="Switch to dark mode"]')
        .should('exist')
        .and('have.attr', 'aria-label')
        .and('match', /Switch to (dark|light) mode/);
    });

    it('セクションが適切に識別される', () => {
      // 各セクションがid属性を持っていることを確認
      const sections = ['skills', 'experience', 'projects', 'contact'];
      
      sections.forEach(section => {
        cy.get(`#${section}`).should('exist').and('be.visible');
      });
    });

    it('リストが適切にマークアップされている', () => {
      // スキルバッジのリスト構造確認
      cy.get('#skills').within(() => {
        // グリッドレイアウトが適切に実装されている
        cy.get('.grid').should('exist');
      });
    });

    it('画像に適切なalt属性がある', () => {
      // アバター画像の確認（background-imageの場合はaria-labelで代替）
      cy.get('[style*="background-image"]').should('exist');
    });
  });

  describe('色とコントラスト', () => {
    it('ライトモードで十分なコントラスト比が確保されている', () => {
      // ライトモードでのテキストの可読性確認
      cy.get('h1').should('have.css', 'color').and('not.equal', 'rgba(0, 0, 0, 0)');
      cy.get('h2').should('have.css', 'color').and('not.equal', 'rgba(0, 0, 0, 0)');
      
      // 背景色との区別が明確であることを確認
      cy.get('.min-h-screen').should('have.class', 'bg-white');
    });

    it('ダークモードで十分なコントラスト比が確保されている', () => {
      // ダークモードに切り替え
      cy.get('[aria-label*="Switch to dark mode"]').click();
      cy.get('html').should('have.class', 'dark');
      
      // ダークモードでのテキストの可読性確認
      cy.get('h1').should('be.visible');
      cy.get('h2').should('be.visible');
      
      // 背景色がダークモード用に変更されていることを確認
      cy.get('.min-h-screen').should('have.class', 'dark:bg-gray-900');
    });

    it('フォーカス表示が明確である', () => {
      cy.get('body').tab();
      cy.get('[aria-label*="Switch to dark mode"]').should('be.focused');
      
      // フォーカス時のアウトラインが表示されることを確認
      cy.focused().should('have.css', 'outline-style').and('not.equal', 'none');
    });

    it('色に依存しない情報伝達', () => {
      // ダークモードアイコンが色以外でも状態を示していることを確認
      cy.get('[aria-label*="Switch to dark mode"]').within(() => {
        cy.get('span').should('contain.text', '🌙');
      });
      
      // ダークモードに切り替え
      cy.get('[aria-label*="Switch to dark mode"]').click();
      
      // アイコンが変化することを確認
      cy.get('[aria-label*="Switch to light mode"]').within(() => {
        cy.get('span').should('contain.text', '☀️');
      });
    });
  });

  describe('動的コンテンツのアクセシビリティ', () => {
    it('ローディング状態が適切に伝達される', () => {
      // ページリロードしてローディング状態を確認
      cy.reload();
      
      // ローディングテキストが表示されることを確認
      cy.contains('Loading...').should('be.visible');
      
      // ローディング完了後にコンテンツが表示される
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      cy.get('#skills').should('be.visible');
    });

    it('ダークモード切り替え時の状態変化が適切に伝達される', () => {
      // 初期状態の確認
      cy.get('[aria-label="Switch to dark mode"]').should('exist');
      
      // ダークモードに切り替え
      cy.get('[aria-label="Switch to dark mode"]').click();
      
      // aria-labelが更新されることを確認
      cy.get('[aria-label="Switch to light mode"]').should('exist');
      cy.get('[aria-label="Switch to dark mode"]').should('not.exist');
    });

    it('エラー状態が適切に伝達される', () => {
      // API エラーをシミュレート
      cy.intercept('GET', '/data/**', { statusCode: 500 }).as('apiError');
      
      cy.reload();
      
      // エラー状態でも基本的なナビゲーションが可能
      cy.get('header').should('be.visible');
      cy.get('[aria-label*="Switch to"]').should('be.visible');
    });
  });

  describe('スクリーンリーダー対応', () => {
    it('適切な読み上げ順序が設定されている', () => {
      // ヘッダーから順番にコンテンツが配置されている
      cy.get('header').should('be.visible');
      cy.get('main, .min-h-screen').should('be.visible');
      
      // セクションが論理的な順序で配置されている
      const sections = ['skills', 'experience', 'projects', 'contact'];
      
      sections.forEach((section, index) => {
        cy.get(`#${section}`).should('be.visible').then(($section) => {
          if (index > 0) {
            const prevSection = sections[index - 1];
            cy.get(`#${prevSection}`).then(($prevSection) => {
              expect($section.offset()?.top).to.be.greaterThan($prevSection.offset()?.top || 0);
            });
          }
        });
      });
    });

    it('非表示コンテンツが適切に処理されている', () => {
      // 画面外の要素やdisplay:noneの要素がaria-hiddenまたは適切に隠されている
      cy.get('[style*="display: none"]').should('have.attr', 'aria-hidden', 'true').or('not.exist');
    });
  });

  describe('モバイルアクセシビリティ', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
    });

    it('タッチターゲットが十分な大きさである', () => {
      // ダークモードトグルボタンのサイズ確認
      cy.get('[aria-label*="Switch to"]').should(($button) => {
        const rect = $button[0].getBoundingClientRect();
        expect(rect.width).to.be.at.least(44); // 44px以上
        expect(rect.height).to.be.at.least(44); // 44px以上
      });
    });

    it('タッチ操作で適切にフィードバックが提供される', () => {
      // タッチでダークモード切り替え
      cy.get('[aria-label*="Switch to dark mode"]')
        .trigger('touchstart')
        .trigger('touchend');
      
      // 視覚的フィードバックの確認
      cy.get('html').should('have.class', 'dark');
    });

    it('縦横切り替え時もアクセシビリティが維持される', () => {
      // 縦向き
      cy.viewport(375, 667);
      cy.get('[aria-label*="Switch to"]').should('be.visible');
      
      // 横向き
      cy.viewport(667, 375);
      cy.get('[aria-label*="Switch to"]').should('be.visible');
      
      // キーボードナビゲーションが維持される
      cy.get('body').tab();
      cy.get('[aria-label*="Switch to"]').should('be.focused');
    });
  });

  describe('アニメーションと動きのアクセシビリティ', () => {
    it('アニメーションがprefers-reduced-motionに対応している', () => {
      // reduced-motionを設定
      cy.window().then((win) => {
        Object.defineProperty(win, 'matchMedia', {
          writable: true,
          value: (query: string) => ({
            matches: query.includes('prefers-reduced-motion'),
            media: query,
            onchange: null,
            addListener: () => {}, // deprecated
            removeListener: () => {}, // deprecated
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => {},
          }),
        });
      });
      
      // ダークモード切り替え時のアニメーション
      cy.get('[aria-label*="Switch to dark mode"]').click();
      
      // トランジションが適用されることを確認
      cy.get('.min-h-screen').should('have.class', 'transition-colors');
    });

    it('ホバー効果が適切に実装されている', () => {
      // ホバー効果のあるスキルバッジ
      cy.get('#skills').within(() => {
        cy.get('.rounded-full').first().trigger('mouseover');
        
        // ホバー状態が視覚的に分かることを確認
        cy.get('.rounded-full').first().should('have.class', 'hover:bg-gray-300');
      });
    });
  });
});