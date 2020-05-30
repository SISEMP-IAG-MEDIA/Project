sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";
   return Controller.extend("gbi1.controller.Master", {
      
        onInit: function() {
		    this.router = sap.ui.core.UIComponent.getRouterFor(this);
	    },
	
    	handleListItemPress: function(oItem){
    	   
            var entity = oItem.getSource().getBindingContext("gbi1").getPath().split("'");
    
    		this.router.navTo("Details", {
    			from: "Master",
    			entity: entity[1]
            });
    	}

   });
});