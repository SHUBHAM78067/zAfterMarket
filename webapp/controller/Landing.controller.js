sap.ui.define([
	'sap/m/MessageToast',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(MessageToast, Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("zAfterMarket.controller.Landing", {

		// that = this;

		onInit: function() {
			debugger;
			// sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({
			// 	enable: true
			// }), "state");
			var curUrl = window.location.protocol + "//" + window.location.host;
			var url2 = curUrl + "/sap/bc/ui2/start_up";
			$.ajax({
				url: url2,
				async: false,
				success: function(evt) {
					this.UserID = evt.id;
				}.bind(this),
				error: function(oError) {
					// debugger;
					// Code to handle the error case
				}
			});
		},

		handleSelectionChange: function(oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");

			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}

			MessageToast.show("selectionChange: " + state + " '" + changedItem.getText() + "'", {
				width: "auto"
			});
		},

		handleSelectionFinish: function(oEvent) {
			var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = "Event 'selectionFinished': [";

			for (var i = 0; i < selectedItems.length; i++) {
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
			}

			messageText += "]";

			MessageToast.show(messageText, {
				width: "auto"
			});
		},
		handleSelectionFinishMcb1: function() {
			var oDialog = this.byId("BusyDialog");
			oDialog.open();
			var aFilterMultiComboBox = [];
			var oMultiComboBox1SelectedKeys = this.getView().byId("MultiComboBox1").getSelectedKeys();
			for (var i = 0; i < oMultiComboBox1SelectedKeys.length; i++) {
				aFilterMultiComboBox.push(new Filter("A0REGION", FilterOperator.EQ, oMultiComboBox1SelectedKeys.slice(0)[i].split("/")[1]));
			}

			var oModel = this.getView().getModel("data2");
			oModel.read("/ZPLT_M01_Q0004Results", {
				filters: aFilterMultiComboBox,
				success: function(oData, response) {
					debugger;
					// Code to handle the success case
					var oMcb2Model = new sap.ui.model.json.JSONModel(oData);
					this.getView().byId("MultiComboBox2").setModel(oMcb2Model);
					oDialog.close();
				}.bind(this),
				error: function(oError) {
					debugger;
					// Code to handle the error case
				}
			});

		},
		onComboBoxChange: function(oEvent) {
			var oDialog = this.byId("BusyDialog");
			oDialog.open();

			var oComboBoxChange = this.getView().byId("ComboBox").getSelectedKey();
			var oModel = this.getView().getModel("data1");
			oModel.read("/ZPLT_M01_Q0003(ZVAR_REGION='" + oComboBoxChange + "')/Results", {
				success: function(oData, response) {

					// debugger;
					// Code to handle the success case
					var oMCBModel = new sap.ui.model.json.JSONModel(oData);
					this.getView().byId("MultiComboBox1").setModel(oMCBModel);
					oDialog.close();
				}.bind(this),
				error: function(oError) {
					// debugger;
					// Code to handle the error case
				}
			});

		},
		onPressProceed: function(oEvent) {
			var oDialog = this.byId("BusyDialog");
			oDialog.open();
			// debugger;

			// build filter array
			var aFilter = [];

			var oComboBox = this.getView().byId("ComboBox").getSelectedKey();

			var oMultiComboBox1 = this.getView().byId("MultiComboBox1").getSelectedKeys();
			var oMultiComboBox2 = this.getView().byId("MultiComboBox2").getSelectedKeys();
			aFilter.push(new Filter("A0PLANT__ZREGNGRP", FilterOperator.EQ, oComboBox));

			for (var i = 0; i < oMultiComboBox1.length; i++) {
				aFilter.push(new Filter("A0PLANT__0REGION", FilterOperator.EQ, oMultiComboBox1[i]));
			}

			for (var i = 0; i < oMultiComboBox2.length; i++) {
				aFilter.push(new Filter("A0PLANT", FilterOperator.EQ, oMultiComboBox2[i]));
			}

			var oModel = this.getView().getModel("data3");

			oModel.read("/ZSER_CP01_Q0001(ZV_MONTH='2.2023')/Results", {
				filters: aFilter,
				success: function(oData, response) {
					// debugger;
					// Code to handle the success case
					var oTabModel = new sap.ui.model.json.JSONModel(oData);
					this.getView().byId("idEmpTab").setModel(oTabModel);
					oDialog.close();
				}.bind(this),
				error: function(oError) {
					// debugger;
					// Code to handle the error case
				}
			});

		}

	});
});