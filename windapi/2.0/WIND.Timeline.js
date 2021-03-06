WIND.Timeline = function (iddiv, options) {
    this.type = "timeline";
    this.top = 10;
    this.left = 10;
    this.width = 600;
    this.height = 400;
    this.color = "#3366CC";
    this.border = "#3366CC 2px solid";
    this.name = "Timeline Displayer";
    this.icon = "http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/images/tivizicon.png";

    // Admin action configuration for the designer
    this.draggable = false;
    this.resizable = false;
    this.header = false;
    this.removable = false;
    this.configurable = false;

    if (options.draggable == true) this.draggable = options.draggable;
    if (options.resizable == true) this.resizable = options.resizable;
    if (options.header == true) this.header = options.header;
    if (options.removable == true) this.removable = options.removable;
    if (options.configurable == true) this.configurable = options.configurable;
    if (this.draggable == true || this.removable == true || this.configurable == true) this.header = true;

    var outerDiv = document.createElement("div");
    outerDiv.id = iddiv + "Outer";
    outerDiv.style.position = "absolute";

    if (options.top) this.top = options.top;
    outerDiv.style.top = this.top + "px";

    if (options.left) this.left = options.left;
    outerDiv.style.left = this.left + "px";

    if (options.width) this.width = options.width;
    outerDiv.style.width = this.width + "px";

    if (options.height) this.height = options.height;
    outerDiv.style.height = this.height + "px";

    if (options.color) this.color = options.color;
    if (options.border) this.border = options.border;
    outerDiv.style.border = this.border;

    if (options.parentEl) this.parentEl = options.parentEl;
    if (options.name) this.name = options.name;
    if (options.icon) this.icon = options.icon;

    var tlDiv;
    if (document.getElementById(iddiv))
        tlDiv = document.getElementById(iddiv);
    else {
        tlDiv = document.createElement("div");
        tlDiv.id = iddiv;
    }

    tlDiv.style.position = "absolute";
    if (this.header) {
        tlDiv.style.top = "20px";
        tlDiv.style.height = (Number(this.height) - 22) + "px";
        //tlDiv.style.height = "95%";
    } else {
        tlDiv.style.top = "0px";
        tlDiv.style.height = "100%";
    }
    tlDiv.style.width = "99%";
    outerDiv.appendChild(tlDiv);

    if (options.parentEl) {
        this.parentEl = options.parentEl;
        document.getElementById(options.parentEl).appendChild(outerDiv);
    } else document.body.appendChild(outerDiv);

    if (this.header) {
        var headerDiv = document.createElement("div");
        headerDiv.id = iddiv + "Handle";
        headerDiv.style.position = "absolute";
        headerDiv.style.width = "100%";
        headerDiv.style.height = "20px";
        headerDiv.style.backgroundColor = this.color;
        if (this.draggable) headerDiv.style.cursor = "move";
        headerDiv.style.zIndex = 2;

        var iconSpan = document.createElement("img");
        iconSpan.src = this.icon;
        iconSpan.alt = "[ ]";
        iconSpan.title = "TimelineDisplayer";
        iconSpan.style.cssFloat = "left";
        headerDiv.appendChild(iconSpan);

        var nameNode = document.createElement("span");
        nameNode.style.color = "#FFFFFF";
        nameNode.style.paddingLeft = "3px";
        nameNode.appendChild(document.createTextNode(this.name));
        headerDiv.appendChild(nameNode);

        var configDiv = document.createElement("div");
        configDiv.id = iddiv + "Configuration";
        configDiv.style.position = "absolute";
        configDiv.style.width = "100%";
        //configDiv.style.height = "100px";
        configDiv.style.marginTop = "20px";
        configDiv.style.backgroundColor = "#E4E4E4";
        configDiv.style.zIndex = 10;
        configDiv.style.display = "none";
        outerDiv.appendChild(configDiv);

        var that = this;

        // Name of displayer
        var label1 = document.createElement("span");
        label1.appendChild(document.createTextNode("Name: "));
        configDiv.appendChild(label1);
        //configDiv.appendChild(document.createElement("br"));
        var input1 = document.createElement("input");
        input1.type = "text";
        input1.id = iddiv + "Configuration_Name";
        input1.name = iddiv + "Configuration_Name";
        input1.size = "30";
        input1.value = this.name;
        configDiv.appendChild(input1);
        input1.onblur = function () {
            var nomafficheur = document.getElementById(iddiv + "Configuration_Name").value;
            if ((nomafficheur != null) && (nomafficheur != '')) {
                that.name = nomafficheur;
                nameNode.removeChild(nameNode.firstChild);
                nameNode.appendChild(document.createTextNode(that.name));
            }
            that.eventConfigured.fire(that);
        };

        configDiv.appendChild(document.createElement("br"));
        // Color of displayer
        var label2 = document.createElement("span");
        label2.appendChild(document.createTextNode("Color: "));
        configDiv.appendChild(label2);
        var input2 = document.createElement("select");
        input2.id = iddiv + "Configuration_Color";
        input2.name = iddiv + "Configuration_Color";
        configDiv.appendChild(input2);
        input2.style.background = this.color;
        //var colorTab = ["#FF0000", "#B20000", "#FEBFBF", "#FE8080", "#FF3300", "#B22400", "#FECCBF", "#FE9980", "#FF6600", "#B24700", "#FED9BF", "#FEB380", "#FF8000", "#B25900", "#FEDFBF", "#FEBF80"];
        var colorTab = ["#00248E", "#0033CC", "#809FFE", "#BFCFFE", "#12127D", "#1919B3", "#9191FE", "#C8C8FE", "#24006B", "#330099", "#AA80FE", "#D4BFFE", "#2D006B", "#400099", "#B580FE", "#DABFFE", "#47006B", "#660099", "#D580FE", "#EABFFE", "#6B006B", "#990099", "#FF80FE", "#FFBFFE", "#8E006B", "#CC0099", "#FE80DF", "#FEBFEF", "#A10048", "#E60066", "#FE80B9", "#FEBFDC", "#B20000", "#FF0000", "#FE8080", "#FEBFBF", "#B22400", "#FF3300", "#FE9980", "#FECCBF", "#B24700", "#FF6600", "#FEB380", "#FED9BF", "#B25900", "#FF8000", "#FEBF80", "#FEDFBF", "#B26B00", "#FF9900", "#FECC80", "#FEE6BF", "#B27D00", "#FFB200", "#FED980", "#FEECBF", "#B28F00", "#FFCC00", "#FEE680", "#FEF2BF", "#B2A100", "#FFE500", "#FEF280", "#FEF9BF", "#B2B300", "#FFFF00", "#FEFF80", "#FEFFBF", "#8FB200", "#CCFF00", "#E6FE80", "#F2FEBF", "#6BB200", "#99FF00", "#CCFE80", "#E6FEBF", "#24B200", "#33FF00", "#99FE80", "#CCFEBF", "#008E00", "#00CC00", "#80FE80", "#BFFEBF", "#007D47", "#00B366", "#80FEC8", "#BFFEE3", "#006B6B", "#009999", "#80FFFE", "#BFFFFE", "#00477D", "#0066B3", "#80C8FE", "#BFE3FE"];
        for (var i = 0; i < colorTab.length; i++) {
            var opt = new Option(colorTab[i], colorTab[i]);
            opt.style.background = colorTab[i];
            opt.style.position = "absolute";
            opt.style.width = "100px";
            opt.style.height = "30px";
            if (colorTab[i] == this.color) opt.selected = true;
            input2.add(opt);
        }
        input2.onchange = function () {
            input2.style.background = this.options[this.selectedIndex].value;
            that.color = this.options[this.selectedIndex].value;
            that.border = this.options[this.selectedIndex].value + " 2px solid";
            document.getElementById(iddiv + "Handle").style.backgroundColor = that.color;
            document.getElementById(iddiv + "Outer").style.border = that.border;
        };

        configDiv.appendChild(document.createElement("br"));

        this.eventConfigured = new YAHOO.util.CustomEvent("eventConfigured");

        this.eventConfigured.subscribe(this.onConfigure, this, true);


        // Layers
        var label7 = document.createElement("span");
        label7.appendChild(document.createTextNode("Level: "));
        configDiv.appendChild(label7);
        for (var i = 2; i < 8; i++) {
            var levelChoice = document.createElement("input");
            levelChoice.type = "radio";
            levelChoice.id = iddiv + "Configuration_Level" + i;
            levelChoice.name = iddiv + "Configuration_Level";
            configDiv.appendChild(levelChoice);
            var levelChoiceLabel = document.createElement("label");
            levelChoiceLabel.appendChild(document.createTextNode(WIND.Timeline.Interval[i] + " "));
            configDiv.appendChild(levelChoiceLabel);
            that = this;
            levelChoice.onclick = function (e) {
                that.tl.getBand(0).zoom(true);
                that.tl.getBand(1).zoom(true);
                that.tl.layout();
            };
        }

        configDiv.appendChild(document.createElement("br"));
        configDiv.appendChild(document.createElement("br"));

        var button2 = document.createElement("input");
        button2.type = "button";
        button2.id = iddiv + "Configuration_Cancel";
        button2.name = iddiv + "Configuration_Cancel";
        button2.value = "Close";
        configDiv.appendChild(button2);
        button2.onclick = function () {
            configDiv.style.display = "none";
        };

        if (this.removable) {
            this.eventRemoved = new YAHOO.util.CustomEvent("eventRemoved");

            var removeSpan = document.createElement("img");
            removeSpan.src = "images/close.png";
            removeSpan.alt = "X";
            removeSpan.title = "Delete";
            removeSpan.style.backgroundColor = "#EFEFEF";
            removeSpan.style.cssFloat = "right";
            removeSpan.style.cursor = "pointer";
            headerDiv.appendChild(removeSpan);
            //var that = this;
            removeSpan.onclick = function () {
                if (confirm("Do you really want to delete it?")) {
                    that.destroy();
                    that.eventRemoved.fire(that);
                }
            };
            this.eventRemoved.subscribe(this.onRemove, this, true);
        }

        if (this.configurable) {
            var configureSpan = document.createElement("img");
            configureSpan.src = "http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/images/gear.png";
            configureSpan.alt = "*";
            configureSpan.title = "Preferences";
            //configureSpan.style.backgroundColor = "#EFEFEF";
            configureSpan.style.cssFloat = "right";
            configureSpan.style.marginRight = "10px";
            configureSpan.style.cursor = "pointer";
            headerDiv.appendChild(configureSpan);
            configureSpan.onclick = function () {
                configDiv.style.display = "block";
            };
        }

        outerDiv.appendChild(headerDiv);

        if (this.draggable) {
            var dd = new YAHOO.util.DD(iddiv + "Outer");
            dd.setHandleElId(iddiv + "Handle");
            this.eventDragged = new YAHOO.util.CustomEvent("eventDragged");
            dd.on('endDragEvent', function (ev) {
                this.eventDragged.fire(this);
            }, this, true);

            this.eventDragged.subscribe(this.onDrag, this, true);

            if (options.parentEl) {
                var region = document.getElementById(options.parentEl);
                //Set left to x minus left 
                var left = outerDiv.offsetLeft - region.offsetLeft;
                //Set right to right minus x minus width 
                var right = region.offsetLeft + region.offsetWidth - outerDiv.offsetLeft - outerDiv.offsetWidth;
                //Set top to y minus top 
                var top = outerDiv.offsetTop - region.offsetTop;
                //Set bottom to bottom minus y minus height 
                var bottom = region.offsetTop + region.offsetHeight - outerDiv.offsetTop - outerDiv.offsetHeight;
                //Set the constraints based on the above calculations 
                dd.setXConstraint(left, right);
                dd.setYConstraint(top);
            } else {
                var left = outerDiv.offsetLeft;
                var top = outerDiv.offsetTop;
                dd.setXConstraint(left);
                dd.setYConstraint(top);
            }
        }
    }
    if (this.resizable) {
        var newdiv = document.createElement("div");
        newdiv.id = "yui-gen0";
        newdiv.className = "yui-resize-handle yui-resize-handle-r";
        var newindiv = document.createElement("div");
        newindiv.className = "yui-resize-handle-inner-r";
        newdiv.appendChild(newindiv);
        outerDiv.appendChild(newdiv);

        /*var newdiv = document.createElement("div");
		newdiv.id = "yui-gen1";
		newdiv.className = "yui-resize-handle yui-resize-handle-b";
		var newindiv = document.createElement("div");
		newindiv.className = "yui-resize-handle-inner-b";
		newdiv.appendChild(newindiv);
		outerDiv.appendChild(newdiv);
		
		var newdiv = document.createElement("div");
		newdiv.id = "yui-gen2";
		newdiv.className = "yui-resize-handle yui-resize-handle-br";
		var newindiv = document.createElement("div");
		newindiv.className = "yui-resize-handle-inner-br";
		newdiv.appendChild(newindiv);
		outerDiv.appendChild(newdiv);
		*/
        var dd2 = new YAHOO.util.Resize(iddiv + "Outer", {
            handles: ['r'],
            'minWidth': 10,
            'minHeight': 10,
            'maxWidth': 1200,
            'maxHeight': 800
        });
        this.eventResized = new YAHOO.util.CustomEvent("eventResized");
        dd2.on('endResize', function (ev) {
            this.eventResized.fire(this);
        }, this, true);
        this.eventResized.subscribe(this.onResize, this, true);
    }

    this.container = iddiv;
    this.interactionList = [];
    this.parts = [];
    this.annotations = [];
    this.parentDocument = null;
    this.level = Timeline.DateTime.YEAR;

    // Create Timeline -- projet Licence
    //var tl_el = document.getElementById(iddiv);
    this.eventSource = new Timeline.DefaultEventSource();
    var theme = Timeline.ClassicTheme.create();
    theme.event.tape.height = 7;
    theme.event.track.offset = 15;
    theme.event.track.height = 30;

    var bandInfos = [
        Timeline.createBandInfo({
            width: "80%",
            intervalUnit: this.level,
            intervalPixels: 100,
            zoomIndex: 1,
            zoomSteps: new Array({
                pixelsPerInterval: 100,
                unit: Timeline.DateTime.DAY
            }, {
                pixelsPerInterval: 100,
                unit: Timeline.DateTime.MONTH
            }, {
                pixelsPerInterval: 100,
                unit: Timeline.DateTime.YEAR
            }, {
                pixelsPerInterval: 100,
                unit: Timeline.DateTime.DECADE
            }),
            eventSource: this.eventSource,
            theme: theme,
            layout: "original"
        }),
        Timeline.createBandInfo({
            width: "20%",
            intervalUnit: this.level + 1,
            intervalPixels: 80,
            zoomIndex: 1,
            zoomSteps: new Array({
                pixelsPerInterval: 80,
                unit: Timeline.DateTime.YAER
            }, {
                pixelsPerInterval: 80,
                unit: Timeline.DateTime.DECADE
            }, {
                pixelsPerInterval: 80,
                unit: Timeline.DateTime.CENTURY
            }),
            eventSource: this.eventSource,
            theme: theme,
            layout: "overview"
        })
    ];

    //Timeline.DateTime.MILLISECOND = 0; Timeline.DateTime.SECOND = 1; Timeline.DateTime.MINUTE = 2; Timeline.DateTime.HOUR = 3; Timeline.DateTime.DAY = 4; Timeline.DateTime.WEEK = 5; Timeline.DateTime.MONTH = 6; Timeline.DateTime.YEAR = 7; Timeline.DateTime.DECADE = 8; Timeline.DateTime.CENTURY = 9; Timeline.DateTime.MILLENNIUM = 10; 
    bandInfos[1].highlight = true;
    //bandInfos[2].highlight = true;

    //bandInfos[2].syncWith = 0;
    bandInfos[1].syncWith = 0;

    this.tl = Timeline.create(tlDiv, bandInfos, Timeline.HORIZONTAL);
    //this.tl.loadJSON("data.json", function(json, url) { eventSource.loadJSON(json, url); });
    //tl.layout();

};
WIND.Timeline.Interval = ["Second", "Minute", "Hour", "Day", "Week", "Month", "Year", "Century", "Millennium", "10Millennia", "100 Millennia", "Million", "10Millions", "100Millions", "Billion", "10Billions"];
WIND.Timeline.prototype.destroy = function () {
    var tlDiv = document.getElementById(this.container + "Outer");
    if (this.parentEl) {
        var newtab = [];
        for (var i = 0; i < this.parentDocument.viewers.length; i++) {
            if (this.parentDocument.viewers[i].container != this.container) {
                newtab.push(this.parentDocument.viewers[i]);
            }
        }
        this.parentDocument.viewers = newtab;
        document.getElementById(this.parentEl).removeChild(tlDiv);
    } else document.body.removeChild(tlDiv);
};

