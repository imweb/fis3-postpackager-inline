
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
            fis.plugin('inline')
        ]
    })
```

## Options

### max `{Number}`

`default` 25

inline文件总最大kb数

### jsMax `{Number}`

`default` 5

inline js文件最大kb数

### cssMax `{Number}` 

`default` 20

inline css文件最大kb数

