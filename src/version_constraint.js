/**
 * Documentation coming soon....
 */
(function($) {
    $.parseVersion = function(version) {
        if (version == "") {
            return [];
        }

        return $.map(version.split("."), function(x) { return parseInt(x, 10); });
    };

    $.compareVersion = function(a, b) {
        var parsedA = $.parseVersion(a);
        var parsedB = $.parseVersion(b);

        for (var i = 0; i < Math.min(parsedA.length, parsedB.length); i++) {
            if (parsedA[i] < parsedB[i]) {
                return -1;
            }

            if (parsedA[i] > parsedB[i]) {
                return 1;
            }
        }

        if (parsedA.length < parsedB.length) {
            return -1;
        }

        if (parsedA.length > parsedB.length) {
            return 1;
        }

        return 0;
    };

    function checkVersion(comparison, constraint, version) {
        comparison = comparison || "=";

        if (comparison === "=") {
            return $.compareVersion(constraint, version) === 0;
        }

        if (comparison === "!=") {
            return $.compareVersion(constraint, version) !== 0;
        }

        if (comparison === "<=") {
            return $.compareVersion(constraint, version) >= 0;
        }

        if (comparison === ">=") {
            console.log(constraint, version);
            return $.compareVersion(constraint, version) <= 0;
        }

        if (comparison === "<") {
            return $.compareVersion(constraint, version) > 0;
        }

        if (comparison === ">") {
            console.log(constraint, version);
            return $.compareVersion(constraint, version) < 0;
        }

        throw new Error("Unknown comparison '" + comparison + "'");
    }

    $.version = function(constraint, version) {
        var result = /^(=|!=|<=|>=|<|>)?\s*(.*)$/.exec(constraint);
        return checkVersion(result[1], result[2], version);
    };
})(jQuery);
