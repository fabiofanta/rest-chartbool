$(document).ready(function () {

	var json=[{type:"lightcoral",amount:5},{type:"lightcoral",amount:15},{type:"yellow",amount:2},{type:"lightblue",amount:25},{type:"lightblue",amount:15},{type:"lightblue",amount:5}]

	//---------------------------Versione a mano--------------------------------//

	//ci serve un passaggio intermedio per organizzare i dati in modo da farli digerire a chart.js
	var passaggioIntermedio = {
		lightcoral: 20,
		yellow: 2,
		lightblue: 45
	};

	var labelsFinali = ['lightcoral','yellow','lightblue'];
	var dataFinali = [20,2,45];

	//------------------------Fine versione a mano--------------------------------//

	//Ora i passaggi a mano dobbiamo farli fare al browser

	var oggettoIntermedio = {};

	for (var i = 0; i < json.length; i++) {
		var oggettoSingolo = json[i];
		// console.log(oggettoSingolo);
		// console.log(oggettoSingolo.type);
		// console.log(oggettoSingolo.amount);
		var colore = oggettoSingolo.type;
		if (oggettoIntermedio[colore] === undefined) {
			oggettoIntermedio[colore] = 0;
		}
		// console.log(oggettoIntermedio);
		oggettoIntermedio[colore] += oggettoSingolo.amount;

	}

	var labelsPc = [];
	var dataPc = [];

	for (var key in oggettoIntermedio) {
		console.log(key);
		labelsPc.push(key);
		dataPc.push(oggettoIntermedio[key]);
	}

	chiamaGrafico(labelsPc,dataPc);


	function chiamaGrafico(labels,data) {
		var ctx = $('#grafico-mesi');
		var chart = new Chart(ctx, {
			type:'pie',
			data: {
				datasets: [{
				   data: data,
				   backgroundColor: labels,
			   }],

			   labels: labels,
			}

		});
	};
});
