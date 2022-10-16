import axios from "axios";

import * as app from "../app";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App", () => {
  beforeEach(() => {
    jest.spyOn(app, "fetchProduct");
  });
  describe("when count is equal to total", () => {
    const products = [{}, {}, {}, {}, {}];
    beforeEach(() => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          total: products.length,
          count: products.length,
          products,
        },
      });
    });

    it("should scrap products", async () => {
      const fetchedProducts = await app.fetchProduct(0, 10000);
      expect(fetchedProducts.length).toBe(products.length);
    });
  });

  describe("when count is less than total", () => {
    const products = [{}, {}, {}, {}, {}];

    beforeEach(() => {
      mockedAxios.get
        .mockResolvedValueOnce({
          data: {
            total: 10,
            count: 5,
            products: [{}, {}, {}, {}, {}],
          },
        })
        .mockResolvedValueOnce({
          data: {
            total: 5,
            count: 5,
            products: [{}, {}, {}, {}, {}],
          },
        })
        .mockResolvedValueOnce({
          data: {
            total: 5,
            count: 5,
            products: [{}, {}, {}, {}, {}],
          },
        });
    });

    it("should scrap all producsts", async () => {
      const fetchedProducts = await app.fetchProduct(0, 100000);
      expect(app.fetchProduct).toHaveBeenCalledWith(0, 50000);
      expect(app.fetchProduct).toHaveBeenCalledWith(50000, 100000);
      expect(fetchedProducts.length).toBe(10);
    });
  });
});
