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

        if (comparison === "~<") {
            var upper = "<= " + constraint;
            var lower = $.parseVersion(constraint);

            if (lower.length < 1) {
                return true;
            }

            if (lower.length == 1) {
                return $.version("<= " + constraint, version);
            }

            lower.pop();
            lower = ">= " + lower.join(".");
            return $.version([lower, upper], version);
        }

        if (comparison === "~>") {
            var lower = ">= " + constraint;
            var upper = $.parseVersion(constraint);

            if (upper.length < 1) {
                return true;
            }

            if (upper.length == 1) {
                return $.version(">= " + constraint, version);
            }

            upper.pop();
            upper.push(upper.pop() + 1);
            upper = "< " + upper.join(".");
            return $.version([lower, upper], version);
        }

        throw new Error("Unknown comparison '" + comparison + "'");
    }

    $.version = function(constraint, version) {
        if ($.isArray(constraint)) {
            for (var i = 0; i < constraint.length; i++) {
                if (!$.version(constraint[i], version)) {
                    return false;
                }
            }

            return true;
        }

        var result = /^(=|!=|<=|>=|<|>|~<|~>)?\s*(.*)$/.exec(constraint);
        return checkVersion(result[1], result[2], version);
    };
})(jQuery);
