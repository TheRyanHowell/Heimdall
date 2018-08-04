/* global __root */

var assets = require(__root + "public/assets.json"); // eslint-disable-line

// =======================
// Routes
// =======================
exports.routes = function (app) {
	app.get("/admin/ping", function (req, res) {
		res.send("pong");
	});

	app.get("/", function (req, res) {
		res.locals = { headerType: "" };
		res.render("pages/home", { title: "Heimdall", assets: assets });
	});

	app.get("/download", function (req, res) {
		res.locals = { headerType: "" };
		res.render("pages/download", { title: "Heimdall - Download", assets: assets });
	});

	app.get("/about", function (req, res) {
		res.locals = { headerType: "" };
		res.render("pages/about", { title: "Heimdall - About", assets: assets });
	});

	app.get("*", function (req, res) {
		res.render("layout", { layout: false, title: "404 Page", assets: assets });
	});
};
