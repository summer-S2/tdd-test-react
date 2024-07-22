/// <reference types="cypress" />
import "@testing-library/cypress/add-commands";

describe("Youtube App", () => {
  // 사이트 방문 설정 (baseURL은 cypress.config에 설정)
  beforeEach(() => {
    // 실제 api 통신을 하면 불안정하므로 목데이터 불러오기 설정
    cy.intercept("GET", /(mostPopular)/g, {
      fixture: "popular.json",
    });
    cy.intercept("GET", /(search)/g, {
      fixture: "search.json",
    });
    cy.viewport(1200, 800);
    cy.visit("/");
  });

  it("renders", () => {
    cy.findByText("Youtube").should("exist");
  });

  it("shows popular video first", () => {
    cy.findByText("Popular Video").should("exist");
  });

  it("searches by keyword", () => {
    cy.findByPlaceholderText("Search...").type("t1 페이커");
    cy.findByRole("button").click();
    cy.findByText("Search Result1").should("exist");
  });

  it("goes to detail page", () => {
    cy.findAllByRole("listitem").first().click();
    cy.findByTitle("Popular Video").should("exist");
    cy.findByText("Popular Video").should("exist");
    cy.findByText("Search Result1").should("exist");
  });
});
