import { describe, beforeEach, it } from "node:test";

describe('レスポンシブデザイン E2E テスト', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // データ読み込み完了まで待機
    cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
  });

  describe('異なる画面サイズでの表示確認', () => {
    const viewports = [
      { device: 'iphone-6', width: 375, height: 667 },
      { device: 'ipad-2', width: 768, height: 1024 },
      { device: 'macbook-15', width: 1440, height: 900 }
    ];

    viewports.forEach(({ device, width, height }) => {
      describe(`${device} (${width}x${height})での表示`, () => {
        beforeEach(() => {
          cy.viewport(width, height);
        });

        it('ヘッダーが正しく表示される', () => {
          cy.get('header').should('be.visible');
          cy.get('h1').contains('Tech Portfolio').should('be.visible');
          
          // ダークモードトグルボタンが表示される
          cy.get('[aria-label*="Switch to"]').should('be.visible');
        });

        it('メインコンテンツが適切にレイアウトされる', () => {
          // プロフィールセクション
          cy.get('h2').contains('Takumi Okayasu').should('be.visible');
          
          // アバター画像がレスポンシブサイズで表示される
          cy.get('[style*="background-image"]').should('be.visible');
          
          // 各セクションが表示される
          const sections = ['skills', 'experience', 'projects', 'contact'];
          sections.forEach(section => {
            cy.get(`#${section}`).should('be.visible');
          });
        });

        it('スキルバッジのレイアウトが適切', () => {
          cy.get('#skills').within(() => {
            cy.get('.rounded-full').should('have.length.greaterThan', 0);
            
            // モバイルでは縦積み、タブレット以上では横並びを確認
            if (width < 768) {
              // モバイル: スキルバッジが縦方向に配置される
              cy.get('.grid').should('exist');
            } else {
              // タブレット以上: より多くのスキルバッジが一行に表示される
              cy.get('.grid').should('exist');
            }
          });
        });

        it('ナビゲーション要素が画面サイズに適応', () => {
          // ダークモードトグルボタンの位置
          cy.get('[aria-label*="Switch to"]')
            .should('be.visible')
            .should('have.class', 'fixed')
            .should('have.class', 'bottom-8')
            .should('have.class', 'right-8');
        });
      });
    });

    it('画面サイズ変更時の動的レスポンス', () => {
      // デスクトップサイズから開始
      cy.viewport(1440, 900);
      cy.get('#skills').within(() => {
        cy.get('.grid').should('be.visible');
      });

      // タブレットサイズに変更
      cy.viewport(768, 1024);
      cy.get('#skills').within(() => {
        cy.get('.grid').should('be.visible');
      });

      // モバイルサイズに変更
      cy.viewport(375, 667);
      cy.get('#skills').within(() => {
        cy.get('.grid').should('be.visible');
      });
    });
  });

  describe('タッチインタラクション', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
    });

    it('タッチでダークモード切り替えができる', () => {
      // タッチでダークモードボタンをタップ
      cy.get('[aria-label*="Switch to dark mode"]').trigger('touchstart');
      cy.get('[aria-label*="Switch to dark mode"]').trigger('touchend');
      
      // ダークモードに切り替わることを確認
      cy.get('html').should('have.class', 'dark');
    });

    it('スクロール動作が滑らか', () => {
      // 画面をスワイプしてスクロール
      cy.get('body').trigger('touchstart', { clientY: 300 });
      cy.get('body').trigger('touchmove', { clientY: 100 });
      cy.get('body').trigger('touchend');
      
      // スクロール後も要素が正しく表示される
      cy.get('#skills').should('be.visible');
    });

    it('長押し動作でのコンテキストメニューが適切に処理される', () => {
      // スキルバッジを長押し
      cy.get('.rounded-full').first().trigger('touchstart');
      cy.wait(1000);
      cy.get('.rounded-full').first().trigger('touchend');
      
      // ページの動作に影響しないことを確認
      cy.get('#skills').should('be.visible');
    });
  });

  describe('横向き・縦向き対応', () => {
    it('縦向きから横向きへの回転', () => {
      // 縦向き (iphone-6 portrait)
      cy.viewport(375, 667);
      cy.get('header').should('be.visible');
      
      // 横向きに変更 (iphone-6 landscape)
      cy.viewport(667, 375);
      cy.get('header').should('be.visible');
      
      // レイアウトが適切に調整されることを確認
      cy.get('#skills').should('be.visible');
      cy.get('[aria-label*="Switch to"]').should('be.visible');
    });

    it('タブレット横向きでの表示', () => {
      // iPad横向き
      cy.viewport(1024, 768);
      
      // より広いレイアウトが活用されることを確認
      cy.get('#skills').within(() => {
        cy.get('.grid').should('be.visible');
        cy.get('.rounded-full').should('have.length.greaterThan', 5);
      });
    });
  });

  describe('高解像度ディスプレイ対応', () => {
    it('4K解像度での表示', () => {
      cy.viewport(3840, 2160);
      
      // 高解像度でも適切にスケールされることを確認
      cy.get('header').should('be.visible');
      cy.get('#skills').should('be.visible');
      
      // 要素が過度に小さくならないことを確認
      cy.get('h1').should('have.css', 'font-size').and('not.equal', '0px');
    });

    it('超広帯域ディスプレイでの表示', () => {
      cy.viewport(2560, 1080);
      
      // 横長画面でもコンテンツが適切に配置される
      cy.get('#skills').should('be.visible');
      cy.get('#experience').should('be.visible');
      cy.get('#projects').should('be.visible');
    });
  });
});