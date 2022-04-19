import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import setRoutes from "../routes/routes.js";

export default async ({ app }: { app: express.Application }) => {
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Make Images "Uploads" Folder Publicly Available
  app.use("/public", express.static("public"));

  app.use(cors());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
  setRoutes(app);
  return app;
};
