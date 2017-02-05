
/**
 * fis inline
 */
var entry = module.exports = function(ret, pack, settings, opt) {
    var files = ret.pkg,
        hashReleaseMap = {};

    // convert kb
    settings.max *= 1024;
    settings.jsMax *= 1024;
    settings.cssMax *= 1024;

    ['pkg', 'urlmapping'].forEach(function(key) {
        ret[key] && Object.keys(ret[key]).forEach(function(path) {
            var file = ret[key][path];
            hashReleaseMap[file.getUrl()] = file;
        });
    });

    Object.keys(files).forEach(function(path) {
        var file = files[path];
        compile(file);
    });

    function compile(file) {
        if (file.release === false 
            || !file.isHtmlLike 
            || file.isPartial
        ) {
            return;
        }

        var content = file.getContent();

        var jsLink = /<script\s[^>]*\bsrc=(["'])([^>"']+)\1[^>]*>\s*<\/script>/g,
            cssLink = /<link\s[^>]*\bhref=(["'])([^>"']+)\1[^>]*>/g;
        content = content.replace(jsLink, function(text, a, url) {
            return replacement(url) || text;
        });
        content = content.replace(cssLink, function(text, a, url) {
            if (text.match(/rel=(["'])stylesheet\1/)) {
                return replacement(url) || text;
            }
            return text;
        });

        file.setContent(content);
    }

    function replacement(url) {
        var file = hashReleaseMap[url] || null,
            content = file && file.getContent() || '',
            totalLen = 0;
        // 总大小判断
        if (file && totalLen + content.length < settings.max) {
            if (file._likes && file._likes.isJsLike) {
                // 单个大小
                if (content.length < settings.jsMax) {
                    totalLen += content.length;
                    return '<script>' + content + '</script>';
                }
            } else {
                if (content.length < settings.cssMax) {
                    totalLen += content.length;
                    return '<style>' + content + '</style>';
                }
            }
        }
        return null;
    }
};

entry.defaultOptions = {
    // 当超过这个大小时,不inline
    max: 25,
    cssMax: 20,
    jsMax: 10
};

