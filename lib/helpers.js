var hbs = require('express-handlebars').create(),
    app = require('../app.js');

exports.section = (name, options) => {
  if(!this._sections) this._sections = {};
  this._sections[name] = options.fn(this);
  return null;
}

exports.link = (text, url) => {
  url = hbs.handlebars.escapeExpression(url)
  text = hbs.handlebars.escapeExpression(text);
  return new hbs.handlebars.SafeString(
    "<a href='" + url + "'>" + text + "</a>"
  );
}

exports.concat = (...strings) => {
  var result = "";
  strings.forEach((str, i) => {
    if (i != strings.length-1) result += hbs.handlebars.escapeExpression(str);
  });
  return result;
}

exports.route = (name, route) => {
  return name + app.namedRoutes.build(route);
}