const http = require("http");

function request(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "localhost",
      port: 8080,
      path,
      method,
      headers: {
        Accept: "application/json",
      },
    };
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
    if (data) {
      options.headers["Content-Type"] = "application/json";
      options.headers["Content-Length"] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    console.log("1) GET /api/products");
    const products = await request("/api/products", "GET");
    console.log("status", products.status);
    console.log(products.body);

    console.log("2) POST /api/auth/login");
    const login = await request("/api/auth/login", "POST", {
      email: "admin@example.com",
      password: "Admin123!",
    });
    console.log("status", login.status);
    console.log(login.body);
    const auth = JSON.parse(login.body);
    const token = auth.token;

    if (!token) {
      throw new Error("No token received");
    }

    console.log("token length", token.length);

    console.log("3) POST /api/cart/items");
    const cartAdd = await request(
      "/api/cart/items",
      "POST",
      { productId: 1, quantity: 2 },
      token,
    );
    console.log("status", cartAdd.status);
    console.log(cartAdd.body);

    console.log("4) GET /api/cart");
    const cart = await request("/api/cart", "GET", null, token);
    console.log("status", cart.status);
    console.log(cart.body);
  } catch (err) {
    console.error("ERROR", err);
  }
})();
