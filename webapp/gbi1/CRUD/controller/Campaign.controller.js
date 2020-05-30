sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageBox",
   "sap/m/MessageToast"
], function(Controller, JSONModel, MessageBox, MessageToast) {
	"use strict";
	return Controller.extend("gbi1.controller.Campaign", {
	    onInit: function() {
	        var jModel = new JSONModel("");
			this.getView().setModel(jModel, 'edit');
            this._showFormFragment("Display");
    },

	_formFragments: {},
    
	_getFormFragment: function (sFragmentName) {
	    //Retrieve the form fragement from the _formFragments object
	    //If it has been created before it will exist in the object
		var oFormFragment = this._formFragments[sFragmentName];
		
        //If the form fragment has already been created, return it
		if (oFormFragment) {
			return oFormFragment;
		}

        //If it hasn't been created before load it from the file in the view package
		oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "gbi1.view." + sFragmentName);

        //Add it to the _formFragments object and return it
		return this._formFragments[sFragmentName] = oFormFragment;
	},
	_showFormFragment : function (sFragmentName) {
	              //Get a reference to the grid control
		var oGrid = this.getView().byId("idGrid");
		//Delete the currrent content
		oGrid.removeAllContent();
		//Insert the new fragment
		oGrid.insertContent(this._getFormFragment(sFragmentName));
		
		if(sFragmentName === "Edit") {
         //Create a context using the edit model
            var oContext = new sap.ui.model.Context(this.getView().getModel("edit") , "/");
            //Bind the edit form to the edit model
            this.getView().byId("idEditForm").setBindingContext(oContext,"edit");
		    
		}
	},
	_toggleButtonsAndView : function (form) {
		var oView = this.getView();
        	if(form === "Edit"){
            	                 oView.byId("edit").setVisible(false);
		    oView.byId("create").setVisible(false);
		    oView.byId("save").setVisible(true);
		    oView.byId("cancel").setVisible(true);
		    oView.byId("delete").setVisible(true);    
		    this._showFormFragment("Edit");
		    
		    if(form === "Display"){
            oView.byId("edit").setVisible(true);
         	oView.byId("create").setVisible(true);
        	oView.byId("save").setVisible(false);
        	oView.byId("cancel").setVisible(false);
        	oView.byId("delete").setVisible(false);    
              this._showFormFragment("Display");
        }


        }

	},
	handleEditPress : function () {
		//Create a flag so we know that a customer is being edited
		this.editFlag = true;
		//Clone the data so we can cancel the changes if necessary
		this._oCustomer = jQuery.extend({}, this.getView().byId("idCampaignForm").getBindingContext('gbi1').getObject());
		
		//Add the object ot edit to the edit model
        this.getView().getModel("edit").setData(this._oCustomer);		
		
		//Save the binding context of the display form so we can reset it if necessary
		this._context =  this.getView().byId("idCampaignForm").getBindingContext('gbi1');
		//Save the binding path so we can perform puts and posts
		this._sPath = this.getView().byId("idCampaignForm").getBindingContext('gbi1').sPath.slice(1);
                             this._toggleButtonsAndView("Edit");
		
	},
	handleTableRowPress : function(oEvent){
        //When a table row is clicked, get its binding context and set the display form's binding context
        var context = oEvent.getParameter("listItem").getBindingContext('gbi1');
        this.getView().byId("idCampaignForm").setBindingContext(context,'gbi1');
    }, 
    handleCancelPress : function () {
	//Restore the data
	var oModel = this.getView().getModel('gbi1');
	//Put back the original data
	oModel.oData[this._sPath] = this._oCampaign;
	this._toggleButtonsAndView("Display");
    },
    handleDeletePress: function() {
	//Confirm the user wants to delete the customer
	var path = this._sPath;
	var oModel = this.getView().getModel("gbi1");
	MessageBox.confirm(
		"Are you sure you want to delete the campaign?", {
			icon: MessageBox.Icon.INFORMATION,
			title: "Confirm Delete",
			initialFocus: MessageBox.Action.CANCEL,
			onClose: function(oAction) {
				if (oAction === "OK") {
					oModel.remove('/' + path, null, function() {
						MessageToast.show("Delete successful");
					}, function() {
						MessageToast.show("Delete failed");
					});
				}
			}
		}
	);
	this._toggleButtonsAndView("Display");
    },
    handleSavePress : function () {
    //Retrieve the view's model
    var oModel = this.getView().getModel('gbi1');
    
    //Create an object and add the customer properties to it from the form
    var oEntry = {};
    
    //Check whether the customer is being edited or created
    oEntry["CampaignName"] = this.byId("idCampaignName").getValue();  

	    
    if(this.editFlag){
        oEntry["ID.CampaignID"] = this.byId('idCampaignID').getText(); 
        //Perform a PUT
        oModel.update('/' + this._sPath, oEntry, null, function(data){
		    MessageToast.show("Update successful");
 	    },function(data){
		    MessageToast.show("Update failed");
 	    });
 	    oEntry["ID.CampaignID"] = 0;  
    //Perform a POST
    oModel.create('/Campaigns', oEntry, null, function(data){
    sap.m.MessageToast.show("Update successful");
     },function(data){
    sap.m.MessageToast.show("Update failed");
    });

    }  

	this._toggleButtonsAndView("Display");},
	
	handleCreatePress: function() {
	var oEntry = {};

	//Check whether the customer is being edited or created
	oEntry["CampaignName"] = "";

	this.getView().getModel("edit").setData(oEntry);
	//Create pressed so set editFlag to false
	this.editFlag = false; 
	this._toggleButtonsAndView("Edit");
}

	});
});
