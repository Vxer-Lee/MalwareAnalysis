var cheerio = require('cheerio');

module.exports = {
    hooks: {
        // Before html generation
        "page": function(page) {
            // page.path is the path to the file
            // page.sections is a list of parsed sections

            // Example:
            //page.sections.unshift({type: "normal", content: "<h1>Title</h1>"})

            //console.log(page);
            return page;
        },

        // After html generation
        "page:after": function(page) {
            var levels = this.options.pluginsConfig.tocstyles || ['', 'decimal'];
            var $ = cheerio.load(page.content);
            var selector = '.book .book-summary ul.summary > li'
            for (var level in levels) {
                var style = levels[level];
                if (style) {
                    $(selector).css('list-style', style + ' inside')
                      .find('> a > b').css('display', 'none');
                }
                selector += ' > ul > li'
            }
            page.content = $.html();
            return page;
        }
    }
};
