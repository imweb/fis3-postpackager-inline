
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

### jsMaxKb `{Number}` 

`default` 5

inline js文件的最大kb数

### cssMaxKb `{Number}` 

`default` 20

inline css文件的最大kb数

