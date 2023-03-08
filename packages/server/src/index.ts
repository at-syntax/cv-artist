import path from "path";
import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";

const REST_PORT = process.env.REST_PORT || 9000;
const WEB_PORT = process.env.WEB_PORT || 4000;
const host = /cvartist.com/;
const localhost = /localhost/;
const origin = process.env.NODE_ENV === "production" ? host : localhost;
/** **************************
 * # Initialize web app server
 ************************** */
export const web = express();

// #region Middleware
web.use(
  cors({
    credentials: true,
    origin,
  })
);

/** ******************************************
 * # Link Web app here #
 ******************************************* */

let webPath: string | undefined;
try {
  webPath = path.dirname(require.resolve("@cv-artist/web"));
} catch (e) {
  // eslint-disable-next-line no-console
  console.log("Peer deps missing");
}
if (webPath !== undefined) {
  web.use(express.static(webPath));
}

web.get("/*", (_, res) => {
  if (webPath !== undefined) {
    res.sendFile(path.join(webPath, "index.html"));
  }
});

export const webServer = web.listen(WEB_PORT, () => {
  console.log(`\x1b[42m Web started on port ${WEB_PORT} \x1b[0m`);
});

/** **********************************
 * # Initialize Rest APIs
 ********************************** */
export const app = express();

// # Using middleware
app.use(
  cors({
    credentials: true,
    origin,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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

/**
 *
 * @api {get} /about About
 * @apiName about
 * @apiGroup About
 *
 *
 * @apiSuccess (200) {String} Response CV Artist
 *
 */
app.get("/about", (_req, res) => {
  res.render("pages/about");
});

/**
 *
 * @api {get} /faq FAQ
 * @apiName faq
 * @apiGroup FAQ
 *
 *
 * @apiSuccess (200) {String} Response CV Artist
 *
 */
app.get("/faq", (_req, res) => {
  res.render("pages/faq");
});

export const restAPIServer = app.listen(REST_PORT, () => {
  console.log(
    `\x1b[42m Server started on port ${REST_PORT} \x1b[0m\n\x1b[41m API response time should be under 1500 ms \x1b[0m`
  );
});
