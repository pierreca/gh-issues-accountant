"use strict";
var Promise = require("bluebird");
var gh_issues_api_1 = require("gh-issues-api");
function index(context, myTimer) {
    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log('Function trigger timer is past due!');
    }
    var repoName = 'azure-iot-sdk-node';
    var repoOwner = 'azure';
    var labels = [
        'bug',
        'build issue',
        'investigation required',
        'help wanted',
        'enhancement',
        'question',
        'documentation',
    ];
    var repo = new gh_issues_api_1.GHRepository(repoOwner, repoName);
    var report = {
        name: repoName
    };
    context.log('Getting issues for ' + repoOwner + '/' + repoName, timeStamp);
    repo.loadAllIssues().then(function () {
        var promises = labels.map(function (label) {
            var filterCollection = new gh_issues_api_1.FilterCollection();
            filterCollection.label = new gh_issues_api_1.IssueLabelFilter(label);
            return Promise.all([
                repo.list(gh_issues_api_1.IssueType.All, gh_issues_api_1.IssueState.Open, filterCollection).then(function (issues) { return report[label] = issues.length; }),
                repo.list(gh_issues_api_1.IssueType.All, gh_issues_api_1.IssueState.Open).then(function (issues) { return report['total'] = issues.length; })
            ]);
        });
        return Promise.all(promises);
    }).then(function (report) {
        var reportAsString = JSON.stringify(report);
        context.log(reportAsString);
        context.bindings.issueReport = reportAsString;
        context.done();
    });
    ;
}
exports.index = index;
//# sourceMappingURL=index.js.map