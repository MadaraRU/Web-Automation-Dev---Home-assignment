import axios from "axios";

interface ApiResponse {
  total: number;
  count: number;
  products: any[];
}

const BASE_URL: String = "https://api.ecommerce.com/products";
const MAX: number = 100000;

//Main function
export const fetchProduct = async (
  minPrice: number,
  maxPrice: number
): Promise<any[]> => {
  // Guard clause if price falls over/under price range
  if (minPrice < 0 && maxPrice > MAX) {
    return [];
  }

  // try catch statement to handle exceptions
  try {
    // Main api request
    const response = await axios.get(
      `${BASE_URL}?min=${minPrice}&max=${maxPrice}`
    );

    console.log({ response });

    // Parsing api result
    const data = (await response.data) as ApiResponse;

    console.log({ data });

    // Checking if count is still less than the total
    if (data.count < data.total) {
      // Splitting array to start the process of binary search
      let midPrice = Math.floor((maxPrice + minPrice) / 2);

      //res1: array containing products based on their prices (minmum price up to medium price)
      //res2: array containing products based on their prices (medium price up to maximum price)
      //Promise.all(): Handling multiple promises at once
      const [res1, res2] = await Promise.all([
        // Using recursive functions to fetch products by a defined price range
        fetchProduct(minPrice, midPrice),
        fetchProduct(midPrice, maxPrice),
      ]);

      // Joining the two arrays into one
      return [...res1, ...res2];
    }

    // Returning the final outcome
    return data.products;
  } catch (error: any) {
    console.log(error);
  }
};

// about the 8th question :
// The expectations on my code relies on the interval of my price range, it must be inclusive to not retreive the same product twice
