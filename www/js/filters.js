angular.module('babyThings.filters', [])

.filter("displayDate", function () {
    return function (input) {
        var inputdate = Date.parse(input, "yyyy/MM/dd");
        if (Date.today().equals(inputdate)) {
            return "今天";
        } else if (Date.today().addDays(1).equals(inputdate)) {
            return "明天";
        } else {
            return input;
        }
    }
})
