"Use Strict";
(function(){
    var express = require("express");
    var http	= require('http');
    var util 	= require('util');
    var path    = require("path");
    var url		= require('url');
    var fs      = require("fs");

    //app
    var app = function() {

    	/*This*/
    	var self = this;

		/*=================================================*/
    	/*Variables*/
    	/*=================================================*/
        self.setupVariables = function() {

            console.log("setupVariables Starting...");

            console.log("process.env.IPADDRESS Testing...: " + process.env.IPADDRESS);
            self.ipaddress = process.env.IPADDRESS;

            console.log("process.env.PORT Testing...: " + process.env.PORT);
            self.port      = process.env.PORT || 8080;

            if (typeof self.ipaddress === "undefined") {
                console.warn("No IPADDRESS Setting, using 127.0.0.1");
                self.ipaddress = "127.0.0.1";
            };

            console.log("Server Start on " + self.ipaddress + ":" + self.port);
            console.log("Setup Variables [Done]!");
        };

        /*=================================================*/
        /*Cache*/
        /*=================================================*/
        /*Cache_set*/
        self.cache_set = function() {
            if (typeof self.cache === "undefined") {
                self.cache = {
                    'favicon':'',
                    'robots':'',
                    'index': ''
                };
            }
            //  Local cache for static content.
            self.cache['robots'] = fs.readFileSync('./robots.txt');
            self.cache['index'] = fs.readFileSync('./index.html');
            self.cache['favicon.ico'] = fs.readFileSync('./favicon.ico');

            console.log("Cache Set [Done]!");
        };
        /*Cache_get*/
        self.cache_get = function(key) {
            return self.cache[key];
        };

        /*=================================================*/
        /*Routes*/
        /*=================================================*/
        self.createRoutes = function() {
        	/*Empty Routes*/
            self.routes = { };
            /*Index*/
            self.routes['/'] = function(req, res) {
                res.setHeader('Content-Type', 'text/html');
                res.send(self.cache_get('index') );
            };
            /*Default Robot*/
            self.routes['/robots.txt'] = function(req, res) {
                res.setHeader('Content-Type', 'text/plain');
                res.send(self.cache_get('robots'));
            };
            /*favicon.ico*/
            self.routes['/favicon.ico'] = function(req, res) {
                res.setHeader('Content-Type', 'image/x-icon');
                res.send(self.cache_get('favicon'));
            };
        };

        /*=================================================*/
        /*Initialize Server*/
        /*=================================================*/
        self.initializeServer = function() {
        	/*Create Routes*/
            self.createRoutes();
            /*Express Create Server*/
            self.app = express.createServer();
            /*Static Path*/
            self.app.use(express.static(path.join(__dirname, 'src/public')));
            /*Add handlers for the app (from the routes).*/
            for (var r in self.routes) {
                self.app.get(r, self.routes[r]);
            }
            /*Success Message*/
            console.log("Initialize Server [Done]!");
        };

		/*=================================================*/
        /*Initialize*/
        /*=================================================*/
        self.initialize = function() {
            self.setupVariables();
            self.cache_set();
            self.initializeServer();
        };

		/*=================================================*/
        /*Start*/
        /*=================================================*/
        self.start = function() {
            self.app.listen(self.port, self.ipaddress, function() {
                console.log('%s:\nNode server started on %s:%d ...', Date(Date.now()), self.ipaddress, self.port);
            });
        };

    };

    /*app*/
    var app = new app();
    app.initialize();
    app.start();
})();
