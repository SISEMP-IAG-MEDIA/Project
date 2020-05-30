sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/odata/ODataModel"
], function(UIComponent, ODataModel) {
	"use strict";
	return UIComponent.extend("gbi1.Component", {
		metadata: {
			rootView: "gbi1.view.App",
		
    		routing: {
    			
    			config: {
    				viewType: "XML",
    				viewPath: "gbi1.view",
    				targetControl: "splitApp",
    				clearTarget: false,
    				transition: "slide"
    			},
    			
    			routes: [
    			        {
        			            pattern : "",
        			            name : "Campaigns",
        			            view : "Master",
        			            targetAggregation : "masterPages"
        			        },
    		                {
    			                pattern : "Orders/{entity}",
    			                name : "Details",
    			                view : "Details",
    			                targetAggregation : "detailPages"
    		                }
			            ]
    			
    		}
    		
    	},
    	
    	init: function() {
    		UIComponent.prototype.init.apply(this, arguments);
    
    		this.getRouter().initialize();
    
    		var oModel = new ODataModel("http://h06.cob.csuchico.edu:8000/gbi-student-271/gbi1/services/gbi.xsodata");
    		this.setModel(oModel, 'gbi1');
    	}
		
	});
	
});