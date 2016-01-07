
# fis3-postpackager-inline

## Install

```sh
npm install fis3-postpackager-inline
```

## Usage

```js
fis.media('dist')
    .match('::packager', {
        postpackager: [
            fis.plugin('loader', {
                resourceType: 'commonJs',
                allInOne: {
                    js: '${filepath}_aio.inline.js',
                    css: '${filepath}_aio.inline.css'
                }
            }),
            fis.plugin('inline')
        ]
    })
```

## Options

### match `{Object<String, Number>}`

`default`:

```js
    {
        '<script\\s[^>]*src="([^"]*[^\\da-zA-Z]inline[^\\da-zA-Z][^"]*)"[^>]*>\\s*</script>': 1,
        '<link\\s[^>]*href="([^"]*[^\\da-zA-Z]inline[^\\da-zA-Z][^"]*)"[^>]*>': 1
    }
```

匹配表达式, 默认inline文件名为`*inline*`的`script`/`link`标签

