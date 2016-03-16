
/**
 * fis inline
 */
var entry = module.exports = function(ret, pack, settings, opt) {
    var files = ret.pkg,
        hashReleaseMap = {};

    ['pkg', 'urlmapping'].forEach(function(key) {
        ret[key] && Object.keys(ret[key]).forEach(function(path) {
            var file = ret[key][path];
            hashReleaseMap[(file.domain || '') + file.getHashRelease()] = file;
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

        var jsLink = /<script\s[^>]*\bsrc=(["'])([^>"']+)\1[^>]*>/g,
            cssLink = /<link\s[^>]*\bhref=(["'])([^>"']+)\1[^>]*>/g;
        content = content.replace(jsLink, function(text) {
            return replacement(RegExp.$2) || text;
        });
        content = content.replace(cssLink, function(text) {
            var url = RegExp.$2;
            if (text.match(/rel=(["'])stylesheet\1/)) {
                return replacement(url) || text;
            }
            return text;
        });

        function replacement(url) {
            var file = hashReleaseMap[url] || null,
                content = file && file.getContent() || '';
            if (file) {
                if (file._likes && file._likes.isJsLike) {
                    if (content.length < settings.jsMaxKb * 1024) {
                        return '<script>' + content + '</script>';
                    }
                } else {
                    if (content.length < settings.cssMaxKb * 1024) {
                        return '<style>' + content + '</style>';
                    }
                }
            }
            return null;
        }

        file.setContent(content);
    }
};

entry.defaultOptions = {
    // 当超过这个大小时,不inline
    cssMaxKb: 20,
    jsMaxKb: 5
};

