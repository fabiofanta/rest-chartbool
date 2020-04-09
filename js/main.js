$(document).ready(function () {

	buildDashboard();

$('#btn-add').click(function() {
	var salesMan = $('#salesman-select').val();
	var date = $('#sales-date').val();
	var amount = parseInt($('#sales-amount').val());
	var isoDate = moment(date).format('DD/MM/YYYY');
	console.log(salesMan);
	console.log(isoDate);
	console.log(amount);
	var dataObject = {salesman:salesMan,amount:amount,date:isoDate};
	console.log(dataObject);
	addSales(dataObject);
});








function addSales(object) {
	$.ajax({
		url: 'http://157.230.17.132:4009/sales',
		method:'POST',
		data: object,
		success: function() {
			buildDashboard();
			myChart.update();
		},
		error: function (err) {
			alert('API Error!')
		}
	})
};

function buildDashboard() {
	$.ajax({
		url: 'http://157.230.17.132:4009/sales',
		method:'GET',
		success: function(data) {
			var revenuesData = data;
			console.log(revenuesData);
			var montlyRevenues = {};
			console.log(montlyRevenues);
			var salesManRevenues = {};
			var quarterRevenues = {};
			var totalRevenue = 0;

			for (var i = 0; i < revenuesData.length; i++) {
				var revenueData = revenuesData[i];
				console.log(revenueData);
				var date = revenueData.date;
				var salesMan = revenueData.salesman;
				var isoDate = moment(date,"DD/MM/YYYY");
				var monthName = isoDate.month();
				var quarterDate = isoDate.quarter();
				console.log(quarterDate);
				var labelRev = [];
				var dataRev = [];
				console.log(totalRevenue);
				var salesManlabel = [];
				var salesMandata = [];
				var quarterLabel = [];
				var salesQuarterdata = [];


				if (montlyRevenues[monthName] === undefined) {
					montlyRevenues[monthName] = 0;
				};

				if (salesManRevenues[salesMan] === undefined) {
					salesManRevenues[salesMan] = 0;
				};

				if (quarterRevenues[quarterDate] === undefined) {
					quarterRevenues[quarterDate] = 0;
				};
				montlyRevenues[monthName] += parseInt(revenueData.amount);
				salesManRevenues[salesMan] += parseInt(revenueData.amount);
				quarterRevenues[quarterDate] += 1;
				totalRevenue += parseInt(revenueData.amount);


			};

			for (var key in montlyRevenues) {
				labelRev.push(moment().month(key).format('MMMM'));
				dataRev.push(montlyRevenues[key]);
			};

			for (var key in salesManRevenues) {
				salesManlabel.push(key);
				salesMandata.push((salesManRevenues[key]/totalRevenue));
			};

			for (var key in quarterRevenues) {
				quarterLabel.push('Q' + key);
				salesQuarterdata.push(quarterRevenues[key]);
			};

			console.log(salesManlabel);
			console.log(salesMandata);
			console.log(quarterLabel);
			console.log(salesQuarterdata);

			chart(lineChartData(dataRev,labelRev),'montly-revenue');
			chart(pieChartData(salesMandata,salesManlabel),'annual-revenuexsalesman');
			chart(barChartData(salesQuarterdata,quarterLabel),'quarter-chart');
		},

		error: function(err) {
			alert('API Error!');
		}
		})
	}


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
