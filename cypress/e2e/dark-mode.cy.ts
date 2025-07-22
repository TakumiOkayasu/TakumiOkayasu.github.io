import { describe, beforeEach, it } from "node:test";

describe('ダークモード E2E テスト', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // データ読み込み完了まで待機
    cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
  });

  describe('ダークモード切り替え機能', () => {
    it('初期状態でライトモードが適用されている', () => {
      // HTMLのdarkクラスがないことを確認
      cy.get('html').should('not.have.class', 'dark');
      
      // ダークモードトグルボタンが表示されることを確認
      cy.get('[aria-label*="Switch to dark mode"]').should('be.visible');
      
      // ライトモードの背景色を確認
      cy.get('.min-h-screen').should('have.class', 'bg-white');
    });

    it('ダークモードトグルボタンクリックでダークモードに切り替わる', () => {
      // ダークモードボタンをクリック
      cy.get('[aria-label*="Switch to dark mode"]').click();
      
      // HTMLにdarkクラスが追加されることを確認
      cy.get('html').should('have.class', 'dark');
      
      // ボタンのaria-labelが更新されることを確認
      cy.get('[aria-label*="Switch to light mode"]').should('be.visible');
      
      // アイコンが変更されることを確認（月→太陽）
      cy.get('[aria-label*="Switch to light mode"]').within(() => {
        cy.get('span').should('contain.text', '☀️');
      });
    });

    it('ダークモードからライトモードに戻すことができる', () => {
      // ダークモードに切り替え
      cy.get('[aria-label*="Switch to dark mode"]').click();
      cy.get('html').should('have.class', 'dark');
      
      // ライトモードに戻す
      cy.get('[aria-label*="Switch to light mode"]').click();
      cy.get('html').should('not.have.class', 'dark');
      
      // ボタンのaria-labelが元に戻ることを確認
      cy.get('[aria-label*="Switch to dark mode"]').should('be.visible');
      
      // アイコンが戻ることを確認（太陽→月）
      cy.get('[aria-label*="Switch to dark mode"]').within(() => {
        cy.get('span').should('contain.text', '🌙');
      });
    });

    it('複数回の切り替えが正常に動作する', () => {
      const toggleButton = '[aria-label*="Switch to"]';
      
      // 5回切り替えテスト
      for (let i = 0; i < 5; i++) {
        cy.get(toggleButton).click();
        
        // 切り替え後の状態を確認
        if (i % 2 === 0) {
          cy.get('html').should('have.class', 'dark');
        } else {
          cy.get('html').should('not.have.class', 'dark');
        }
      }
    });
  });

  describe('視覚的変更の確認', () => {
    it('ダークモード時に全セクションの色が変更される', () => {
      // ダークモードに切り替え
      cy.get('[aria-label*="Switch to dark mode"]').click();
      cy.get('html').should('have.class', 'dark');
      
      // ヘッダーの背景色をチェック
      cy.get('header').should('have.class', 'dark:bg-gray-900');
      
      // メインコンテンツの背景色をチェック
      cy.get('.min-h-screen').should('have.class', 'dark:bg-gray-900');
      
      // テキストの色クラスを確認
      cy.get('h1, h2, h3').each(($el) => {
        cy.wrap($el).should('have.class', 'dark:text-gray-100');
      });
      
      // セクションのトランジション効果を確認
      cy.get('section').each(($el) => {
        cy.wrap($el).should('have.class', 'transition-colors');
      });
    });

    it('ホバー効果がダークモードでも正常に動作する', () => {
      // ダークモードに切り替え
      cy.get('[aria-label*="Switch to dark mode"]').click();
      
      // スキルバッジのホバー効果をテスト
      cy.get('#skills').within(() => {
        cy.get('.rounded-full').first().trigger('mouseover');
        
        // ホバー時のスタイルクラスが適用されていることを確認
        cy.get('.rounded-full').first().should('have.class', 'hover:bg-gray-300');
        cy.get('.rounded-full').first().should('have.class', 'dark:hover:bg-gray-700');
      });
      
      // ダークモードボタンのホバー効果
      cy.get('[aria-label*="Switch to light mode"]').trigger('mouseover');
      cy.get('[aria-label*="Switch to light mode"]').should('have.class', 'hover:scale-110');
    });

    it('トランジション効果が適用される', () => {
      // トランジション効果のクラスを確認
      cy.get('.min-h-screen').should('have.class', 'transition-colors');
      cy.get('.min-h-screen').should('have.class', 'duration-300');
      
      // ダークモード切り替え時のアニメーション
      cy.get('[aria-label*="Switch to dark mode"]').click();
      
      // トランジション中も要素が表示されていることを確認
      cy.get('.min-h-screen').should('be.visible');
      cy.get('header').should('be.visible');
    });
  });

  describe('データ永続化', () => {
    it('ダークモード設定がlocalStorageに保存される', () => {
      // ダークモードに切り替え
      cy.get('[aria-label*="Switch to dark mode"]').click();
      
      // localStorageに保存されることを確認
      cy.window().then((window) => {
        const savedTheme = window.localStorage.getItem('theme');
        expect(savedTheme).to.equal('true');
      });
    });

    it('ページリロード後もダークモード設定が維持される', () => {
      // ダークモードに切り替え
      cy.get('[aria-label*="Switch to dark mode"]').click();
      cy.get('html').should('have.class', 'dark');
      
      // ページをリロード
      cy.reload();
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      
      // ダークモードが維持されていることを確認
      cy.get('html').should('have.class', 'dark');
      cy.get('[aria-label*="Switch to light mode"]').should('be.visible');
    });

    it('localStorageをクリアした後はシステム設定が適用される', () => {
      // ダークモードに設定
      cy.get('[aria-label*="Switch to dark mode"]').click();
      
      // localStorageをクリア
      cy.window().then((window) => {
        window.localStorage.clear();
      });
      
      // ページをリロード
      cy.reload();
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      
      // システム設定に基づいた初期状態になることを確認
      // (テスト環境では通常ライトモードがデフォルト)
      cy.get('html').should('not.have.class', 'dark');
    });
  });

  describe('アクセシビリティ', () => {
    it('キーボードナビゲーションでダークモードボタンにフォーカスできる', () => {
      // Tabキーでダークモードボタンにフォーカス
      cy.get('body').tab();
      
      // ダークモードボタンがフォーカスされることを確認
      cy.get('[aria-label*="Switch to dark mode"]').should('be.focused');
    });

    it('Enterキーでダークモード切り替えができる', () => {
      // Tabキーでボタンにフォーカス
      cy.get('body').tab();
      cy.get('[aria-label*="Switch to dark mode"]').should('be.focused');
      
      // Enterキーで切り替え
      cy.get('[aria-label*="Switch to dark mode"]').type('{enter}');
      
      // ダークモードに切り替わることを確認
      cy.get('html').should('have.class', 'dark');
    });

    it('Spaceキーでダークモード切り替えができる', () => {
      // Tabキーでボタンにフォーカス  
      cy.get('body').tab();
      cy.get('[aria-label*="Switch to dark mode"]').should('be.focused');
      
      // Spaceキーで切り替え
      cy.get('[aria-label*="Switch to dark mode"]').type(' ');
      
      // ダークモードに切り替わることを確認
      cy.get('html').should('have.class', 'dark');
    });

    it('aria-labelが状態に応じて適切に更新される', () => {
      // 初期状態
      cy.get('[aria-label="Switch to dark mode"]').should('exist');
      
      // ダークモードに切り替え
      cy.get('[aria-label="Switch to dark mode"]').click();
      
      // aria-labelが更新される
      cy.get('[aria-label="Switch to light mode"]').should('exist');
      cy.get('[aria-label="Switch to dark mode"]').should('not.exist');
    });
  });
});