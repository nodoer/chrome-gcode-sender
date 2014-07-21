// author: Buck Clay (dev@buckclay.com)
// date: 2013-12-25

// TODO: something is causing it to be terribly slow...
// TODO: come back to load file, previous file is gone... (state loss)
// sending seemed to stop working...



/**
 * Clear the command queue.
 */
function clearCommandQueue() {
  window.workspaceCommandQueue = [];
  window.workspacePendingAck = false;
  $("#lbl-enqueued-command-count").text(0);
}


$(document).ready(function() {
  // configure the console actions.
  $("#lnk-clear-log").click(function(e) {
    $("#console-log").html("");
  });
  $("#lnk-clear-command-queue").click(clearCommandQueue);
  $("#lnk-clear-ack-block").click(function(e) {
    window.workspacePendingAck = false;
  });
});


// Configure AngularJS.
var app = angular.module('gcodeSender', ['ui.router', 'luegg.directives', 'cfp.hotkeys']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('about', {url: "/about", templateUrl: "about.html"})
    .state('settings', {
      url: "/settings",
      templateUrl: "settings.html",
      controller: "settingsCtrl"})
    .state('loadfile', {
      url: "/loadfile",
      templateUrl: "loadfile.html",
      controller: "loadFileCtrl"})
    .state('controlpanel', {
      url: "/controlpanel",
      templateUrl: "controlpanel.html",
      controller: "controlPanelCtrl"})
    ;
});

app.controller('mainCtrl', function($scope, $state,
    settingsService, machineService, warningService) {
  settingsService.load();
  $state.go("controlpanel");

  $scope.$state = $state;
  $scope.warningService = warningService;
  $scope.machineService = machineService;

  /**
   * Connect to the configured serial port.
   */
  $scope.connect = function() {
    // If there is no connection port, send the user to the settings path.
    if (!settingsService.settings.workspace_port) {
      $state.go("settings");
      return;
    }

    machineService.connect(settingsService.settings.workspace_port,
        settingsService.settings.workspace_baud);
  };
  $scope.disconnect = machineService.disconnect;

  // Setup the drag-and-drop listeners.
  document.body.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $state.go("loadfile");
  }, false);
});
