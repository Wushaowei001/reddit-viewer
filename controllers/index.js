'use strict';


var IndexModel = require('../models/index');
var request = require('request');
var cleaner = require('../lib/cleaner');
var url = require('../lib/urlUtil');

module.exports = function (app) {
    var model;
    var top = "/top";

    app.get('/', function (req, res) {
       console.log('Render homepage');
       res.render('homepage');
    });

    app.get('/:topic', function (req, res) {
        var topic = req.params.topic;
        var options = {
            host: "http://www.reddit.com/r/",
            topic: req.params.topic,
            sort: "/top",
            format: ".json",
            query: "?sort=top&t=week&limit=100"
        };

        var requestUrl = url.createUrl(options);

        request(requestUrl, function (error, response, body) {
			if (!error && response.statusCode === 200) {
		  		model = JSON.parse(body);
			}
            model.subtitle = topic;

            cleaner.filterLinks(model, function(links) {
                model.links = links;
                res.render('reddit', model);
            });
		});

    });
};
