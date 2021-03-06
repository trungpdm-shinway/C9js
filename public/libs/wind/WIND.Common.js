/*
 * Web INteraction Design (WIND)
 * Interaction Design API v3.0
 *
 * Copyright (c) 2016 windapi
 * nhan@hcmut.edu.vn
 *
 * $Date: 2016/04/08 $
 */
// Namespace to protect this library from conflicting with external
/**
 Namespace grouping objects of the WIND API.
 @namespace WIND
 @author Luong The Nhan <luongthenhan@gmail.com>
 **/
if (typeof WIND === "undefined" || !WIND) {
    var WIND = WIND || {};
}
var wind_map = false;
var wind_timeline = false;
var wind_text = false;
var lib_path = "http://erozate.iutbayonne.univ-pau.fr/windapi/lib/";

/**
 * Util to query ID,class - addListener
 * without using blablabla
 */
function $create(tagName) {
    var closeTag = ["div", "p", "span", "select", "option"];
    var isClosed = false;

    closeTag.forEach(function (tag) {
        if (tagName === tag) {
            isClosed = true;
        }
    });

    if (isClosed)
        return $("<" + tagName + "></" + tagName + ">");
    else
        return $("<" + tagName + ">");
}
;

function $attrs(id, listAttr) {
    $.each(listAttr, function (k, v) {
        id.attr(k, v);
    });
    return id;
}
;

function $tag(tagName) {
    return $(tagName);
}
;

function $id(id) {
    return $('#' + id);
}
;

function $class(className) {
    return $('.' + className);
}
;

function $addListener(id, eventType, callBack) {
    $(id)[eventType](function () {
        callBack(event);
    });
}
;

/** 
 * Create an Interaction object.
 * @class Create an Interaction object.
 * @constructor
 * @param {UserEvent} evt - The event that will trigger reactions. It can be either a SelectEvent or a InputEvent object.
 * @param {Reaction[]} reacts - Array of the Reaction object that will be triggered by the event.
 * @property {UserEvent} event evenement
 * @property {Array.<Reaction>} reactions Reaction qui seront déclenchées lors de l'interaction
 * @example var i1 = new WIND.Interaction(e, new Array(react11,react12,react13,react14,react15,react16));
 */
WIND.Interaction = function (evt, reacts) {
    this.event = evt;
    if (reacts === null) {
        this.reactions = [];
    } else if (reacts instanceof Array) {
        this.reactions = reacts;
    } else {
        this.reactions = [reacts];
    }
};
/** 
 * Add a reaction object to the Interaction.
 * @function.
 * @param {WIND.SystemReaction[]} react - The reaction we want to add to the reaction. It can be either an InternalReaction or ExternalReaction object.
 * @example var i1 = new WIND.Interaction(e, new Array(react11,react12,react13,react14,react15,react16));
 var react17 = new WIND.ExternalReaction(annot, "zoom");
 i1.addReaction(react17);
 */
WIND.Interaction.prototype.addReaction = function (react) {
    if (react instanceof Array) {
        for (var i = 0; i < react.length; i++) {
            this.reactions.push(react[i]);
        }
    } else {
        this.reactions.push(react);
    }
};

/** 
 * Activate the interaction.
 * @function.
 * @example var i1 = new WIND.Interaction(e, new Array(react11,react12,react13,react14,react15,react16));
 i1.activate();
 */
WIND.Interaction.prototype.activate = function () {
    var tmp = this.reactions;
    for (var j = 0; j < tmp.length; j++) {
        //alert("reaction " + j);
        if (tmp[j] instanceof WIND.ExternalReaction) {
            var cible;
            if (tmp[j].annotationApplied === null) {
                var newtab = new Array();
                var temp2 = tmp[j];
                while (temp2.dependency !== null) {
                    newtab.push(temp2.dependency);
                    temp2 = temp2.dependency;
                }
                //alert("dependency = " + newtab.length);
                for (var i = newtab.length - 1; i > 0; i--) {
                    newtab[i - 1].source = newtab[i].raise();
                }
                cible = newtab[0].raise();
            } else
                cible = tmp[j].annotationApplied;
            if (cible instanceof WIND.Annotation) {
                for (var l = 0; l < cible.annotedObjects.length; l++) {
                    cible.annotedObjects[l].callFunction(tmp[j].effect_type, tmp[j].parameters);
                }
            }
        }
    }
};

/** 
 * Create an UserEvent object.
 * @class Create an UserEvent object.
 * @constructor
 * @param {String} type - The type of the user event. It can be either a SelectEvent or an InputEvent.
 * @example var react = new WIND.UserEvent("InputEvent");
 */
