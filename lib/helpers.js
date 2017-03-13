var hbs = require('express-handlebars').create();

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
