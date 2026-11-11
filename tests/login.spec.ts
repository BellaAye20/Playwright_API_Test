import { test, expect } from '@playwright/test';


test('Get Dummy Posts', async ({ request }) => {
  //Get method
  const response = await request.get("https://dummyjson.com/posts");
  const body = await response.json();
  
  // Check Status code is 200 or not
  expect(response.status()).toBe(200);
});


