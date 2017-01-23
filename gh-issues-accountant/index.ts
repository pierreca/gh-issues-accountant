
import Promise = require('bluebird');

import {
  GHRepository,
  IssueType,
  IssueState,
  IssueFilter,
  IssueLabel,
  IssueLabelFilter,
  FilterCollection
} from 'gh-issues-api';

export function index(context: any, myTimer: any) {
  var timeStamp = new Date().toISOString();

  if(myTimer.isPastDue) {
      context.log('Function trigger timer is past due!');
  }

  const repoName = 'azure-iot-sdk-node';
  const repoOwner = 'azure';
  const labels = [
    'bug',
    'build issue',
    'investigation required',
    'help wanted',
    'enhancement',
    'question',
    'documentation',
  ];

  const repo = new GHRepository(repoOwner, repoName);
  var report = {
    name: repoName
  };

  context.log('Getting issues for ' + repoOwner + '/' + repoName, timeStamp);   
  repo.loadAllIssues().then(() => {
    var promises = labels.map(label => {
      var filterCollection = new FilterCollection();
      filterCollection.label = new IssueLabelFilter(label);
      return Promise.all([
        repo.list(IssueType.All, IssueState.Open, filterCollection).then(issues => report[label] = issues.length),
        repo.list(IssueType.All, IssueState.Open).then(issues => report['total'] = issues.length)
      ]);
    });

    return Promise.all(promises);
  }).then(report => {
    context.bindings.issueReport = report;
    context.done();
  });;
}