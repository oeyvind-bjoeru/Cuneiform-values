var ogslData = new Array;
var sigla = new Array;
var dictValues = new Object;
var dictSigns = new Object;

function pressSubmit() {
	document.getElementById("searchBox").onkeypress = function(event)
	{
    	if(event.keyCode === 13) {
        	searchDict()
        }
	};
}

function loadOGSL() {

	fetch("https://raw.githubusercontent.com/oracc/ogsl/master/00lib/ogsl.asl")
  	.then(response => {
  		return response.text();
  	})
  	.then(response => {
		ogslData = response.split("\n");
		var currentSign = new String;
		var currentBorger = new String;
		var currentUCode = new String;

		for(var i = 0;i < ogslData.length; i++) {
			let siglum = ogslData[i].split(/\s+/, 1)[0];
			let value = ogslData[i].split(/\s+/, 2)[1];
			sigla.push(siglum);

			if(siglum == '@sign') {
				currentSign = ogslData[i].split(/\s+/, 2)[1];
			}
			else if(siglum == '@v') {
				currentValue = ogslData[i].split(/\s+/, 2)[1];
				dictValues[currentValue] = {sign:currentSign, borger:currentBorger};

				if(currentSign in dictSigns) {
					dictSigns[currentSign].push(currentValue);
				} else {
					dictSigns[currentSign] = [currentValue];
				}

			}
			else if(value != null) {
				if((siglum == '@list') && (value.slice(0, 3) == 'MZL')) {
					currentBorger = parseInt(value.slice(3, value.length));
				}

				else if(ogslData[i] == '@end sign') {
					currentSign = '';
					currentValue = '';
					currentBorger = '';
				}
			}
		}
	})
}

function searchDict() {
	let searchTerm = document.getElementById("searchBox").value
	
	searchTerm = searchTerm.replace("x", "ₓ");
	searchTerm = searchTerm.replace("'", "ʾ");

	let subscripts = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"]
	for (let i = 0; i < 10; i++) {
		searchTerm = searchTerm.replace(i.toString(), subscripts[i]);
	}	
	
	if (searchTerm in dictValues) {
		var newP = document.createElement("p");
  		newP.innerHTML = 'Sign:\t' + dictValues[searchTerm].sign + '<br>MZL:\t' + dictValues[searchTerm].borger + '<br>Values:\t' + dictSigns[dictValues[searchTerm].sign].join(', ');
  		document.getElementById("result").innerHTML = '';
  		document.getElementById("result").appendChild(newP);

	}
}