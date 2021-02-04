# refactor-blockcode-xml

[![CodeFactor](https://www.codefactor.io/repository/github/cosnavel/refactor-blockcode-xml/badge?s=5c835d7d70603985a6d49f59b01cd17489123d14)](https://www.codefactor.io/repository/github/cosnavel/refactor-blockcode-xml)

```bash
npm i -g refactor-blockcode
```

### Options
```
      --help         Show help                                         [boolean]
      --version      Show version number                               [boolean]
  -p, --path         relative path to your input book.xml
                                                  [string] [default: "book.xml"]
  -o, --output       relative path to a output folder[string] [default: "dist/"]
  -i, --interactive  Run interactive mode             [boolean] [default: false]
  -l, --link         Check for broken links           [boolean] [default: false]
  -e, --entities     reset entities after refactoring blockcode
                                                      [boolean] [default: false
```

### Example to refactor all Blockcodes into seperate files
`refactor-blockcode -p book.xml`
### Example interactive Mode
`refactor-blockcode -i`
### Example to check for broken links
`refactor-blockcode -p book.xml -l`
