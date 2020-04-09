$(document).ready(function () {

	buildDashboard();

$('#btn-add').click(function() {
	var salesMan = $('#salesman-select').val();
	var date = $('#sales-date').val();
	var amount = $('#sales-amount').val();
	var isoDate = moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
	var dataObject = {salesman:salesMan,amount:amount,date:isoDate};

	addSales(dataObject);
});


	function addSales(object) {
	$.ajax({
		url: 'http://157.230.17.132:4009/sales',
		method:'POST',
		data: object,
		success: function(data) {
			buildDashboard();
		},
		error: function (err) {
			alert('API Error!')
		}
	})
};

	function montlyRevDataBuilder(revenuesData) {
		var montlyRevenues = {};
		for (var i = 0; i < revenuesData.length; i++) {
			var revenueData = revenuesData[i];
			var date = revenueData.date;
			var isoDate = moment(date,"DD/MM/YYYY");
			var monthName = isoDate.month();

			//array to fill in order to put them into chart
			var labelRev = [];
			var dataRev = [];


			if (montlyRevenues[monthName] === undefined) {
				montlyRevenues[monthName] = 0;
			};

			montlyRevenues[monthName] += parseInt(revenueData.amount);
		};

		for (var key in montlyRevenues) {
			labelRev.push(moment().month(key).format('MMMM'));
			dataRev.push(montlyRevenues[key]);
		};

		return {label:labelRev,data:dataRev}
	};

	function salesManDataBuilder(revenuesData) {
		var salesManRevenues = {};
		var totalRevenue = 0;

		for (var i = 0; i < revenuesData.length; i++) {
			var revenueData = revenuesData[i];
			var salesMan = revenueData.salesman;
			var salesManLabel = [];
			var salesManData = [];

			if (salesManRevenues[salesMan] === undefined) {
				salesManRevenues[salesMan] = 0;
			};

			salesManRevenues[salesMan] += parseInt(revenueData.amount);
			totalRevenue += parseInt(revenueData.amount);
		};

		for (var key in salesManRevenues) {
			salesManLabel.push(key);
			salesManData.push((salesManRevenues[key]/totalRevenue));
			// append salesman-select aptions
			$('#salesman-select').append('<option value="'+ key +'">'+ key + '</option>');
		};

		return {label:salesManLabel,data:salesManData}
	};

	function qrtSalesDataBuilder(revenuesData) {
		var quarterSales = {};


		for (var i = 0; i < revenuesData.length; i++) {
			var revenueData = revenuesData[i];
			var date = revenueData.date;
			var isoDate = moment(date,"DD/MM/YYYY");
			var quarterDate = isoDate.quarter();
			var quarterLabel = [];
			var salesQuarterData = [];


			if (quarterSales[quarterDate] === undefined) {
				quarterSales[quarterDate] = 0;
			};

			quarterSales[quarterDate] += 1;
		};

		for (var key in quarterSales) {
			quarterLabel.push('Q' + key);
			salesQuarterData.push(quarterSales[key]);
		};

		return {label:quarterLabel,data:salesQuarterData}
	};


	function buildDashboard() {
	$('.charts').empty(); // reset canvas
	$.ajax({
		url: 'http://157.230.17.132:4009/sales',
		method:'GET',
		success: function(data) {
			var revenuesData = data;
			var montlyData = montlyRevDataBuilder(revenuesData);
			var salesManData = salesManDataBuilder(revenuesData);
			var quarterSalesData = qrtSalesDataBuilder(revenuesData);
			$('.charts').append('<canvas id="montly-revenue"></canvas><canvas id="annual-revenuexsalesman"></canvas><canvas id="quarter-chart"></canvas>'); // // reset canvas

			chart(lineChartData(montlyData.data,montlyData.label),'montly-revenue');
			chart(pieChartData(salesManData.data,salesManData.label),'annual-revenuexsalesman');
			chart(barChartData(quarterSalesData.data,quarterSalesData.label),'quarter-chart');
		},

		error: function(err) {
			alert('API Error!');
		}
		})
	};


	function chart(data,selector) {
		var ctx = $('#'+ selector +'');
		var myChart = new Chart(ctx,data);
	};

	function lineChartData(data,labels) {
		var data = {
			type: 'line',
			data: {
				datasets: [{
				   data: data,
				   label:'Montly Revenues',
				   fill:false,
				   lineTension:0
			   }],
			labels: labels,
			}
		}

		return data

	};

	function barChartData(data,labels) {
		var data = {
			type: 'bar',
			data: {
				datasets: [{
				   data: data,
				   label:'',
			   }],
			labels: labels,
			}
		}

		return data

	};

	function pieChartData(data,labels) {
		var data = {
			type: 'pie',
			data: {
				datasets: [{
					   data: data,
					   label:'Annual revenues per Salesman',
					   backgroundColor: ['blue','red','yellow','green'],
				   		}],
				labels: labels
				},
			options: {
				tooltips: {
					callbacks: {
						label:function (tooltipItem, data) {
							var tooltipsX100 = (data.datasets[0].data[tooltipItem.index]*100).toFixed(2);
							return  tooltipsX100 + "%"
						}
					}
				}
			}
		};
		return data
	};
});
