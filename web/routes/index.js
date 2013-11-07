var path = require('path'),
    fs = require('fs');

var mainRoutes = [];

var requireRoutes = function(dir, app) {
    var files = fs.readdirSync(dir).filter(function(file) {
        return path.join(__dirname, file) != __filename;
    });

    files.forEach(function(file) {
        var absolutePath = path.join(dir, file);

        var stat = fs.statSync(absolutePath);

        if (stat.isFile()) {
            try {
                var defineRoutes = require(absolutePath);
                defineRoutes(app);

                if (defineRoutes.meta) {
                    mainRoutes.push(defineRoutes.meta);
                }
            } catch (e) {
                console.log('Could not require route "' + absolutePath + '" due to exception', e);
            }
        } else if (stat.isDirectory()) {
            // Scan the directory recursive
            requireRoutes(path.join(dir, file), app);
        }
    });
}

var routes = function(app) {
    requireRoutes(__dirname, app);

}

module.exports = routes;
