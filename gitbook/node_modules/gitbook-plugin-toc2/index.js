var toc = require('marked-toc');

module.exports = {
  website: {
    assets: "./book",
    js: [
      "toc2.js"
    ],
    css: [
      "toc2.css"
    ]
  },
  book: {
  },
  hooks: {
    "page:before": function(page) {
      var tmpl = '<%= depth %><%= bullet %>[<%= heading %>](#<%= url %>)\n';
      // console.log(tmpl)
      page.content = toc.insert(page.content, {template: tmpl});
      // console.log(page.content)
      return page;
    }
  }
};
