const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

const { AppError } = require("./common/utils/errors");
const authRoutes = require("./modules/tenant/auth/auth.route");
const userRoutes = require("./modules/tenant/users/user.route");
const tenantRoutes = require("./modules/tenant/tenant/tenant.route");
const rawMaterialCategoryRoutes = require("./modules/raw_material/category/category.route");
const rawMaterialRoutes = require("./modules/raw_material/raw_material/raw.material.route");
const vendorRoutes = require("./modules/raw_material/vendor/vendor.route");
const materialTransactionRoutes = require("./modules/raw_material/material_transaction/material.transaction.route");

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
app.use("/api/v1/raw-material-categories", rawMaterialCategoryRoutes);
app.use("/api/v1/raw-materials", rawMaterialRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/material-transactions", materialTransactionRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof AppError ? error.message : "Something went wrong on the server.";

  console.error("API Error:", {
    method: req.method,
    url: req.originalUrl,
    message: error && error.message ? error.message : message,
    stack: error && error.stack ? error.stack : null,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && error.details ? { details: error.details } : {}),
    ...(process.env.NODE_ENV !== "production" && error && error.stack ? { stack: error.stack } : {}),
  });
});

module.exports = app;
