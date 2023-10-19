var modelList = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var compounds = await this.getCompounds();

    this.el.addEventListener("markerFound", () => {
      var elementName = this.el.getAttribute("element_name");
      var barcodeValue = this.el.getAttribute("value");
      elementsArray.push({ element_name: elementName, barcode_value: barcodeValue });

      // Changing Compound Visiblity
      compounds[barcodeValue]["compounds"].map(item => {
        var compound = document.querySelector(`#${item.compound_name}-${barcodeValue}`);
        compound.setAttribute("visible", false);
      });

      // Changing Atom Visiblity
      var atom = document.querySelector(`#${elementName}-${barcodeValue}`);
      atom.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var elementName = this.el.getAttribute("element_name");
      var index = elementsArray.findIndex(x => x.element_name === elementName);
      if (index > -1) {
        elementsArray.splice(index, 1);
      }
    });
  },


  /*tick: function () {
    if (elementsArray.length > 1) {

      var messageText = document.querySelector("#message-text");

      var length = elementsArray.length;
      var distance = null;

      var compound = this.getCompound();

      if (length === 2) {
        var marker1 = document.querySelector(`#marker-${elementsArray[0].barcode_value}`);
        var marker2 = document.querySelector(`#marker-${elementsArray[1].barcode_value}`);

        distance = this.getDistance(marker1, marker2);

        if (distance < 1.25) {
          if (compound !== undefined) {
            this.showCompound(compound);
          } else {
            messageText.setAttribute("visible", true);
          }
        } else {
          messageText.setAttribute("visible", false);
        }
      }

      if (length === 3) {
        var marker1=document.querySelector(`#marker-${elementsArray[0].barcode_value}`)
        var marker2=document.querySelector(`#marker-${elementsArray[1].barcode_value}`)
        var marker3=document.querySelector(`#marker-${elementsArray[2].barcode_value}`)    
        var distance1=this.getDistance(marker1, marker2)
        var distance2=this.getDistance(marker1, marker3)
        if(distance1<1.25 && distance2<1.25){
          if(compound!==undefined){
            var barcodeValue=elementsArray[0].barcode_value
            this.showCompound(compound,barcodeValue)
          } 
          else{
            messageText.setAttribute("visible", true)
          }
        }
        else{
          messageText.setAttribute("visible", false)
        }       
      }
    }
  },*/
  //Calculate distance between two position markers
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  getModelGeometry: function(models, modelName){
    var barcodes = Object.keys(models);
    for (var barcode of barcodes){
        if (models[barcode]. model_name===modelName) {
            return {
                position: models[barcode]["placement _position"], 
                rotation: models[barcode]["placement_rotation"], 
                scale: models [barcode]["placement_scale"], 
                model_url: models[barcode]["model_url"]
            };
        }
    }
  },
  placeTheModel: function (modelName, models) {
    var isListContainModel = this.isModelPresentInArray (modelList, modelName);
    if (isListContainModel) {
        var distance = null;
        var marker1 = document. querySelector(`#marker-base`);
        var marker2 = document.querySelector(`#marker-${modelName}`);
        distance = this.getDistance (marker1, marker2);
        if (distance < 1.25) {
            var modelEl = document.querySelector(`#${modelName}`);
            modelEl.setAttribute("visible", false);
            var isModelPlaced = document.querySelector (`#model-${modelName}`);
            if (isModelPlaced === null) {
                var el = document. createElement ("a-entity");
                var modelGeometry = this.getModelGeometry (models, modelName);
                el.setAttribute("id", `model-${modelName}`);
                el.setAttribute("gltf-model", `ur1(${modelGeometry.model_url})`);
                el.setAttribute("position", modelGeometry.position); 
                el.setAttribute("rotation", modelGeometry.rotation); 
                el.setAttribute("scale", modelGeometry.scale); 
                marker1.appendChild(el);
            }
        }
    }
  },
  isModelPresentInArray: function(arr, val){
    for (var i of arr){
        if (i.model_name===val){
            return true;
        }
    }
    return false;
  },
  tick: async function(){
    if(modelList.length>1){
        var isBaseModelPresent=this.isModelPresentInArray(modelList, "base")
        var messageText=document.querySelector("#message-text");
        if(!isBaseModelPresent){
            messageText.setAttribute("visible", true);
        }
        else{
            if(models===null){
                models=await this.getModels()
            }
            messageText.setAttribute("visible", false);
            this.placeTheModel("road", models)
            this.placeTheModel("car", models)
            this.placeTheModel("building1", models)
            this.placeTheModel("building2", models)
            this.placeTheModel("building3", models)
            this.placeTheModel("tree", models)
            this.placeTheModel("sun", models)
        }
    }
  },

});
