import { test, expect } from '@playwright/test';

// Define the TypeScript interface for the API response
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

test('API GET JsonPlaceholder', async ({ request }) => {
    // Get Method
    const response = await request.get("https://jsonplaceholder.typicode.com/posts");
    const body: Post[] = await response.json();

    // Check Status code is 200 or not
    expect(response.status()).toBe(200);
    // Check the retrun item count is 100 or not
    expect(body.length).toBe(100);

    // Check the field and their data types
    body.forEach((item: Post) => {
        expect(item).toHaveProperty('userId');
        expect(typeof item.userId).toBe('number');
        expect(item).toHaveProperty('id');
        expect(typeof item.id).toBe('number');
        expect(item).toHaveProperty('title');
        expect(typeof item.title).toBe('string');
        expect(item).toHaveProperty('body');
        expect(typeof item.body).toBe('string');
    })
});

test('API POST JsonPlaceholder', async ({ request }) => {
    // Creat new data
    const newData = {
      userId: 1,
      title: "Learning POST method",
      body: "Learning POST method with jsonplaceholder"
    };

    const response = await request.post("https://jsonplaceholder.typicode.com/posts", {
      data: newData,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }); 

    // Check Status code is 201 or not
    expect(response.status()).toBe(201);
  
    // Get the response body
    const body: Post = await response.json();
    // Verify the response data
    expect(body.id).toBe(101);
    expect(body.userId).toBe(newData.userId);
    expect(body.title).toBe(newData.title);
    expect(body.body).toBe(newData.body);
});

test('API PUT JsonPlaceholder', async ({ request }) => {
    // Creat new data to update data
    const newData = {
      userId: 5,
      title: "Learning PUT method",
      body: "Learning PUT method with jsonplaceholder"
    };

    const response = await request.put("https://jsonplaceholder.typicode.com/posts/5", {
      data: newData,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }); 

    // Check Status code is 201 or not
    expect(response.status()).toBe(200);
  
    // Get the response body
    const body: Post = await response.json();
    // Verify the response data
    expect(body.id).toBe(5);
    expect(body.userId).toBe(newData.userId);
    expect(body.title).toBe(newData.title);
    expect(body.body).toBe(newData.body);
});

test('API PATCH JsonPlaceholder', async ({ request }) => {
    // Creat new data to partially update data
    const newData = {
      title: "Learning PATCh method",
    };

    const response = await request.patch("https://jsonplaceholder.typicode.com/posts/3", {
      data: newData,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }); 

    // Check Status code is 201 or not
    expect(response.status()).toBe(200);
  
    // Get the response body
    const body: Post = await response.json();
    // Verify the response data
    expect(body.id).toBe(3);
    expect(body.title).toBe(newData.title);
});

test('API DELETE JsonPlaceholder', async ({ request }) => {

    const response = await request.delete("https://jsonplaceholder.typicode.com/posts/99"); 

    // Check Status code is 201 or not
    expect(response.status()).toBe(200);
});