WIND.UserEvent = function (type) {
    this.type = type;
};

/** 
 * Create a SelectEvent object.
 * @class Create an SelectEvent object.
 * @constructor
 * @param {String} evt - Defines the user's action.
 * @param {WIND.Annotation} annot - The annotation where the event will be triggered.
 * @param {String} rep
 * @example var carte = new WIND.Map('map',{});
 var anot = carte.createAnnotation("Town",Bayonne","Polygon((1 1,2 2,3 3))");*
 var evt = new WIND.SelectEvent("click",anot);
 */
WIND.SelectEvent = function (evt, annot, rep) {
    this.event_type = evt;
    this.annotationSelected = annot;
    if (rep === null)
        this.target = "all";
    else
        this.target = rep;
};

WIND.SelectEvent.prototype = new WIND.UserEvent("SelectEvent");
/** 
 * Trigger a javascript function when the UserEvent happens.
 * @function.
 * @param {Function} callback - The function that will be triggered.
 * @example var carte = new WIND.Map('map',{});
 var anot = carte.createAnnotation("Town",Bayonne","Polygon((1 1,2 2,3 3))");*
 var evt = new WIND.SelectEvent("click",anot);
 evt.trigger(function(e){});
 */
WIND.SelectEvent.prototype.trigger = function (callback) {
    if (this.annotationSelected instanceof Array) {
        var tmpAnnot = this.annotationSelected;
        var tmpAnnot2;
        for (var i = 0; i < tmpAnnot.length; i++)
        {
            tmpAnnot2 = this.annotationSelected[i];
            for (var ll = 0; ll < tmpAnnot2.annotedObjects.length; ll++) {
                if (wind_map)
                {
                    if (tmpAnnot2.annotedObjects[ll] instanceof WIND.Map.Part) {

                        $id(vector_layer_id).delegate("path[id='" + tmpAnnot2.annotedObjects[ll].object + "']",
                                this.event_type,
                                function (e) {
                                    callback(this);
                                });
                    }
                }
                if (wind_text) {
                    if (tmpAnnot2.annotedObjects[ll] instanceof WIND.Text.Part) {
                        tmpAnnot2.annotedObjects[ll].css({'text-decoration': 'underline', 'cursor': 'pointer'});
                        // tmpAnnot2.annotedObjects[ll].setStyle("text-decoration:underline;cursor:pointer");
                        $id(tmpAnnot2.annotedObjects[ll].object).bind(this.event_type, function (event) {
                            callback(this);
                        });
                    }
                }
                // if(wind_timeline){
                // 	if (tmpAnnot2.annotedObjects[ll] instanceof WIND.Timeline.Part) {
                // 		if(tmpAnnot2.annotedObjects[ll].viewer.base=="Simile")
                // 		{
                // 			var aux = $class("timeline-event-label");
                // 			for( var j=0; j<aux.length;j++)
                // 			{
                // 				if(aux[j].innerHTML==tmpAnnot2.entity)
                // 				{
                // 					var element = $id(aux[j].id);
                // 					var element1 = $id(aux[j].id.replace("label","tape0"));
                // 				}
                // 			}
                // 			var test = YAHOO.util.Event.addListener(element, this.event_type, function (e) {
                // 				callback(this);
                // 			}, this, true);
                // 			var test1 = YAHOO.util.Event.addListener(element1, this.event_type, function (e) {
                // 				callback(this);
                // 			}, this, true);
                // 		}
                // 		else if(tmpAnnot2.annotedObjects[ll].viewer.base=="Chap")
                // 		{
                // 			if(tmpAnnot2.annotedObjects[ll].starting!=tmpAnnot2.annotedObjects[ll].ending)
                // 				var aux = $class("timeline-event");
                // 			else
                // 				var aux = $class("timeline-event-dot-container");
                // 			for( var j=0; j<aux.length;j++)
                // 			{
                // 				aux[j].id = aux[j].firstChild.innerHTML;
                // 				if(aux[j].id==tmpAnnot2.entity)
                // 				{
                // 					var element = $id(aux[j].id);
                // 				}
                // 			}
                // 			var test = YAHOO.util.Event.addListener(element, this.event_type, function (e) {callback(this);}, this, true);
                // 		}
                // 	}
                // }
            }
        }
    } else {
        var tmpAnnot2 = this.annotationSelected;
        for (var ll = 0; ll < tmpAnnot2.annotedObjects.length; ll++) {
            if (wind_map)
            {
                if (tmpAnnot2.annotedObjects[ll] instanceof WIND.Map.Part) {

                    $id(vector_layer_id)
                            .delegate("path[id='" + tmpAnnot2.annotedObjects[ll].object + "']",
                                    this.event_type,
                                    function (e) {
                                        callback(this);
                                    });
                }
            }
            // else if(wind_timeline){
            // 	if (tmpAnnot2.annotedObjects[ll] instanceof WIND.Timeline.Part) {
            // 		if(tmpAnnot2.annotedObjects[ll].viewer.base=="Simile")
            // 		{
            // 			var aux = $class("timeline-event-label");
            // 			for( var i=0; i<aux.length;i++)
            // 			{
            // 				if(aux[i].innerHTML==tmpAnnot2.entity)
            // 				{
            // 					var element = $id(aux[i].id);
            // 					var element1 = $id(aux[i].id.replace("label","tape0"));
            // 				}
            // 			}
            // 			var test = YAHOO.util.Event.addListener(element, this.event_type, function (e) {
            // 				callback(this);
            // 			}, this, true);
            // 			var test1 = YAHOO.util.Event.addListener(element1, this.event_type, function (e) {
            // 				callback(this);
            // 			}, this, true);
            // 		}
            // 		else if(tmpAnnot2.annotedObjects[ll].viewer.base=="Chap")
            // 		{
            // 			if(tmpAnnot2.annotedObjects[ll].starting!=tmpAnnot2.annotedObjects[ll].ending)
            // 				var aux = $class("timeline-event");
            // 			else
            // 				var aux = $class("timeline-event-dot-container");
            // 			for( var i=0; i<aux.length;i++)
            // 			{
            // 				aux[i].id = aux[i].firstChild.innerHTML;
            // 				if(aux[i].id==tmpAnnot2.entity)
            // 				{
            // 					var element = $id(aux[i].id);
            // 				}
            // 			}
            // 			var test = YAHOO.util.Event.addListener(element, this.event_type, function (e) {callback(this);}, this, true);
            // 		}
            // 	}
            // }
            else if (wind_text)
            {
                if (tmpAnnot2.annotedObjects[ll] instanceof WIND.Text.Part) {
                    tmpAnnot2.annotedObjects[ll].css({'text-decoration': 'underline', 'cursor': 'pointer'});
                    // tmpAnnot2.annotedObjects[ll].setStyle("text-decoration:underline;cursor:pointer");
                    $id(tmpAnnot2.annotedObjects[ll].object).bind(this.event_type, function (event) {
                        callback(this);
                    });
                }
            }
        }
    }
};
/** 
 * Create an InputEvent object.
 * @class Create an InputEvent object.
 * @constructor
 * @param {String} evt - Describes the user's action defined by the obj tool..
 * @param {WIND.Tool} obj - A tool object where the event will be triggered.
 */
