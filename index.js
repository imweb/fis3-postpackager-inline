
var entry = module.exports = function(ret, pack, settings, opt) {
    var files = ret.pkg,
        hashReleaseMap = {};

    ['pkg', 'urlmapping'].forEach(function(key) {
        ret[key] && Object.keys(ret[key]).forEach(function(path) {
            hashReleaseMap[ret[key][path].getHashRelease()] = ret[key][path];
        });
    });

    Object.keys(files).forEach(function(path) {
        var file = files[path];
        compile(file);
    });

    function compile(file) {
        if (file.release === false 
            || !file.isHtmlLike 
        ) {
            return;
        }

        var content = file.getContent();

        Object.keys(settings.match).forEach(function(exp) {
            var id = settings.match[exp],
                match = new RegExp(exp, 'g');
            content = content.replace(match, function(text) {
                var path = RegExp['$' + (isNaN(id) ? 1 : id)],
                    file = hashReleaseMap[path] || null;
                if (file) {
                    return text.match(/^.{0,10}script/)
                        ? '<script>' + file.getContent() + '</script>' 
                        : '<style>' + file.getContent() + '</style>';
                }
                return text;
            });
        });

        file.setContent(content);
    }
};

entry.defaultOptions = {
    match: { 
        '<script\\s[^>]*src="([^"]*\\.inline\\.[^"]*)"[^>]*>\\s*</script>': 1,
        '<link\\s[^>]*href="([^"]*\\.inline\\.[^"]*)"[^>]*>': 1
    }
};

