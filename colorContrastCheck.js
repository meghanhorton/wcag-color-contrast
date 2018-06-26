// Check colors
luminance    = function (rgb) {
        var convert = function (x) {
            if (x === 0) {
                return 0;
            }
            x = (x / 255);
            if ((x * 100000) <= 3928) {
                return ((x * 100) / 1292) * 10000;
            }
            x *= 100000;
            return Math.pow((((x + 5500) / 105500)), 2.4) * 10000;
        };
    return ((2126 * convert(rgb[0])) + (7152 * convert(rgb[1])) + (722 * convert(rgb[2]))) / 100000000;
},
hexToDec     = function (color) {
    if (typeof color !== "string" || (color.length !== 4 && color.length !== 7)) {
        error("The value <em>" + color + "</em> does not appear to be a valid color hex code.");
        return [];
    }
    color = color.toLowerCase().slice(1);
    if ((/^([0-9a-f]+)$/).test(color) === false) {
        error("The value <em>" + color + "</em> does not appear to be a valid color hex code.");
        return [];
    }
    if (color.length === 3) {
        color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
    }
    return [
        parseInt(color.charAt(0) + color.charAt(1), 16), parseInt(color.charAt(2) + color.charAt(3), 16), parseInt(color.charAt(4) + color.charAt(5), 16)
    ];
},
ratio = function(a,b){
    var aLum = luminance(hexToDec(a)) * 1000,
        bLum = luminance(hexToDec(b)) * 1000;
    var ratio = (aLum > bLum) ? ((aLum + 50) / (bLum + 50)) : ((bLum + 50) / (aLum + 50));
    
    return Math.round( ratio * 100 ) / 100;
};

// Output
createColorChart = function(json){
    var colors = json['colors'];

    // Create columns
    var table = "table#colorChart";

    // Add heading row
    document.querySelector(table + ' thead')
        .appendChild(document.createElement('tr')) // Create row
        .appendChild(document.createElement('td')); // Create empty first cell

    for(var i = 0; i < colors.length; i++) {
        var th = document.querySelector(table + ' thead tr')
            .appendChild(document.createElement('th'));
            th.appendChild(document.createElement('div'))
                .innerHTML = colors[i].name;
        var colorLabel = th.appendChild(document.createElement('div'));
            colorLabel.classList.add("color-label")
            colorLabel.setAttribute("style",'color:'+colors[i].hex);
            if(ratio(colors[i].hex,'#fff')<=4.5){colorLabel.classList.add("lowContrast")}
            colorLabel.innerHTML = colors[i].hex;
    }

    // Create rows of colors
    for(var i = 0; i < colors.length; i++) {
        var id = colors[i].name.replace(new RegExp(" ", "g"), '_').toLowerCase();
        document.querySelector(table + ' tbody')
            .appendChild(document.createElement('tr')) // add row
            .setAttribute("id",id); // set id to row
        
        // Add header to row
        var header = document.querySelector('#'+id)
            .appendChild(document.createElement('th')); // add th
            
        var swatch = header.appendChild(document.createElement('div'));
            swatch.classList.add("swatch");
            // If low contrast on white background, add border
            if(ratio(colors[i].hex,'#fff') < 4.5){ swatch.classList.add("lowContrast") }
            swatch.setAttribute("style","background:"+colors[i].hex);
        
        header.appendChild(document.createElement("span")).innerHTML = colors[i].name+'<br/>'+colors[i].hex;
        

        // Loop through all colors, add columns to row
        for(var n = 0; n < colors.length; n++) {
            var elColors = colors[i].hex+","+colors[n].hex;
                elRatio = ratio(colors[i].hex,colors[n].hex);

            document.querySelector('#'+id)
                .appendChild(document.createElement('td'))
                .setAttribute("data-colors",elColors);
            var el = document.querySelector('#'+id+ ' [data-colors="'+elColors+'"]');
                el.setAttribute("data-ratio",elRatio);
        }
    }

    // Display initial
    drawRatioSwatches(thresholds[0].ratio);
},
createDropdown = function(threshold){
    var dropdown = "select#colorContrastThreshold";
    for(var i = 0; i < threshold.length; i++) {
        document.querySelector(dropdown)
            .appendChild(document.createElement("option"))
            .setAttribute("value",threshold[i].id);
        var option = document.querySelector(dropdown + ' option[value="'+threshold[i].id+'"]');
            option.setAttribute("data-ratio",threshold[i].ratio);
            option.innerHTML = threshold[i].label;
    }
},
onChangeDropdown = function(el){
    // Change ratio swatches
    el.addEventListener("change",function(){
        var threshold = document.querySelector("[value='"+ el.value +"']").getAttribute('data-ratio');

        // Draw swatches
        drawRatioSwatches(threshold);

        // Update text
        for(var n = 0; n < thresholds.length; n++) {
            if(thresholds[n].id === el.value){
                document.querySelector(".wcag-label").innerHTML = thresholds[n].label;
                document.querySelector(".wcag-desc").innerHTML = thresholds[n].description;
            }
        }
    });
},
drawRatioSwatches = function(threshold){
    var threshold = parseInt(threshold);
    document.querySelectorAll('td[data-ratio]').forEach(function(elem){
        var dataRatio = elem.getAttribute('data-ratio'),
            colors = elem.getAttribute('data-colors').split(',');
        elem.innerHTML = '';

        swatchRatio = elem.appendChild(document.createElement("div"));
        swatchRatio.setAttribute("title",dataRatio);
        
        swatchRatio.classList.add("swatch","ratio");
        if(dataRatio >= threshold){
            swatchRatio.setAttribute("style",'background:'+colors[0]+';color:'+colors[1]);
            swatchRatio.innerHTML = 'Aa';
            
            // Add a border if low contrast against white background
            if(ratio(colors[0],'#fff')<=4.5){ swatchRatio.classList.add("lowContrast");}
        } else{
            swatchRatio.classList.add("fail");
        }
    });
};