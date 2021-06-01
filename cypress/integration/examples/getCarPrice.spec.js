/// <reference types="cypress" />

context("getCarPrice", () => {
  beforeEach(() => {
    cy.viewport(1280, 680);
    cy.visit("https://nationalcar.com/");
  });

  it(".type() - type into a DOM element", () => {
    cy.get("#search-autocomplete__input-PICKUP").type("ATL", { delay: 30 });
    cy.get(
      "#search-autocomplete__PICKUP-list li:first-child ul > :first-child"
    ).click();

    cy.wait(1000);

    cy.get("#date-time__pickup-toggle").click();
    cy.get("#dateContainerId .date-selector__control--next button").click();
    cy.get('[aria-label="July 1"]').click();

    cy.get("#date-time__return-toggle").click();
    // picker remembers previous month selection
    cy.get('[aria-label="July 4"]').click();

    cy.get('[data-dtm-track="button.select.original"]').click();

    cy.get('[aria-label="Username or Member Number"]').type(
      Cypress.env("APP_USERNAME"),
      {
        delay: 40,
      }
    );
    cy.get('[aria-label="Password"]').type(Cypress.env("APP_SECRET"), {
      delay: 20,
    });
    cy.get('[aria-modal="true"] button[type="Submit"]').click();

    cy.wait(15000);

    cy.get("body").then(($body) => {
      let cost;
      let isEmerald;
      if ($body.find(".reserve__header .vehicle__price-total").length) {
        // emerald aisle is available
        isEmerald = true;
        cost = $body.find(".reserve__header .vehicle__price-total").text();
      } else if (
        $body.find(".vehicle-list > :first-child .vehicle__price-total").length
      ) {
        // first car available (economy class)

        isEmerald = false;
        cost = $body
          .find(".vehicle-list > :first-child .vehicle__price-total")
          .text();
      }

      if (cost) {
        const output = {
          START: new Date(2021, 6, 1).toISOString(),
          END: new Date(2021, 6, 4).toISOString(),
          NOW: new Date().toISOString(),
          EMERALD: isEmerald,
          COST: cost,
        };

        cy.writeFile("data/atl_car.txt", JSON.stringify(output), {
          flag: "a+",
        });
      }
    });
  });
});