WIND.Timeline.prototype.onDrag = function () {
    this.top = document.getElementById(this.container + "Outer").offsetTop;
    this.left = document.getElementById(this.container + "Outer").offsetLeft;
};

WIND.Timeline.prototype.onResize = function () {
    this.width = document.getElementById(this.container + "Outer").offsetWidth;
    this.height = document.getElementById(this.container + "Outer").offsetHeight;
};

WIND.Timeline.prototype.onConfigure = function () {}; // to override
WIND.Timeline.prototype.onRemove = function () {}; // to override

/* 20/02/2010 */
WIND.Timeline.prototype.addAnnotation = function (annotation) {
    var valid = false;
    for (var i = 0; i < annotation.annotedObjects.length; i++) {
        if (annotation.annotedObjects.type == "timeline") {
            valid = true;
            break;
        }
    }
    this.annotations.push(annotation);
};
WIND.Timeline.prototype.createAnnotation = function (sem, entity, tempoStart, tempoEnd, options) {
    var tlpart = this.createSensiblePart(entity, tempoStart, tempoEnd, options);
    var annotation = new WIND.Annotation(sem, entity, new Array(tlpart));
    this.annotations.push(annotation);
    return annotation;
};
WIND.Timeline.prototype.createSensiblePart = function (entity, tempoStart, tempoEnd, options) {
    var tlp = new WIND.Timeline.Part(entity, tempoStart, tempoEnd);
    tlp.viewer = this;
    this.parts.push(tlp);
    this.eventSource.add(tlp.tlEvent);
    this.tl.layout();
    return tlp;
};
WIND.Timeline.prototype.getValue = function () {
    return {
        id: this.container,
        ref: this.ref,
        rdftype: "http://erozate.iutbayonne.univ-pau.fr/wind#TimelineComponent",
        name: this.name,
        position: {
            top: this.top,
            left: this.left
        },
        size: {
            width: this.width,
            height: this.height
        },
        style: {
            color: this.color,
            border: this.border,
            icon: this.icon
        },
        annotation: this.annotation,
        display: this.display,
        load: this.load,
        parameter: {
            draggable: (this.draggable) ? "yes" : "no",
            resizable: (this.resizable) ? "yes" : "no",
            removable: (this.removable) ? "yes" : "no",
            configurable: (this.configurable) ? "yes" : "no",
            header: (this.header) ? "yes" : "no",
            toolbar: "no"
        }
    }
};

