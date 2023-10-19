AFrame.registerComponent("create-models",{
    getModels:function () {
        return fetch("js/model.json")
        .then(res => res.json())
        .then(data => data);
    }, 
    createModel:function(model){
        var barCodeValue=model.barcode_value;
        var modelUrl=model.model_url;
        var modelName=model.model_name;
        var scene=document.querySelector("a-scene");
        var marker=document.querySelector("a-marker");
        marker.setAttribute("id",`marker-${modelName}`)
        marker.setAttribute("type","barcode")
        marker.setAttribute("model_name",modelName)
        marker.setAttribute("value",barCodeValue)
        marker.setAttribute("markerhandler",{});
        scene.appendChild(marker)

        if(barCodeValue===0){
            var modelEl=document.createElement("a-entity")
            modelEl.setAttribute("id",`${modelName}`)
            modelEl.setAttribute("geometry",{
                primitve:"box",
                width:model.width,
                height:model.height
            })
            modelEl.setAttribute("position",model.position)
            modelEl.setAttribute("rotation",model.rotation)
            modelEl.setAttribute("material",{
                color:model.color
            })
            marker.appendChild(modelEl)
        }
        else{
            var modelEl=document.createElement("a-entity")
            modelEl.setAttribute("id",`${modelName}`)
            modelEl.setAttribute("gltf-model",`url(${modelUrl})`)
            modelEl.setAttribute("scale",model.scale)
            modelEl.setAttribute("position",model.position)
            modelEl.setAttribute("rotation",model.rotation)
            marker.appendChild(modelEl)
        }

        }
    });