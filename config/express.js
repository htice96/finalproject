const express = require("express");
const mongoose = require("mongoose");
const Widgets = require("../app/models/widgets.js");
const bodyParser = require("body-parser");
const User = require("../app/models/users");
const requireLogin = require("./passport").requireLogin;
const login = require("./passport").login;
const requireAuth = require("./passport").requireAuth;
const passport = require("passport");
module.exports = function (app, config) {
  try {
    mongoose.connect(
      config.dbURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => console.log("Mongoose is connected")
    );
  } catch (e) {
    console.log("Could not connect", e);
  }
  const dbConnection = mongoose.connection;
  dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
  dbConnection.once("open", () => console.log("connected to DB!"));

  app.use(bodyParser.json());
  app.use(express.static(config.rootPath + "/public"));
  app.use(passport.initialize());
  app.get("/alltodo", function (req, res) {
    Widgets.find({}, (err, widgets) => {
      if (err) {
        return next(err);
      } else {
        res.status(200).json(widgets);
      }
    });
  });

  app.delete("/todo/:id", (req, res, next) => {
    Widgets.remove({ _id: req.params.id }, (error, widget) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json(widget);
      }
    });
  });

  app.post("/todo", function (req, res, next) {
    let widgets = new Widgets(req.body);
    widgets
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        return next(err);
      });
  });

  app.put("/todo/:id", function (req, res, next) {
    Widgets.findByIdAndUpdate(req.params.id, req.body)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        return next(err);
      });
  });

  app.get("/todobyid/:id", function (req, res, next) {
    let id = req.params.id;

    Widgets.findOne({ _id: id }, (err, widgets) => {
      if (err) {
        return next(err);
      } else {
        res.status(200).json(widgets);
      }
    });
  });
  app.get("/todo/:todoname", function (req, res, next) {
    Widgets.findOne({ todo: req.params.todoname }, (err, widgets) => {
      if (err) {
        return next(err);
      } else {
        res.status(200).json(widgets);
      }
    });
  });

  app.post("/api/users", function (req, res, next) {
    const user = new User(req.body);
    user.save((err, document) => {
      if (err) {
        return next(err);
      }
      res.json(document);
    });
  });
  app.post("/api/users/login", requireLogin, login);

  app.get("/api/customers", requireAuth, function (req, res) {
    res.json({ name: "Harry" });
  });
  app.use(function (req, res) {
    res.type("text/plain");
    res.status(404);
    res.send("The resource you requested cannot be found");
  });

  app.use(function (err, req, res, next) {
    console.log(err);
    if (process.env.NODE_ENV !== "test") console.log(err.stack, "error");

    res.type("text/plain");
    if (err.status) {
      res.status(err.status).send(err.message);
    } else {
      res.status(500).send("500 Sever Error");
    }
  });
};
