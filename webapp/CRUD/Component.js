sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/odata/ODataModel"
], function(UIComponent, ODataModel) {
	"use strict";
	return UIComponent.extend("gbi.Component", {
		metadata: {
			rootView: "gbi.view.App",

			routing: {

				config: {
					viewType: "XML",
					viewPath: "gbi.view",
					targetControl: "idAppControl",
					clearTarget: false,
					transition: "slide"
				},

				routes: [
					{
						pattern: "",
						name: "Campaigns",
						view: "Campaigns",
						targetAggregation: "pages"
			        }
		         ]
			}

		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();

			var oModel = new ODataModel("http://h06.cob.csuchico.edu:8000/gbi-student-275/gbi/services/gbi.xsodata");
			this.setModel(oModel, 'gbi');
		}

	});
}); 
