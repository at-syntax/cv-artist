import path from "path";
import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 4000;

// # Using middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// # set the view engine to ejs
const viewPath = process.env.NODE_ENV === "production" ? "dist/tsc/views" : "src/views";
const views = path.join(process.cwd(), viewPath);
app.set("view engine", "ejs");
app.set("views", views);

// #region performance logger
/**
 * This middleware will log the API performance stats.
 */
app.use((req: Request<unknown, unknown, unknown, unknown>, res: Response<unknown>, next: NextFunction) => {
  const start = Date.now();
  res.once("finish", () => {
    const duration = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(`\x1b[43m${req.originalUrl}\x1b[0m\x1b[33m response time: \x1b[0m\x1b[41m${duration} ms\x1b[0m`);
  });
  next();
});

// #endregion

/** ******************************************
 * # Create your API here #
 ******************************************* */

/**
 *
 * @api {get} / Home
 * @apiName home
 * @apiGroup Home
 *
 *
 * @apiSuccess (200) {String} Response CV Artist
 *
 */
app.get("/", (_req, res) => {
  res.render("pages/index");
});

app.listen(PORT, () => {
  console.log(
    `\x1b[42m Server started on port ${PORT} \x1b[0m\n\x1b[41m API response time should be under 1500 ms \x1b[0m`
  );
});
