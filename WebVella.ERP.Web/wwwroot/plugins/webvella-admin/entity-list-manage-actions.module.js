﻿/* entity-lists.module.js */

/**
* @desc this module manages the entity record lists in the admin screen
*/

(function () {
	'use strict';

	angular
        .module('webvellaAdmin') //only gets the module, already initialized in the base.module of the plugin. The lack of dependency [] makes the difference.
        .config(config)
		.controller('DeleteListModalController', deleteListModalController)
		.controller('ManageListServiceCodeModalController', ManageListServiceCodeModalController)
		.controller('AddManageListActionItemModalController', AddManageListActionItemModalController)
        .controller('WebVellaAdminEntityListManageMenuController', controller);

	// Configuration ///////////////////////////////////
	config.$inject = ['$stateProvider'];

	
	function config($stateProvider) {
		$stateProvider.state('webvella-admin-entity-list-manage-actions', {
			parent: 'webvella-admin-base',
			url: '/entities/:entityName/lists/:listName/actions', //  /desktop/areas after the parent state is prepended
			views: {
				"topnavView": {
					controller: 'WebVellaAdminTopnavController',
					templateUrl: '/plugins/webvella-admin/topnav.view.html',
					controllerAs: 'topnavData'
				},
				"sidebarView": {
					controller: 'WebVellaAdminSidebarController',
					templateUrl: '/plugins/webvella-admin/sidebar.view.html',
					controllerAs: 'sidebarData'
				},
				"contentView": {
					controller: 'WebVellaAdminEntityListManageMenuController',
					templateUrl: '/plugins/webvella-admin/entity-list-manage-actions.view.html',
					controllerAs: 'ngCtrl'
				}
			},
			resolve: {
				checkedAccessPermission: checkAccessPermission,
				resolvedCurrentEntityMeta: resolveCurrentEntityMeta,
				resolvedViewLibrary: resolveViewLibrary,
				resolvedCurrentEntityList: resolveCurrentEntityList,
				resolvedEntityRelationsList: resolveEntityRelationsList,
			},
			data: {

			}
		});
	};


	//#region << Resolve Functions >>/////////////////////////
	checkAccessPermission.$inject = ['$q', '$log', 'resolvedCurrentUser', 'ngToast'];
	
	function checkAccessPermission($q, $log, resolvedCurrentUser, ngToast) {
		var defer = $q.defer();
		var messageContent = '<span class="go-red">No access:</span> You do not have access to the <span class="go-red">Admin</span> area';
		var accessPermission = false;
		for (var i = 0; i < resolvedCurrentUser.roles.length; i++) {
			if (resolvedCurrentUser.roles[i] == "bdc56420-caf0-4030-8a0e-d264938e0cda") {
				accessPermission = true;
			}
		}

		if (accessPermission) {
			defer.resolve();
		}
		else {

			ngToast.create({
				className: 'error',
				content: messageContent,
				timeout: 7000
			});
			defer.reject("No access");
		}

		return defer.promise;
	}

	resolveCurrentEntityMeta.$inject = ['$q', '$log', 'webvellaCoreService', '$stateParams', '$state', '$timeout'];
	
	function resolveCurrentEntityMeta($q, $log, webvellaCoreService, $stateParams, $state, $timeout) {
		// Initialize
		var defer = $q.defer();

		// Process
		function successCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.resolve(response.object);
			}
		}

		function errorCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.reject(response.message);
			}
		}

		webvellaCoreService.getEntityMeta($stateParams.entityName, successCallback, errorCallback);

		// Return
		return defer.promise;
	}

	resolveCurrentEntityList.$inject = ['$q', '$log', 'webvellaCoreService', '$stateParams', '$state', '$timeout'];
	
	function resolveCurrentEntityList($q, $log, webvellaCoreService, $stateParams, $state, $timeout) {
		// Initialize
		var defer = $q.defer();

		// Process
		function successCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.resolve(response.object);
			}
		}

		function errorCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.reject(response.message);
			}
		}

		webvellaCoreService.getEntityList($stateParams.listName, $stateParams.entityName, successCallback, errorCallback);

		return defer.promise;
	}

	resolveViewLibrary.$inject = ['$q', '$log', 'webvellaCoreService', '$stateParams', '$state', '$timeout'];
	
	function resolveViewLibrary($q, $log, webvellaCoreService, $stateParams, $state, $timeout) {
		// Initialize
		var defer = $q.defer();

		// Process
		function successCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.resolve(response.object);
			}
		}

		function errorCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.reject(response.message);
			}
		}

		webvellaCoreService.getEntityViewLibrary($stateParams.entityName, successCallback, errorCallback);

		return defer.promise;
	}

	resolveEntityRelationsList.$inject = ['$q', '$log', 'webvellaCoreService', '$stateParams', '$state', '$timeout'];
	
	function resolveEntityRelationsList($q, $log, webvellaCoreService, $stateParams, $state, $timeout) {
		// Initialize
		var defer = $q.defer();

		// Process
		function successCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.resolve(response.object);
			}
		}

		function errorCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.reject(response.message);
			}
		}

		webvellaCoreService.getRelationsList(successCallback, errorCallback);
		return defer.promise;
	}
	//#endregion

	//#region << Controller >> ///////////////////////////////
	controller.$inject = ['$scope', '$log', '$rootScope', '$state', '$timeout', 'ngToast', 'pageTitle', 'resolvedCurrentEntityMeta', '$uibModal', 'resolvedCurrentEntityList',
						'resolvedViewLibrary', 'webvellaCoreService', 'resolvedEntityRelationsList'];
	
	function controller($scope, $log, $rootScope, $state, $timeout, ngToast, pageTitle, resolvedCurrentEntityMeta, $uibModal, resolvedCurrentEntityList,
						resolvedViewLibrary, webvellaCoreService, resolvedEntityRelationsList) {
		
		var ngCtrl = this;
		ngCtrl.entity = resolvedCurrentEntityMeta;

		//#region << Update page title & hide the side menu >>
		ngCtrl.pageTitle = "Entity Details | " + pageTitle;
		$timeout(function(){
			$rootScope.$emit("application-pageTitle-update", ngCtrl.pageTitle);
			//Hide Sidemenu
			$rootScope.$emit("application-body-sidebar-menu-isVisible-update", false);
		},0);

		$rootScope.adminSectionName = "Entities";
		$rootScope.adminSubSectionName = ngCtrl.entity.label;
		//#endregion


 		//#region << Initialize the list >>
		ngCtrl.list = fastCopy(resolvedCurrentEntityList);
		ngCtrl.relationsList = fastCopy(resolvedEntityRelationsList);
		//#endregion
	
		//#region << Order actionItems >>
		ngCtrl.orderActionItems = function () {
			ngCtrl.list.actionItems.sort(function (a, b) { return parseFloat(a.weight) - parseFloat(b.weight) });
		}
		//#endregion

		//#region << Restore defaults >>

		ngCtrl.restoreActionTemplatesDefault = function(){
			alert("Not implemented yet");
		}

		//#endregion

		//#region << Modals >>
		ngCtrl.deleteListModal = function () {
			var modalInstance = $uibModal.open({
				animation: false,
				templateUrl: 'deleteListModal.html',
				controller: 'DeleteListModalController',
				controllerAs: "popupCtrl",
				size: "",
				resolve: {
					parentData: function () { return ngCtrl; }
				}
			});
		}

		ngCtrl.manageServiceCodeModal = function () {
			var modalInstance = $uibModal.open({
				animation: false,
				templateUrl: 'manageServiceCodeModal.html',
				controller: 'ManageListServiceCodeModalController',
				controllerAs: "popupCtrl",
				size: "width-100p",
				backdrop:"static",
				resolve: {
					parentData: function () { return ngCtrl; }
				}
			});
		}

		ngCtrl.addManageActionItemModal = function (actionItem) {
			var modalInstance = $uibModal.open({
				animation: false,
				templateUrl: 'addManageActionItemModal.html',
				controller: 'AddManageListActionItemModalController',
				controllerAs: "popupCtrl",
				size: "width-100p",
				backdrop:"static",
				resolve: {
					parentData: function () { return ngCtrl; },
					actionItem: function () { return actionItem; }
				}
			});
		}
		//#endregion
	}
	//#endregion


	//#region << Modal Controllers >>
	deleteListModalController.$inject = ['parentData', '$uibModalInstance', '$log', 'webvellaCoreService', 'ngToast', '$timeout', '$state'];
	
	function deleteListModalController(parentData, $uibModalInstance, $log, webvellaCoreService, ngToast, $timeout, $state) {
		
		var popupCtrl = this;
		popupCtrl.parentData = parentData;

		popupCtrl.ok = function () {

			webvellaCoreService.deleteEntityList(popupCtrl.parentData.list.name, popupCtrl.parentData.entity.name, successCallback, errorCallback);

		};

		popupCtrl.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		/// Aux
		function successCallback(response) {
			ngToast.create({
				className: 'success',
				content: '<span class="go-green">Success:</span> ' + response.message
			});
			$uibModalInstance.close('success');
			$timeout(function () {
				$state.go("webvella-admin-entity-lists", { entityName: popupCtrl.parentData.entity.name }, { reload: true });
			}, 0);
		}

		function errorCallback(response) {
			popupCtrl.hasError = true;
			popupCtrl.errorMessage = response.message;


		}

	};
	
	ManageListServiceCodeModalController.$inject = ['parentData', '$uibModalInstance', '$log', 'webvellaCoreService', 'ngToast', '$timeout', '$state'];
	
	function ManageListServiceCodeModalController(parentData, $uibModalInstance, $log, webvellaCoreService, ngToast, $timeout, $state) {

		
		var popupCtrl = this;
		popupCtrl.parentData = fastCopy(parentData);
		popupCtrl.serviceCode = fastCopy(popupCtrl.parentData.list.serviceCode);

		//#region << Ace editor >>
		popupCtrl.aceOptions = {
			useWrapMode: true,
			showGutter: true,
			theme: 'twilight',
			mode: 'javascript',
			firstLineNumber: 1,
			onLoad: popupCtrl.aceOnLoad,
			onChange: popupCtrl.aceOnChange,
			advanced:{
				showPrintMargin:false,
				fontSize:"16px"
			}
		}
		popupCtrl.aceOnChange = function (event) {};
		//#endregion

		popupCtrl.loadDefaultScript = function(){
			webvellaCoreService.getFileContent("/api/v1/en_US/meta/entity/" + popupCtrl.parentData.entity.name +"/list/" + popupCtrl.parentData.list.name +"/service.js?defaultScript=true",getDefaultScriptSuccessCallback,getDefaultScriptErrorCallback);
		}

		popupCtrl.ok = function () {
			var postObj = {};
			postObj.serviceCode = fastCopy(popupCtrl.serviceCode);
			webvellaCoreService.patchEntityList(postObj, popupCtrl.parentData.list.name, popupCtrl.parentData.entity.name, successCallback, errorCallback)
		};

		popupCtrl.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		/// Aux
		function successCallback(response) {
			ngToast.create({
				className: 'success',
				content: '<span class="go-green">Success:</span> ' + response.message
			});
			parentData.list.serviceCode = response.object.serviceCode;
			$uibModalInstance.close('success');
		}

		function errorCallback(response) {
			popupCtrl.hasError = true;
			popupCtrl.errorMessage = response.message;


		}

		function getDefaultScriptSuccessCallback(response) {
			ngToast.create({
				className: 'success',
				content: '<span class="go-green">Success:</span> Contents loaded'
			});

			popupCtrl.serviceCode = response.data;
		}

		function getDefaultScriptErrorCallback(response) {
			ngToast.create({
				className: 'danger',
				content: '<span class="go-green">Error:</span> ' + response.message
			});
		}
	};

	AddManageListActionItemModalController.$inject = ['parentData','actionItem', '$uibModalInstance', '$log', 'webvellaCoreService', 'ngToast', '$timeout', '$state'];
	
	function AddManageListActionItemModalController(parentData,actionItem, $uibModalInstance, $log, webvellaCoreService, ngToast, $timeout, $state) {

		
		var popupCtrl = this;
		popupCtrl.parentData = fastCopy(parentData);
		popupCtrl.originalActionItems = fastCopy(parentData.list.actionItems);
		popupCtrl.actionItem = {};
		popupCtrl.isEdit = false;
		if(actionItem != null){
			popupCtrl.isEdit = true;
			popupCtrl.actionItem = fastCopy(actionItem);
		}
		else {
		  popupCtrl.actionItem = webvellaCoreService.initListActionItem();
		  popupCtrl.actionItem.menu = "hidden";
		  popupCtrl.actionItem.template = "";
		}

		//#region << Ace editor >>
		popupCtrl.aceOptions = {
			useWrapMode: true,
			showGutter: true,
			theme: 'twilight',
			mode: 'xml',
			firstLineNumber: 1,
			onLoad: popupCtrl.aceOnLoad,
			onChange: popupCtrl.aceOnChange,
			advanced:{
				showPrintMargin:false,
				fontSize:"16px"
			}
		}
		popupCtrl.aceOnChange = function (event) {};
		//#endregion

		//#region << List types >>
		popupCtrl.menuOptions = webvellaCoreService.getListMenuOptions();
		//#endregion


		popupCtrl.validateName = function (name) {
			var isUnique = true;
			popupCtrl.nameError = false;
			popupCtrl.nameMessage = "";
			popupCtrl.originalActionItems.forEach(function (item) {
				if (item.name === name) {
					isUnique = false;
				}
			});
			if(!name){
				popupCtrl.nameError = true;
				popupCtrl.nameMessage = "required";
				return false;				
			}
			else if (!isUnique) {
				popupCtrl.nameError = true;
				popupCtrl.nameMessage = "should be unique for the current view";
				return false;
			}
			else {
				return true;
			}
		}

		popupCtrl.removeActionItemByName = function(name, proccessedArray){
			var newArray = [];
			for (var i = 0; i < proccessedArray.length; i++) {
			   if(proccessedArray[i].name !== name){
					newArray.push(proccessedArray[i]);
			   }
			}
			return newArray;
		}


		popupCtrl.ok = function () {
			if (popupCtrl.isEdit) {
				//Is name changed
				var nameIsChanged = true;
				if (popupCtrl.actionItem.name == actionItem.name) {
					nameIsChanged = false;
				}
				if(nameIsChanged && !popupCtrl.validateName(popupCtrl.actionItem.name)){
					return;
				}
				var updatedActionItems = popupCtrl.removeActionItemByName(actionItem.name,popupCtrl.originalActionItems)
				var postObj = {};
				postObj.actionItems = updatedActionItems;
				postObj.actionItems.push(popupCtrl.actionItem);
				webvellaCoreService.patchEntityList(postObj, popupCtrl.parentData.list.name, popupCtrl.parentData.entity.name, successCallback, errorCallback);					
			}
			else {
				if (popupCtrl.validateName(popupCtrl.actionItem.name)) {
					var postObj = {};
					postObj.actionItems = popupCtrl.originalActionItems;
					postObj.actionItems.push(popupCtrl.actionItem);
					webvellaCoreService.patchEntityList(postObj, popupCtrl.parentData.list.name, popupCtrl.parentData.entity.name, successCallback, errorCallback);
				}
			}
		};

		popupCtrl.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		popupCtrl.delete = function () {
			var updatedActionItems = popupCtrl.removeActionItemByName(actionItem.name,popupCtrl.originalActionItems)
			var postObj = {};
			postObj.actionItems = updatedActionItems;
			webvellaCoreService.patchEntityList(postObj, popupCtrl.parentData.list.name, popupCtrl.parentData.entity.name, successCallback, errorCallback);
		};

		/// Aux
		function successCallback(response) {
			ngToast.create({
				className: 'success',
				content: '<span class="go-green">Success:</span> ' + response.message
			});
			parentData.list.actionItems = response.object.actionItems;
			parentData.orderActionItems();
			$uibModalInstance.close('success');
		}

		function errorCallback(response) {
			popupCtrl.hasError = true;
			popupCtrl.errorMessage = response.message;


		}
	};	
	
	//#endregion

})();
