import { describe, beforeEach, it } from "node:test";

describe('パフォーマンス E2E テスト', () => {
  beforeEach(() => {
    // パフォーマンス計測のためにキャッシュをクリア
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('ページ読み込みパフォーマンス', () => {
    it('初回読み込み時間が許容範囲内', () => {
      const startTime = Date.now();
      
      cy.visit('/', {
        onBeforeLoad: (win) => {
          // Navigation Timing APIを使用してパフォーマンス測定
          win.performance.mark('visit-start');
        }
      });
      
      // DOM要素が表示されるまでの時間を測定
      cy.get('header').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // 3秒以内
      });
    });

    it('FCP (First Contentful Paint) が高速', () => {
      cy.visit('/', {
        onLoad: (win) => {
          // First Contentful Paintの測定
          cy.window().then((window) => {
            const perfEntries = window.performance.getEntriesByType('paint');
            const fcp = perfEntries.find(entry => entry.name === 'first-contentful-paint');
            
            if (fcp) {
              expect(fcp.startTime).to.be.lessThan(2000); // 2秒以内
            }
          });
        }
      });
    });

    it('データ読み込み完了時間が許容範囲内', () => {
      const startTime = Date.now();
      
      cy.visit('/');
      
      // ローディング状態の確認
      cy.contains('Loading...').should('be.visible');
      
      // データ読み込み完了まで測定
      cy.contains('Loading...', { timeout: 15000 }).should('not.exist').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(10000); // 10秒以内
      });
    });
  });

  describe('インタラクションレスポンス性能', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
    });

    it('ダークモード切り替えのレスポンス時間', () => {
      const startTime = Date.now();
      
      cy.get('[aria-label*="Switch to dark mode"]').click().then(() => {
        const responseTime = Date.now() - startTime;
        expect(responseTime).to.be.lessThan(100); // 100ms以内
      });
      
      // 視覚的変更の確認
      cy.get('html').should('have.class', 'dark');
    });

    it('スクロールパフォーマンス', () => {
      // スムーズスクロールの確認
      cy.get('#skills').scrollIntoView({ duration: 500 });
      cy.get('#skills').should('be.visible');
      
      cy.get('#experience').scrollIntoView({ duration: 500 });
      cy.get('#experience').should('be.visible');
      
      cy.get('#projects').scrollIntoView({ duration: 500 });
      cy.get('#projects').should('be.visible');
      
      // スクロール中もUIが応答することを確認
      cy.get('[aria-label*="Switch to"]').should('be.visible');
    });

    it('ホバー効果の応答性', () => {
      cy.get('#skills').within(() => {
        const startTime = Date.now();
        
        cy.get('.rounded-full').first().trigger('mouseover').then(() => {
          const hoverTime = Date.now() - startTime;
          expect(hoverTime).to.be.lessThan(50); // 50ms以内
        });
      });
    });
  });

  describe('リソース最適化', () => {
    it('画像の読み込み効率', () => {
      cy.visit('/');
      
      cy.window().then((win) => {
        // Resource Timing APIで画像読み込み時間を確認
        cy.wait(2000).then(() => {
          const resources = win.performance.getEntriesByType('resource');
          const imageResources = resources.filter(resource => 
            resource.name.includes('googleusercontent.com') || 
            resource.name.includes('.jpg') || 
            resource.name.includes('.png')
          );
          
          imageResources.forEach(resource => {
            expect(resource.duration).to.be.lessThan(2000); // 2秒以内
          });
        });
      });
    });

    it('CSS/JSリソースの読み込み時間', () => {
      cy.visit('/');
      
      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource');
        const scriptResources = resources.filter(resource => 
          resource.name.includes('.js') || resource.name.includes('.css')
        );
        
        scriptResources.forEach(resource => {
          expect(resource.duration).to.be.lessThan(1000); // 1秒以内
        });
      });
    });

    it('JSON データの読み込み効率', () => {
      cy.intercept('GET', '/data/**').as('dataRequests');
      
      cy.visit('/');
      
      cy.wait('@dataRequests').then((interception) => {
        expect(interception.reply?.statusCode).to.equal(200);
        
        // レスポンス時間の確認
        const responseTime = interception.reply?.delay || 0;
        expect(responseTime).to.be.lessThan(500); // 500ms以内
      });
    });
  });

  describe('メモリ使用量', () => {
    it('長時間操作後のメモリリーク確認', () => {
      cy.visit('/');
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      
      // 複数回のダークモード切り替え
      for (let i = 0; i < 10; i++) {
        cy.get('[aria-label*="Switch to"]').click();
        cy.wait(100);
      }
      
      // スクロール操作
      for (let i = 0; i < 5; i++) {
        cy.get('#skills').scrollIntoView();
        cy.get('#projects').scrollIntoView();
        cy.wait(200);
      }
      
      // メモリ使用量の確認
      cy.window().then((win) => {
        if (win.performance.memory) {
          const usedMemory = win.performance.memory.usedJSHeapSize;
          const totalMemory = win.performance.memory.totalJSHeapSize;
          const memoryUsageRatio = usedMemory / totalMemory;
          
          expect(memoryUsageRatio).to.be.lessThan(0.9); // 90%未満
        }
      });
    });
  });

  describe('ネットワーク状況別パフォーマンス', () => {
    it('低速ネットワークでの動作', () => {
      // 低速ネットワークをシミュレート
      cy.intercept('GET', '/data/**', (req) => {
        req.reply((res) => {
          res.delay(2000); // 2秒の遅延
        });
      }).as('slowNetwork');
      
      cy.visit('/');
      
      // ローディング状態が適切に表示されることを確認
      cy.contains('Loading...').should('be.visible');
      
      // 最終的にコンテンツが読み込まれることを確認
      cy.contains('Loading...', { timeout: 15000 }).should('not.exist');
      cy.get('#skills').should('be.visible');
    });

    it('オフライン時の動作', () => {
      // 最初に正常読み込み
      cy.visit('/');
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      
      // オフライン状態をシミュレート
      cy.window().then((win) => {
        Object.defineProperty(win.navigator, 'onLine', {
          writable: true,
          value: false
        });
        
        win.dispatchEvent(new Event('offline'));
      });
      
      // キャッシュされたコンテンツが表示されることを確認
      cy.get('#skills').should('be.visible');
      cy.get('[aria-label*="Switch to"]').should('be.visible');
      
      // ダークモード切り替えなど基本機能が動作することを確認
      cy.get('[aria-label*="Switch to dark mode"]').click();
      cy.get('html').should('have.class', 'dark');
    });
  });

  describe('Bundle Size とキャッシュ効率', () => {
    it('初回訪問時のリソースサイズ', () => {
      cy.visit('/');
      
      cy.window().then((win) => {
        cy.wait(3000).then(() => {
          const resources = win.performance.getEntriesByType('resource');
          
          let totalSize = 0;
          resources.forEach(resource => {
            if (resource.transferSize) {
              totalSize += resource.transferSize;
            }
          });
          
          // 合計転送サイズが合理的な範囲内であることを確認
          expect(totalSize).to.be.lessThan(2000000); // 2MB未満
        });
      });
    });

    it('リピート訪問時のキャッシュ効果', () => {
      // 初回訪問
      cy.visit('/');
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
      
      // 2回目の訪問
      cy.reload();
      
      const startTime = Date.now();
      cy.get('header').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(1000); // キャッシュにより1秒以内
      });
    });
  });
});