WIND.InputEvent = function (evt, obj) {
    this.event_type = evt;
    this.event_tool = obj;
    //this.parameters = obj;
    this.annotationCreated = null;
    this.target = "all";
};
WIND.InputEvent.prototype = new WIND.UserEvent("InputEvent");
/** 
 * Trigger a javascript function when the InputEvent happens.
 * @function.
 * @param {Function} callback - The function that will be triggered.
 */
WIND.InputEvent.prototype.trigger = function (callback) {
    this.event_tool.button.on("checkedChange", function (e1) {
        if (!e1.prevValue) {
            $id(this.event_tool.parentComponent.container).css("cursor", "url('" + lib_path + "images/crayon.png'), auto");
            $id(this.event_tool.parentComponent.paragraphs[0].object).bind('mouseup', function (event) {
                alert("click");
                //clic sur le bouton Ajouter : mettre dans Georeferenceurs choisis		
                var str = null;
                if (window.getSelection) {
                    str = window.getSelection();
                } else if (document.getSelection) {
                    str = document.getSelection();
                } else {
                    str = document.selection.createRange();
                }

                var rang = null;
                if (str.getRangeAt) {
                    rang = str.getRangeAt(0);
                    rang.setStart(str.anchorNode, 0);
                    rang.setEnd(str.focusNode, str.focusNode.nodeValue.length);
                } else { // Safari!
                    rang = document.createRange();
                    rang.setStart(str.anchorNode, str.anchorOffset);
                    rang.setEnd(str.focusNode, str.focusOffset);
                }

                var texteselectionne = rang.toString();
                //alert("..." + texteselectionne + "...");
                if (texteselectionne.endsWith(" "))
                    texteselectionne = texteselectionne.substring(0, texteselectionne.length - 1);
                //alert("..." + texteselectionne + "...");
                //alert(texteselectionne);
                var debut = -1;
                var fin = -1;

                var words = this.event_tool.parentComponent.paragraphs[0].words;
                for (var i = 0; i < words.length; i++) {
                    if (texteselectionne.startsWith(words[i])) {
                        var ok = true;
                        debut = i;
                        //alert(debut);
                        //if (debut >=0) {			
                        for (var j = debut; j < words.length; j++) {
                            if (texteselectionne.endsWith(words[j])) {
                                //alert("day roi: " + words[i]);
                                fin = j;
                                for (var k = debut; k <= fin; k++) {
                                    if (texteselectionne.indexOf(words[k]) === -1) {
                                        ok = false;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        //}
                        if (ok)
                            break;
                    }
                }

                //alert(debut + " ... " + fin);
                //alert(words[debut] + " ... " + words[fin]);
                //alert(this.event_tool.parentComponent.container);
                var tab = new Array();
                if (fin >= debut && debut >= 0) {
                    if (confirm('Do you want really to annotate "' + texteselectionne + '" in the text?')) {
                        for (var j = debut + 1; j <= fin + 1; j++) {
                            $id(this.event_tool.parentComponent.paragraphs[0].object + "_token" + j).css('color', '#008000');
                            tab.push(j);
                        }
                        str.removeAllRanges();
                        //var annot = {};
                        //annot.entity = texteselectionne;
                        //annot.annotedObjects = tab;

                        var annot = this.event_tool.parentComponent.createAnnotation("Place", texteselectionne, 1, debut + 1, fin + 1, null);
                        //if (($id("semanticInput").value) && ($id("semanticInput").value != ""))
                        //annot.semantics = $id("semanticInput").value;
                        //else
                        //	annot.semantics = "Place";
                        //valeurs.push(annot);
                        annot.contains = new Array();
                        var rep = new WIND.Representation("text", annot, this.event_tool.parentComponent);
                        this.annotationCreated = annot;
                        callback(this);
                    }
                }
            });
        } else {
            $id(this.event_tool.parentComponent.container).css("cursor", "auto");
            $id(this.event_tool.parentComponent.paragraphs[0].object).bind('mouseup', function (event) {
                // nothing to do here
            });
        }
    }, this, true);
};

WIND.Tool = function (type) {
    this.type = type;
};


// Reaction class
WIND.SystemReaction = function () {
};
WIND.SystemReaction.prototype.setDependency = function (reac) {
    this.dependency = reac;
};

WIND.InternalReaction = function (type) {
    this.type = type;
};
WIND.InternalReaction.prototype = new WIND.SystemReaction();

WIND.Projection = function (src, tgt) {
    this.source = src;
    this.target = tgt;
    this.result = null;
};
WIND.Projection.prototype = new WIND.InternalReaction("Projection");
WIND.Projection.prototype.raise = function () {
    var annot = false;
    if (this.target.type === "text") {
        // Tricher 
        if (this.source === null) {
            this.source = this.dependency.result;
        }
        var p;
        if (this.target.paragraphs.length === 0)
            p = this.target.createParagraph();
        else
            p = this.target.paragraphs[0];
        p.setContent(this.source.entity);
        annot = this.target.createAnnotation(this.source.semantics, this.source.entity, 1, 1, this.source.annotedObjects.length);
    } else if (this.target.type === "map") {
        annot = new WIND.Annotation(this.source.semantics, this.source.entity, null);
        var newtab = new Array();
        for (var i = 0; i < this.source.annotedObjects.length; i++) {
            if (this.source.annotedObjects[i] instanceof WIND.Map.Part) {
                newtab.push(this.source.annotedObjects[i]);
            }
        }
        annot.annotedObjects = newtab;

        this.target.annotations.push(annot);
        for (var i = 0; i < annot.annotedObjects.length; i++) {
            this.target.addSensiblePart(annot.annotedObjects[i], true);
            annot.annotedObjects[i].viewer = this.target;
        }
    }
    this.result = annot;
    return annot;
};

WIND.Calculation = function (src, func, tgt) {
    this.source = src;
    this.func = func;
    this.target = tgt;
    this.result = null;
};
WIND.Calculation.prototype = new WIND.InternalReaction("Calculation");
WIND.Calculation.prototype.raise = function () {
    var annot = false;
    var cibleViewer = this.target;

    if (this.func === "point_of_place") {
        $.ajax({
            url: lib_path + "php/geonames_get.php?place=" + this.source.entity,
            method: "GET",
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        }).done(function (results) {
            if (results.getElementsByTagName("geoname")) {
                var pref = results.getElementsByTagName("geoname")[0];
                annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Town", pref.getElementsByTagName("name")[0].childNodes[0].nodeValue, null);

                var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                mystyle.strokeColor = "#0033CC";
                mystyle.fillColor = "#809FFE";
                mystyle.fillOpacity = 0.3;

                var mappart = new WIND.Map.Part("POINT(" + pref.getElementsByTagName("lng")[0].childNodes[0].nodeValue + " " + pref.getElementsByTagName("lat")[0].childNodes[0].nodeValue + ")", null, mystyle);
                mappart.geoname = pref.getElementsByTagName("name")[0].childNodes[0].nodeValue;
                mappart.display = false;

                mappart.viewer = cibleViewer;
                mappart.vlayer = cibleViewer.vectorLayer;
                annot.addSensiblePart(mappart, true);
            }
        });
    } else if (this.func === "geolocation_of_town") {
        $.ajax({
            url: lib_path + "php/geolocation_of_town.php?place=" + this.source.entity,
            method: "GET",
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        }).done(function (results) {
            if (results.getElementsByTagName("geoname")) {
                var pref = results.getElementsByTagName("geoname")[0];
                annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Town", pref.getElementsByTagName("nom_com")[0].childNodes[0].nodeValue, null);

                var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                mystyle.strokeColor = "#0033CC";
                mystyle.fillColor = "#809FFE";
                mystyle.fillOpacity = 0.3;

                var mappart = new WIND.Map.Part(pref.getElementsByTagName("astext")[0].textContent, null, mystyle);
                mappart.geoname = pref.getElementsByTagName("nom_com")[0].childNodes[0].nodeValue;
                mappart.display = false;

                mappart.viewer = cibleViewer;
                mappart.vlayer = cibleViewer.vectorLayer;
                annot.addSensiblePart(mappart, true);

            }
        });
    } else if (this.func === "prefecture_of_town") {
        $.ajax({
            url: lib_path + "php/prefecture_of_town.php?place=" + this.source.entity,
            method: "GET",
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        }).done(function (results) {
            if (results.getElementsByTagName("geoname")) {
                var pref = results.getElementsByTagName("geoname")[0];
                annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Prefecture", pref.getElementsByTagName("nom_chf_l")[0].childNodes[0].nodeValue, null);

                var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                mystyle.strokeColor = "#0033CC";
                mystyle.fillColor = "#809FFE";
                mystyle.fillOpacity = 0.3;

                var mappart = new WIND.Map.Part(pref.getElementsByTagName("astext")[0].textContent, null, mystyle);
                mappart.geoname = pref.getElementsByTagName("nom_chf_l")[0].childNodes[0].nodeValue;
                mappart.display = false;

                mappart.viewer = cibleViewer;
                mappart.vlayer = cibleViewer.vectorLayer;
                annot.addSensiblePart(mappart, true);
            }
        });
    } else if (this.func === "prefecture_of_department") {
        $.ajax({
            url: lib_path + "php/prefecture_of_department.php?place=" + this.source.entity,
            method: "GET",
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        }).done(function (results) {
            if (results.getElementsByTagName("geoname")) {
                var pref = results.getElementsByTagName("geoname")[0];
                annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Prefecture", pref.getElementsByTagName("nom_chf_l")[0].childNodes[0].nodeValue, null);

                var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                mystyle.strokeColor = "#0033CC";
                mystyle.fillColor = "#809FFE";
                mystyle.fillOpacity = 0.3;

                var mappart = new WIND.Map.Part(pref.getElementsByTagName("astext")[0].textContent, null, mystyle);
                mappart.geoname = pref.getElementsByTagName("nom_chf_l")[0].childNodes[0].nodeValue;
                mappart.display = false;

                mappart.viewer = cibleViewer;
                mappart.vlayer = cibleViewer.vectorLayer;
                annot.addSensiblePart(mappart, true);
            }
        });
    } else if (this.func === "department_of_town") {
        $.ajax({
            url: lib_path + "php/department_of_town.php?place=" + this.source.entity,
            method: "GET",
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        }).done(function (results) {
            if (results.getElementsByTagName("geoname")) {
                var pref = results.getElementsByTagName("geoname")[0];
                annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Department", pref.getElementsByTagName("nom_dept")[0].childNodes[0].nodeValue, null);

                var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                mystyle.strokeColor = "#0033CC";
                mystyle.fillColor = "#809FFE";
                mystyle.fillOpacity = 0.3;

                var mappart = new WIND.Map.Part(pref.getElementsByTagName("astext")[0].textContent, null, mystyle);
                mappart.geoname = pref.getElementsByTagName("nom_dept")[0].childNodes[0].nodeValue;
                mappart.display = false;

                mappart.viewer = cibleViewer;
                mappart.vlayer = cibleViewer.vectorLayer;
                annot.addSensiblePart(mappart, true);
            }
        });
    }

    this.result = annot;
    return annot;
};
/** 
 * Create an ExternalReaction object.
 * @class Create an ExternalReaction object.
 * @constructor
 * @param {WIND.Annotation} annot - The annotation where the reaction will be occure.
 * @param {String} func - The function that will occure.
 * @param {JSON} [params]
 * @example var carte = new WIND.Map('map',{});
 var anot = carte.createAnnotation("Town",Bayonne","Polygon((1 1,2 2,3 3))");*
 var react = new WIND.ExternalReaction(anot,"zoom");
 */
WIND.ExternalReaction = function (annot, func, params) {
    this.annotationApplied = annot;
    this.effect_type = func;
    if (params instanceof Array)
        this.parameters = params;
    else
        this.parameters = [params];
};
WIND.ExternalReaction.prototype = new WIND.SystemReaction();

// Representation class
WIND.Representation = function (type, annot, component) {
    if (type === component.type) {
        this.type = type;
        this.annotation = annot;
        this.parentComponent = component;
        annot.contains.push(this);
    }
};

WIND.GUI = function (iddiv, options) {
    this.container = iddiv;
    this.viewers = [];
    this.nbViewers = 0;

    this.author = null;
    this.title = null;
    this.description = null;
    if (options) {
        if (options.author)
            this.author = options.author;
        if (options.title)
            this.title = options.title;
        if (options.description)
            this.description = options.description;
    }
    this.reactions = [];
    this.interactions = [];

    var docDiv;
    if ($id(iddiv))
        docDiv = $id(iddiv);
    else {
        docDiv = $create("div");
        docDiv.attr('id', iddiv);
    }
    if (this.title) {
        var div = $create("div")
                .attr('id', this.container + "-applicationTitle")
                .css({
                    position: 'absolute',
                    left: '10px',
                    top: '3px'
                });
        var p = $create("p")
                .css({
                    color: '#3366CC',
                    fontWeight: 'bold',
                    fontSize: '20px'
                })
                .val(this.title);
        div.append(p);

        var p = $create("p")
                .css('fontSize', '15px')
                .val(this.description);
        div.append(p);
        docDiv.append(div);

        var div = $create("div")
                .attr('id', this.container + "-applicationFooter")
                .css({
                    position: 'absolute',
                    left: '10px',
                    bottom: '3px'
                });
        var p = $create("p")
                .css({
                    fontSize: '9px',
                    fontStyle: 'italic'
                });
        if (this.author === null)
            p.val('This application is designed using WINDAPI.');
        else
            p.val('This application is designed by ' + this.author); /*+ " using WINDMash."*/
        ;
        div.append(p);
        docDiv.append(div);
    }
};
WIND.GUI.prototype.createInteraction = function (part, str, reacts) {
    var i = new WIND.Interaction(part, str, reacts);
    i.id = this.container + "_interaction" + (this.interactions.length + 1);
    this.interactions.push(i);
    return i;
};

WIND.GUI.prototype.createReaction = function (part, func, params) {
    var r = new WIND.Reaction(part, func, params);
    if (r instanceof Array) {
        for (var i = 0; i < r.length; i++) {
            r[i].id = this.container + "_reaction" + (this.reactions.length + 1);
            this.reactions.push(r[i]);
        }
    } else {
        r.id = this.container + "_reaction" + (this.reactions.length + 1);
        this.reactions.push(r);
    }
    return r;
};


// SensiblePart class
WIND.SensiblePart = function (type) {
    this.type = type;
    this.viewer = null;
};
WIND.SensiblePart.prototype.callFunction = function (func, params) {
    switch (this.type) {
        case "text":
        case "list":
            switch (func) {
                case "highlight":
                    this.highlight();
                    break;
                case "bold":
                    this.bold();
                    break;
                case "italicize":
                    this.italicize();
                    break;
                case "underline":
                    this.underline();
                    break;
                case "blink":
                    this.blink();
                    break;
                case "setStyleByClass":
                    //var name = func.substring(16, func.length);
                    var param = params[0];
                    this.setStyleByClass(param);
                    break;
                case "setStyle":
                    var param = params[0];
                    this.setStyle(param);
                    break;
                case "show":
                    this.show();
                    break;
                case "hide":
                    this.hide();
                    break;
                case "setDraggable":
                    var param = params[0];
                    var param1 = params[1];
                    this.setDraggable(param, param1);
                    break;
            }
            break;
        case "map":
            switch (func) {
                case "zoom":
                    this.zoomTo();
                    break;
                case "zoomWith":
                    this.zoomWith(params[0]);
                    break;
                case "highlight":
                    if (this.viewer.type === "map") {
                        this.highlight();
                    }
                    break;
                case "focus":
                    this.highlight();
                    this.zoomTo();
                    break;
                case "setFeatureStyle":
                    //var decor = func.substring(15, func.length);
                    var decor = params[0];
                    this.setFeatureStyle(decor);
                    break;
                case "show":
                    this.show();
                    break;
                case "hide":
                    this.hide();
                    break;
            }
            break;
        case "timeline":
            switch (func) {
                case "zoom":
                    this.zoomTo();
                    break;
                case "focus":
                    this.highlight();
                    this.zoomTo();
                    break;
                case "highlight":
                    this.highlight();
                    break;
            }
            break;
            // Les fonctions de WIND.Calendar.Part
        case "calendar":
            if (func === "highlight")
                this.highlight();
            break;
            // Les fonctions de WIND.Photo.Part
        case "photo":
            switch (func) {
                case "color":
                    this.color(params[0], params[1]);
                    break;
                case "focus":
                    this.focus();
                    break;
                case "show":
                    this.show();
                    break;
                case "hide":
                    this.hide();
                    break;
                case "move":
                    this.move(params[0], params[1]);
                    break;
                case "showRestPhoto":
                    this.showRestPhoto();
                    break;
                case "hideRestPhoto":
                    this.hideRestPhoto(params[0]);
                    break;
            }
            break;
            // Les fonctions de WIND.Photo
        case "photoviewer":
            if (func === "switchTo")
                this.switchTo(params[0]);
            break;
            // Les fonctions de WIND.Popup
        case "popup":
            switch (func) {
                case "show":
                    this.show();
                    break;
                case "hide":
                    this.hide();
                    break;
            }
    }
};

WIND.GUI.prototype.createViewer = function (type, options) {
    // fix bug add a displayer after remove a displayer
    this.nbViewers++;
    var vizId = this.container + "_viewer" + this.nbViewers;
    options.parentEl = this.container;
    if (type === "text") {
        var t = new WIND.Text(vizId, options);
        t.parentDocument = this;
        this.viewers.push(t);
        return t;
    } else if (type === "map") {
        var m = new WIND.Map(vizId, options);
        m.parentDocument = this;
        this.viewers.push(m);
        return m;
    } else if (type === "calendar") {
        var c = new WIND.Calendar(vizId, options);
        c.parentDocument = this;
        this.viewers.push(c);
        return c;
    } else if (type === "timeline") {
        var ti = new WIND.Timeline(vizId, options);
        ti.parentDocument = this;
        this.viewers.push(ti);
        return ti;
    } else if (type === "list") {
        var l = new WIND.List(vizId, options);
        l.parentDocument = this;
        this.viewers.push(l);
        return l;
    } else if (type === "photo") {
        var p = new WIND.Photo(vizId, options);
        p.parentDocument = this;
        this.viewers.push(p);
        return p;
    } else if (type === "video") {
        var v = new WIND.Video(vizId, options);
        v.parentDocument = this;
        this.viewers.push(v);
        return v;
    }
    return null;
};
WIND.GUI.prototype.getValue = function () {
    var viewerModules = [];
    for (var i = 0; i < this.viewers.length; i++) {
        viewerModules.push(this.viewers[i].getValue());
    }
    return {
        id: this.container,
        rdftype: "http://erozate.iutbayonne.univ-pau.fr/wind#GUI",
        author: this.author,
        title: this.title,
        description: (this.description) ? (this.description) : "",
        contain: viewerModules
    };
};

WIND.LiveSensiblePart = function (afficheur, func) {
    this.viewer = afficheur;
    this.func = func;
};
/** 
 * Create an Annotation object.
 * @class Create an Annotation object.
 * @constructor
 * @param {String} type - The type of the annotation.
 * @param {String} entity - The name of the annotated entity.
 * @param {SensiblePart[]} sp - An array of the sensible parts of the map.
 * @example var annotation = new WIND.Annotation("ville", "Mauléon-Licharre", new Array(mp));
 */
WIND.Annotation = function (type, entity, sp) {
    this.semantics = type;
    this.entity = entity;
    if (sp === null) {
        this.annotedObjects = new Array();
    } else {
        if (sp instanceof Array) {
            this.annotedObjects = sp;
            for (var i = 0; i < sp.length; i++) {
                sp[i].annotation = this;
            }
        } else {
            this.annotedObjects = [sp];
            sp.annotation = this;
        }
    }
    this.contains = new Array();
};
WIND.Annotation.prototype.addSensiblePart = function (sp) {
    this.annotedObjects.push(sp);
    sp.annotation = this;
};

WIND.Selection = function (tab) {
    this.set = tab;
    this.result = null;
};
WIND.Selection.prototype.raise = function () {
    return this.result;
};

// Popup class
WIND.Popup = function (x, y, div) {
    this.x = x;
    this.y = y;
    this.container = div;
    var $closeDiv = $create("div");
    $closeDiv.css("textAlign", "right");
    $closeDiv.html("<img src='close.gif' onclick='$id(\"" + div + "\").style.visibility = \"hidden\";'>");
    $id(this.container).appendChild($closeDiv);
    this.content = '';
    this.hide();
};
WIND.Popup.prototype = new WIND.SensiblePart("popup", this.container);
WIND.Popup.prototype.setContent = function (text) {
    this.content = text;
    var $textDiv = $create("div");
    $textDiv.attr("id", this.container + "Content");
    $textDiv.css("padding", "10px");
    $textDiv.html(text);
    $id(this.container).appendChild($textDiv);
};
WIND.Popup.prototype.getContent = function () {
    return this.content;
};
WIND.Popup.prototype.createSensiblePart = function (exp) {
    var t = this.content;
    var pivot = 0;
    var pos;
    var postab = [];
    if (t.startsWith(exp))
        postab.push(0);
    while (pivot < t.length && pivot !== -1) {
        pos = t.indexOf(exp, pivot + 1);
        pivot = pos;
        if (pivot !== -1)
            postab.push(pivot);
    }
    var newstr = "";
    var debut = 0;
    var fin;
    for (var i = 0; i < postab.length; i++) {
        fin = postab[i];
        newstr += t.substring(debut, fin) + "<span id='" + exp.trim() + i + "'>" + exp + "</span>";
        debut = fin + exp.length;
    }
    newstr += t.substring(debut, t.length);
    $id(this.container + 'Content').innerHTML = newstr;
    this.content = newstr;
    var textparts = [];
    for (var i = 0; i < postab.length; i++) {
        textparts.push(new WIND.TextPart(exp.trim() + i));
    }
    return textparts;
};
WIND.Popup.prototype.createSensiblePartById = function (id) {
    return new WIND.TextPart(id);
};
WIND.Popup.prototype.show = function () {
    var styleParams = {
        'position': 'absolute',
        'left': this.x,
        'top': this.y,
        'border': "1px #0033CC solid",
        'backgroundColor': '#BFCFFE',
        'opacity': '0.8',
        'visibility': 'visible'
    };

    $id(this.container).css(styleParams);
};
WIND.Popup.prototype.hide = function () {
    $id(this.container).css("visibility", "hidden");
};

// This method fixes IE specific issues 
fixIE = function () {
    if (!Array.indexOf) {
        Array.prototype.indexOf = function (arg) {
            var index = -1;
            for (var i = 0; i < this.length; i++) {
                var value = this[i];
                if (value === arg) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }

    if (!window.console) {

        window.console = {};
        window.console.log = function (message) {
            var body = $tag('body')[0];
            var messageDiv = document.createElement('div');
            messageDiv.innerHTML = message;
            body.insertBefore(messageDiv, body.lastChild);
        };
    }
};
String.prototype.startsWith = function (str) {
    return (this.length !== 0 && this.indexOf(str) === 0);
};
String.prototype.endsWith = function (str) {
    return (this.length !== 0 && this.lastIndexOf(str) === (this.length - str.length));
};
String.prototype.trim = function () {
    return this.replace(/\s+/g, '');
};
padZero = function (number) {
    if (number < 10) {
        number = 0 + '' + number;
    }
    return number;
};

WIND.getScriptLocation = function () {
    return "./scripts";
};