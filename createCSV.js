// Requires colorContrastCheck.js
var colorAssociations = function(colors,thresholds){
    var colors = colors['colors'],
        csv = 'Swatch,Hex Color,AA (Small),AA (Large),AAA (Small),AAA (Large)\n';

    for(var i = 0; i < colors.length; i++){
        var colorRatio = [],
            thresh = [],
            approvedColors = [];
        csv += ',' + colors[i].hex;

        // Thresholds
        for(var t = 0; t < thresholds.length; t++){
            approvedColors[ thresholds[t].id ] = [];
        }

        // Get color ranges for pairings
        for(var n = 0; n < colors.length; n++){
            // Creates ratio of colors
            colorRatio[colors[n].hex] = ratio(colors[i].hex,colors[n].hex);

            // Determines which colors are approved
            for(var t = 0; t < thresholds.length; t++){
                if( thresholds[t].ratio <= colorRatio[colors[n].hex]){
                    approvedColors[ thresholds[t].id ].push(colors[n].hex)
                }
            }
        }

        // console.log(colors[i].hex,approvedColors);

        // Output to CSV
        for(var t = 0; t < thresholds.length; t++){
            csv += ',"'+approvedColors[thresholds[t].id].toString().replace(new RegExp(",", "g"), ', ')+'"';
        }

        csv += '\n';
    }

    console.log(csv);
    var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'colors.csv';
        hiddenElement.click();
}



document.querySelector("#download").addEventListener("click",function(){
    colorAssociations(colors,thresholds);
})