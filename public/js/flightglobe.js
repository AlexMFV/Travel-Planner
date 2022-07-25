let root = am5.Root.new("flightGlobe");

root.setThemes([
    am5themes_Animated.new(root)
]);

var chart = root.container.children.push(am5map.MapChart.new(root, {
    panX: "rotateX",
    panY: "translateY",
    minZoomLevel: 2.5,
    maxZoomLevel: 5,
    zoomLevel: 2.5,
    projection: am5map.geoMercator(),
    homeGeoPoint: { longitude: -10, latitude: 52 }
}));

var cont = chart.children.push(am5.Container.new(root, {
    layout: root.horizontalLayout,
    x: 20,
    y: 40
}));

var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
backgroundSeries.mapPolygons.template.setAll({
    fill: root.interfaceColors.get("alternativeBackground"),
    fillOpacity: 0,
    strokeOpacity: 0
});

// Add background polygon
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
backgroundSeries.data.push({
    geometry: am5map.getGeoRectangle(90, 180, -90, -180)
});

// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow,
    stroke: am5.color(0xe7e7ff),
    fill: am5.color(0xA5A6FF),
}));

// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
lineSeries.mapLines.template.setAll({
    stroke: root.interfaceColors.get("alternativeBackground"),
    strokeOpacity: 0.3
});

// Create point series for markers
// https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

pointSeries.bullets.push(function () {
    var circle = am5.Circle.new(root, {
        radius: 7,
        tooltipText: "{name}",
        cursorOverStyle: "pointer",
        tooltipY: 0,
        //fill: am5.color(0xffba00),
        fill: am5.color("#ff7575"),
        stroke: root.interfaceColors.get("background"),
        strokeWidth: 2,
        draggable: false
    });

    return am5.Bullet.new(root, {
        sprite: circle
    });
});

//Define the selected countries
var country1 = addCity({ latitude: 39.5000, longitude: -8.00000000 }, "Portugal");
var country2 = addCity({ latitude: 54.00000000, longitude: -2.00000000 }, "United Kingdom");

lineDataItem = lineSeries.pushDataItem({
    pointsToConnect: [country1, country2]
});

var planeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

var plane = am5.Graphics.new(root, {
    svgPath:
        "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
    scale: 0.06,
    centerY: am5.p50,
    centerX: am5.p50,
    fill: am5.color(0x000000)
});

planeSeries.bullets.push(function () {
    var container = am5.Container.new(root, {});
    container.children.push(plane);
    return am5.Bullet.new(root, { sprite: container });
});

var planeDataItem = planeSeries.pushDataItem({
    lineDataItem: lineDataItem,
    positionOnLine: 0,
    autoRotate: true
});

planeDataItem.animate({
    key: "positionOnLine",
    to: 1,
    duration: 10000,
    loops: Infinity,
    easing: am5.ease.yoyo(am5.ease.linear)
});

planeDataItem.on("positionOnLine", function (value) {
    if (value >= 0.99) {
        plane.set("rotation", 180);
    } else if (value <= 0.01) {
        plane.set("rotation", 0);
    }
});

function addCity(coords, title) {
    return pointSeries.pushDataItem({
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: title
    });
}

function updateMapData() {
    //Reset Line Series
    lineSeries.dispose();
    lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get("alternativeBackground"),
        strokeOpacity: 0.3
    });

    pointSeries.dispose();
    pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push(function () {
        var circle = am5.Circle.new(root, {
            radius: 7,
            tooltipText: "{name}",
            cursorOverStyle: "pointer",
            tooltipY: 0,
            //fill: am5.color(0xffba00),
            fill: am5.color("#ff7575"),
            stroke: root.interfaceColors.get("background"),
            strokeWidth: 2,
            draggable: false
        });

        return am5.Bullet.new(root, {
            sprite: circle
        });
    });

    //Define the selected countries
    country1 = addCity({ latitude: 40.5000, longitude: -10.00000000 }, "Portugal2");
    country2 = addCity({ latitude: 57.00000000, longitude: -20.00000000 }, "United Kingdom2");

    var values = [];

    if (country1 != null)
        values.push(country1);

    if (country2 != null)
        values.push(country2);

    lineDataItem.dispose();
    lineDataItem = lineSeries.pushDataItem({
        pointsToConnect: values
    });

    planeSeries.dispose();
    plane.dispose();
    planeDataItem.dispose();

    if (values.length > 0) {
        
        planeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

        plane = am5.Graphics.new(root, {
            svgPath:
                "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
            scale: 0.06,
            centerY: am5.p50,
            centerX: am5.p50,
            fill: am5.color(0x000000)
        });

        planeSeries.bullets.push(function () {
            var container = am5.Container.new(root, {});
            container.children.push(plane);
            return am5.Bullet.new(root, { sprite: container });
        });

        planeDataItem = planeSeries.pushDataItem({
            lineDataItem: lineDataItem,
            positionOnLine: 0,
            autoRotate: true
        });

        planeDataItem.animate({
            key: "positionOnLine",
            to: 1,
            duration: 10000,
            loops: Infinity,
            easing: am5.ease.yoyo(am5.ease.linear)
        });

        planeDataItem.on("positionOnLine", function (value) {
            if (value >= 0.99) {
                plane.set("rotation", 180);
            } else if (value <= 0.01) {
                plane.set("rotation", 0);
            }
        });
    }
}

// Make stuff animate on load
chart.appear(1000, 100);

chart.animate({ key: "translateY", to: 470, duration: 100, easing: am5.ease.inOut(am5.ease.cubic) });