WIND.Timeline.prototype.loadRDFFile = function (php, url) {
    var xhr = createXHR();
    xhr.open("GET", php + "?rdf=" + url, false);
    xhr.send(null);
    if (xhr.status == 200) {
        var resultat = YAHOO.lang.JSON.parse(xhr.responseText);
        var res = resultat.annotations;
        //var jsondata = {"dateTimeFormat":"iso8601","events":[]};
        var parseDateTimeFunction = this.eventSource._events.getUnit().getParser("iso8601");
        for (var i = 0; i < res.length; i++) {
            var evt = new Timeline.DefaultEventSource.Event({
                'id': "Event " + res[i].entityName,
                'start': parseDateTimeFunction(res[i].temporalInfo[0].tempoStart),
                'end': parseDateTimeFunction(res[i].temporalInfo[0].tempoEnd),
                //'latestStart': parseDateTimeFunction(res[i].temporalInfo[0].tempoStart), 
                //'earliestEnd': parseDateTimeFunction(res[i].temporalInfo[0].tempoEnd), 
                'instant': (res[i].temporalInfo[0].tempoStart == res[i].temporalInfo[0].tempoEnd) ? true : false,
                'text': res[i].entityName,
                'description': "Description for Event " + res[i].entityName,
                'icon': "http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/images/timeicon64.png"
            });
            this.eventSource.add(evt);
        }
        this.tl.layout();
    } else {
        document.getElementById(this.container).innerHTML = "Error: " + url + " " + xhr.status + " " + xhr.statusText;
    }
};

// Timeline.Part class
WIND.Timeline.Part = function (eventName, tempoStart, tempoEnd) {
    this.eventName = eventName;
    this.starting = tempoStart;
    this.ending = tempoEnd;
    this.type = (tempoStart == tempoEnd) ? "Instant" : "Interval";
    var toto = new Timeline.DefaultEventSource();
    var parseDateTimeFunction = toto._events.getUnit().getParser("iso8601");
    this.tlEvent = new Timeline.DefaultEventSource.Event({
        'id': "Event " + eventName,
        'start': parseDateTimeFunction(tempoStart),
        'end': parseDateTimeFunction(tempoEnd),
        //'latestStart': parseDateTimeFunction(tempoStart), 
        //'earliestEnd': parseDateTimeFunction(tempoEnd), 
        'instant': (tempoStart == tempoEnd) ? true : false,
        'text': eventName,
        'description': "Description for Event " + eventName
    });
};