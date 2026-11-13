import { test, expect } from '@playwright/test';


test.skip('Get user with bearer token', async ({ request }) => {

  // Retrieve the user info detail with username and password
  const response = await request.post("https://dummyjson.com/auth/login", {
    data: {
      username: "emilys",
      password: "emilyspass"
    },
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });

  // Check the user information contain access token or not
  const jsonData = await response.json();
  expect(jsonData).toHaveProperty("accessToken");
  const userResponse = await request.get("https://dummyjson.com/auth/me", {
    headers: {
      Authorization: `Bearer ${jsonData.accessToken}`
    }
  });

  // Check the status to be 200
  expect(userResponse.status()).toBe(200);

  // Check the user info details
  const userData = await userResponse.json();
  expect(userData.firstName).toBe("Emily");
  expect(userData.lastName).toBe("Johnson");
  expect(userData.username).toBe("emilys");
  expect(userData.email).toBe("emily.johnson@x.dummyjson.com");
});

test('Get details of first product', async ({ request }) => {
  // Retrieve the id of first product from Product List
  const response = await request.get("https://dummyjson.com/products");
  const jsonData = await response.json();
  const product_id = jsonData.products[0].id;

  // Check the status to be 200
  expect(response.status()).toBe(200);

  // Retrieve the product detail with above product id
  const productResponse = await request.get(`https://dummyjson.com/products/${product_id}`);
  const productData = await productResponse.json();

  // Check the status to be 200
  expect(productResponse.status()).toBe(200);

  // Check the product details
  expect(productData.id).toBe(1);
  expect(productData.title).toBe("Essence Mascara Lash Princess");
  expect(productData.brand).toBe("Essence");
  expect(productData.category).toBe("beauty");
  expect(productData.stock).toBe(99);
});

test("Filter the in-stock and free-shipping product", async ({ request }) => {
    // Retrieve the product (title, price) with parameter (limit, skip and 'In Stock')
    const response = await request.get("https://dummyjson.com/products", {
        params: {
            limit: "5",
            skip: "3",
            availabilityStatus: "In Stock",
            shippingInformation: "Free Shipping",
            select: "title,price"
        }
    });

    // Check the status to be 200
    expect(response.status()).toBe(200);

    // Check the product count is retrun 5 or not
    const productData = await response.json();
    expect(productData.products.length).toBe(5);
});

test("Sort the products by title in descending order", async ({ request }) => {
    const response = await request.get("https://dummyjson.com/products", {
        params: {
            sortBy: "title",
            order: "desc",
            limit: 10
        }
    });

    // Check the status to be 200
    expect(response.status()).toBe(200);

    // Check the product data
    const { products } = await response.json();
    const titles: string[] = products.map((p: { title: string }) => p.title);
    expect(titles).toEqual([
        "Yellow Peeler",
        "Wooden Rolling Pin",
        "Wooden Bathroom Sink With Mirror",
        "Women's Wrist Watch",
        "Women Handbag Black",
        "White Faux Leather Backpack",
        "Water",
        "Watch Gold for Women",
        "Volleyball",
        "Vivo X21"
    ]);
});

test("Update the title of product id = 1", async ({ request }) => {
    const url = "https://dummyjson.com/products/1";

    const originalProduct = {
        title: "Essence Mascara Lash Princess",
        description: "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula."
    };

    const updatedProduct = {
        title: "Rare Beauty Mascara",
        description: "Rare Beauty Mascara delivers excellent volume and length. The formula is smooth, easy to apply, and long-lasting without smudging. Highly recommended for daily wear."
    };

    // Get original product
    const getResponse = await request.get(url);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(originalProduct);

    // Update product
    const updateResponse = await request.patch(url, {
        data: updatedProduct
    });

    expect(updateResponse.status()).toBe(200);
    expect(await updateResponse.json()).toMatchObject(updatedProduct);
});
