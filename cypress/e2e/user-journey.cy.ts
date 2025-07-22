import { describe, beforeEach, it } from "node:test";

describe('ユーザージャーニー E2E テスト', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('基本的なページ読み込み', () => {
    it('ページが正常に読み込まれる', () => {
      // ページタイトルを確認
      cy.title().should('contain', 'Vite + React + TS');
      
      // メインヘッダーが表示されることを確認
      cy.get('header').should('be.visible');
      cy.get('h1').contains('Tech Portfolio').should('be.visible');
    });

    it('初期ローディング状態から完全読み込みまで', () => {
      // ローディング状態を確認
      cy.contains('Loading...').should('be.visible');
      
      // データが読み込まれるまで待機 (最大10秒)
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      
      // 主要セクションが表示されることを確認
      cy.get('#skills').should('be.visible');
      cy.get('#experience').should('be.visible');
      cy.get('#projects').should('be.visible');
      cy.get('#contact').should('be.visible');
    });

    it('ユーザー情報が正しく表示される', () => {
      // データ読み込み完了まで待機
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      
      // ユーザー名とタイトルが表示されることを確認
      cy.get('h2').should('contain.text', 'Takumi Okayasu').and('be.visible');
      cy.contains('Software Engineer').should('be.visible');
      
      // アバター画像が表示されることを確認
      cy.get('[style*="background-image"]').should('exist').and('be.visible');
    });
  });

  describe('ページナビゲーション', () => {
    beforeEach(() => {
      // データ読み込み完了まで待機
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
    });

    it('各セクションが順番に表示される', () => {
      const sections = ['skills', 'experience', 'projects', 'contact'];
      
      sections.forEach(section => {
        cy.get(`#${section}`).should('be.visible');
        
        // セクションタイトルを確認
        cy.get(`#${section}`).within(() => {
          cy.get('h2, h3').should('be.visible');
        });
      });
    });

    it('スクロール動作が滑らかに行われる', () => {
      // スキルセクションまでスクロール
      cy.get('#skills').scrollIntoView();
      cy.get('#skills').should('be.visible');
      
      // 経験セクションまでスクロール
      cy.get('#experience').scrollIntoView();
      cy.get('#experience').should('be.visible');
      
      // プロジェクトセクションまでスクロール
      cy.get('#projects').scrollIntoView();
      cy.get('#projects').should('be.visible');
      
      // コンタクトセクションまでスクロール
      cy.get('#contact').scrollIntoView();
      cy.get('#contact').should('be.visible');
    });
  });

  describe('コンテンツ表示テスト', () => {
    beforeEach(() => {
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
    });

    it('スキルセクションが正しく表示される', () => {
      cy.get('#skills').within(() => {
        cy.contains('Skills').should('be.visible');
        
        // スキルバッジが表示されることを確認
        cy.get('.rounded-full').should('have.length.greaterThan', 0);
        
        // 各スキルバッジが見える状態であることを確認
        cy.get('.rounded-full').first().should('be.visible');
      });
    });

    it('経験セクションが正しく表示される', () => {
      cy.get('#experience').within(() => {
        cy.contains('Work Experience').should('be.visible');
        
        // タイムライン要素が存在することを確認
        cy.get('.grid').should('exist');
      });
    });

    it('プロジェクトセクションが正しく表示される', () => {
      cy.get('#projects').within(() => {
        cy.contains('Projects').should('be.visible');
        
        // プロジェクトグリッドが存在することを確認
        cy.get('.grid').should('exist');
      });
    });

    it('コンタクトセクションが正しく表示される', () => {
      cy.get('#contact').within(() => {
        cy.contains('Get in Touch').should('be.visible');
      });
    });
  });

  describe('エラーハンドリング', () => {
    it('ネットワークエラー時の動作確認', () => {
      // API レスポンスを失敗させる
      cy.intercept('GET', '/data/**', { forceNetworkError: true }).as('networkError');
      
      cy.visit('/');
      
      // ローディング状態が続くことを確認
      cy.contains('Loading...').should('be.visible');
      
      // エラー状態でも基本的なUIが表示されることを確認
      cy.get('header').should('be.visible');
      cy.get('h1').contains('Tech Portfolio').should('be.visible');
    });

    it('部分的なデータ読み込み失敗時の動作', () => {
      // 特定のAPIのみ失敗させる
      cy.intercept('GET', '/data/skills.json', { statusCode: 404 }).as('skillsError');
      cy.intercept('GET', '/data/personal.json', { fixture: 'personal-mock.json' }).as('personalSuccess');
      
      cy.visit('/');
      
      // 読み込み可能なデータは表示される
      cy.wait('@personalSuccess');
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      
      // エラーが発生したセクションでも基本構造は維持される
      cy.get('#skills').should('be.visible');
    });
  });
});