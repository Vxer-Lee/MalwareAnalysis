GitBook Plugin for Customized Table of Contents Headings
========================================================

Install it using: ```$ npm install gitbook-plugin-tocstyles```

Be sure too activate the option from the `book.json` file :

```json
{
  "plugins"       : ["tocstyles"]
  ,"pluginsConfig":
  {
    "tocstyles" : [ "", "cjk-ideographic", "decimal-leading-zero" ]
  }
}
```

The `tocstyles` array in `pluginsConfig` defines [CSS list-style-type properties](http://www.w3.org/TR/css-counter-styles-3/#counter-style) for each level of the TOC hierarchy.

![gitbook-plugin-tocstyles](https://raw.github.com/clkao/gitbook-plugin-tocstyles/master/thumbnail.png "gitbook-plugin-tocstyles")

## License: MIT

http://clkao.mit-license.org/
