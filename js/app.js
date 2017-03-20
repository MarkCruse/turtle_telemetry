(function() {

    L.mapbox.accessToken = 'pk.eyJ1IjoibWRjcnVzZSIsImEiOiJjaXphYnhyaXMwMm1zMnFvOHVhanZtMGZ5In0.xnbrvIVE2IXBudC4OwuZtw';


    // create the Leaflet map using mapbox.light tiles
    var map = L.mapbox.map('map', 'mapbox.light', {
        zoomSnap: .1,
        center: [34.6, -75.23],
        zoom: 3,
        minZoom: 3,
        maxZoom: 9,
        //maxBounds: L.latLngBounds([31.9, -85.3], [36.50585, -80.6])
    });
    // load CSV data
    // use omnivore to generate a GeoJSON data structure (.toGeoJSON)
    var dataValues = []; //a blank array to hold name of turtle
    minYear = '2012'; // set the beginning year of data
    maxYear = '2017'; // set end year of data
    omnivore.csv('data/obis_seamap_20170305_200629_custom_2012-2017.csv')
        .on('ready', function(e) {
            drawMap(e.target.toGeoJSON());
            //drawLegend(e.target.toGeoJSON());
        })
        .on('error', function(e) {
            console.log(e.error[0].message);
        })

    var options = {
        pointToLayer: function(feature, ll) {
            return L.circleMarker(ll, {
                opacity: 1,
                weight: 1,
                fillOpacity: 1,
                radius: 2
            })
            console.log(options);

        }
    } //end options



    function sequenceUI(turtleLayer) {


        // create Leaflet control for the slider
        var sliderControl = L.control({
            position: 'bottomleft'
        });

        // when added to the map
        sliderControl.onAdd = function(map) {

            // select the element with id of 'slider'
            var controls = L.DomUtil.get("slider");

            // disable the mouse events
            L.DomEvent.disableScrollPropagation(controls);
            L.DomEvent.disableClickPropagation(controls);

            // add slider to the control
            return controls;
        }

        // add the control to the map
        sliderControl.addTo(map);


        $('.slider')
            .on('input change', function() {
                var selectYear = $(this).val();
                drawLabel(selectYear);
            });
    } // end function sequenceUI


    function checkUnique(object) {
        var found = 0;
        for (i = 0; i < dataValues.length; i++) {
            if (dataValues[i] = object) {
                found = 1;
            }
        }
        return (found);
    }

    function loadSpecies(layer) {

        // load the array 'dataValues' with all the species
        var arrayCount = 0;

        var props = e.layer.feature.properties;
        //data.features.map(function(data) {
        // for (var species in data) {
        //var object = data.properties.common_name;
        //console.log(layer);
        // //  if species name is unique then add it
        // if (arrayCount < 1) {
        //     dataValues.push(object);
        //     arrayCount++;
        // } else {
        //     var found = checkUnique(object);
        //     if (found = 1) {
        //         dataValues.push(object);
        //         found = 0;
        //         arrayCount++;
        //     }
        // }
        // console.log(dataValues.length);
    }

    // console.log(dataValues.length);
    //  console.log(arrayCount);


    function drawMap(data) {
        // access to data here
        // console.log(data);
        var turtleLayer = L.geoJson(data, options).addTo(map);

        //loadSpecies(turtleLayer);
        sequenceUI(turtleLayer);
        drawLabel(2012); //THIS CAN BE REMOVED if a call is done to color by species
        //resizeCircles(girlsLayer, boysLayer, 1);

        retrieveInfo(turtleLayer);
        map.fitBounds(turtleLayer.getBounds());

    } //end drawMap

    function retrieveInfo(turtleLayer) {
        var info = $('#info');

        turtleLayer.on('mouseover', function(e) { //detect mouseover events

            info.removeClass('none').show(); //remove the none class to display the element

            var props = e.layer.feature.properties;
            $('#info span').html(props);
            $(".species span:first-child").html(props.species);
            $(".common_name span:first-child").html(props.common_name);
            $(".year span:first-child").html(props.year);

            // raise opacity level as visual affordance
            e.layer.setStyle({
                fillOpacity: .9,
                fillColor: yellow
            });

        }); //end mouseover

        // hide the info panel when mousing off layergroup and remove affordance opacity
        turtleLayer.on('mouseout', function(e) {
            info.hide();
            e.layer.setStyle({
                fillOpacity: 0
            });
        }); //end mouseout


        // when the mouse moves on the document
        $(document).mousemove(function(e) {
            // first offset from the mouse position of the info window
            info.css({
                "left": e.pageX + 6,
                "top": e.pageY - info.height() - 25
            });

            // if it crashes into the top, flip it lower right
            if (info.offset().top < 4) {
                info.css({
                    "top": e.pageY + 15
                });
            }
            // if it crashes into the right, flip it to the left
            if (info.offset().left + info.width() >= $(document).width() - 40) {
                info.css({
                    "left": e.pageX - info.width() - 80
                });
            }
        }); //end mousemove

    } // end function retrieveInfo

    function drawLabel(gradeLevel) {

        // label the grade level
        $(".slide-label").html('Year: ' + gradeLevel);

        // create Leaflet control for the legend
        var label = L.control({
            position: 'bottomleft'
        });
        //  add to the map
        label.onAdd = function(map) {

            // select the element with id of 'label'
            var div = L.DomUtil.get("label");

            // disable the mouse events
            L.DomEvent.disableScrollPropagation(div);
            L.DomEvent.disableClickPropagation(div);

            // add label to the control
            return div;

        }
        // add label to the map
        label.addTo(map);
    }

})();
