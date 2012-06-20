(function($) {
    /**
     * Parse the given version string.  This will break the version
     * string out to an array of ints.
     *
     * Example usage:
     * $.parseVersion("");      // []
     * $.parseVersion("2");     // [2]
     * $.parseVersion("1.2");   // [1, 2]
     * $.parseVersion("1.2.3"); // [1, 2, 3]
     */
    $.parseVersion = function(version) {
        if (version == "") {
            return [];
        }

        return $.map(version.split("."), function(x) { return parseInt(x, 10); });
    };

    /**
     * Compare 2 version strings and return 0 if they are equal, a
     * negative number if the first is less than the second, and a
     * positive number if the first is greater than the second.
     *
     * Example usage:
     * $.compareVersion("1.2", "1.2") == 0;     // true
     * $.compareVersion("1.2.3", "1.2.3") == 0; // true
     * $.compareVersion("1.2", "1.3") < 0;      // true
     * $.compareVersion("1", "1.3") < 0;        // true
     * $.compareVersion("1.4", "1.3") > 0;      // true
     * $.compareVersion("1.3.1", "1.3") > 0;    // true
     */
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

    /**
     * This is a hash of comparison operators.  The defaults are an
     * empty string (which is used if none are passed in as
     * constraints), =, !=, ~=, <, <=, ~<, >, >=, and >~.  Please see
     * the documentation for detailed examples.
     */
    $.versionComparisons = {
        "": function(constraint, version) {
            return $.version("= " + constraint, version);
        },

        "=": function(constraint, version) {
            return $.compareVersion(version, constraint) === 0;
        },

        "!=": function(constraint, version) {
            return $.compareVersion(version, constraint) !== 0;
        },

        "~=": function(constraint, version) {
            var lower = ">= " + constraint;
            var upper = $.parseVersion(constraint);

            if (upper.length < 1) {
                return true;
            }

            upper.push(upper.pop() + 1);
            upper = "< " + upper.join(".");
            return $.version([lower, upper], version);
        },

        "<=": function(constraint, version) {
            return $.compareVersion(version, constraint) <= 0;
        },

        ">=": function(constraint, version) {
            return $.compareVersion(version, constraint) >= 0;
        },

        "<": function(constraint, version) {
            return $.compareVersion(version, constraint) < 0;
        },

        ">": function(constraint, version) {
            return $.compareVersion(version, constraint) > 0;
        },

        "~<": function(constraint, version) {
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
        },

        "~>": function(constraint, version) {
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
    };

    /**
     * Check a version constraint against a version.  If no version is
     * passed in, the jQuery version currently loaded will be tested.
     * The constraint can be a string like "~> 1.2.3", or an array of
     * constraints like ["> 1.2", "< 1.4"].  Custom comparisons are
     * allowed by adding values to the $.versionComparisons object.
     * Please see the documentation for detailed examples.
     */
    $.version = function(constraint, version) {
        if (version === undefined || version === null) {
            version = $().jquery;
        }

        if ($.isArray(constraint)) {
            for (var i = 0; i < constraint.length; i++) {
                if (!$.version(constraint[i], version)) {
                    return false;
                }
            }

            return true;
        }

        var result = /^(?:(\S+)?\s+)?(.*)$/.exec(constraint);
        var comparison = result[1] || "";

        if ($.versionComparisons[comparison]) {
            return $.versionComparisons[comparison](result[2], version);
        }

        throw new Error("Unknown comparison '" + comparison + "'");
    };
})(jQuery);
