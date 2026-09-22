const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

const authRoutes = require("./modules/tenant/auth/auth.route");
const userRoutes = require("./modules/tenant/users/user.route");
const tenantRoutes = require("./modules/tenant/tenant/tenant.route");

const app = express();

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Viplora SaaS Backend",
      version: "1.0.0",
      description: "Tenant auth, user, and SaaS foundation APIs.",
    },
  },
  apis: ["./src/modules/**/*.js", "./src/*.js"],
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
