$(document).ready(function () {

	buildDashboard();




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
			$('option:first-child').clone().removeAttr('disabled selected').text(key).val(key).appendTo('#salesman-select');
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
		$.ajax({
			url: 'http://157.230.17.132:4009/sales',
			method:'GET',
			success: function(data) {
				var revenuesData = data;
				var montlyData = montlyRevDataBuilder(revenuesData);
				var salesManData = salesManDataBuilder(revenuesData);
				var quarterSalesData = qrtSalesDataBuilder(revenuesData);

				replaceCanvas();

				chart(lineChartData(montlyData.data,montlyData.label),'montly-revenue');
				chart(pieChartData(salesManData.data,salesManData.label),'annual-revenuexsalesman');
				chart(barChartData(quarterSalesData.data,quarterSalesData.label),'quarter-chart');

				//  function to add data using a post ajax call
				$('#btn-add').click(function() {
					addSales(salesManData.label);
				});

				$('#sales-amount').keypress(function(event) {
				    if(event.key =='Enter') {
				        addSales(salesManData.label);
				    };
				});

			},

			error: function(err) {
				alert('API Error!');
			}
		});
	};

	function chart(data,selector) {
		var ctx = $('#'+ selector +'');
		Chart.defaults.global.defaultFontColor = 'white';
		Chart.Legend.prototype.afterFit = function() {
		    this.height = this.height + 20;
		};
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
				   lineTension:0,
				   backgroundColor: 'yellow',
				   borderColor: 'yellow',
			   }],
				labels: labels,
			},
			options: {
				maintainAspectRatio:false,
				tooltips: {
					callbacks: {
						label:function (tooltipItem, data) {
							var tooltips = data.datasets[0].data[tooltipItem.index];
							return  tooltips + "€"
						}
					}
				},
				scales: {
        			yAxes: [{
            			gridLines: {
                			color: 'rgba(255, 255, 255, 0.2)',
			            }
			        }],
        			xAxes: [{
            			gridLines: {
                			color: 'rgba(255, 255, 255, 0.2)',
			            }
			        }]
			    },
			}
		};

		return data

	};

	function barChartData(data,labels) {
		var data = {
			type: 'bar',
			data: {
				datasets: [{
				   data: data,
				   label:'Quarter Sales (number)',
				   backgroundColor: 'Blue',
				   borderColor: 'Blue',
				   hoverBackgroundColor: 'lightblue',
			   }],
			labels: labels,
		},
			options: {
				maintainAspectRatio:false,
				scales: {
        			yAxes: [{
            			gridLines: {
                			color: 'rgba(255, 255, 255, 0.2)',
			            },
						ticks: {
		                    beginAtZero: true
		                }
			        }],
        			xAxes: [{
            			gridLines: {
                			color: 'rgba(255, 255, 255, 0.2)',
			            }
			        }]
			    },
			}
		};

		return data

	};

	function pieChartData(data,labels) {
		var data = {
			type: 'pie',
			data: {
				datasets: [{
					   data: data,
					   backgroundColor: ['blue','red','yellow','green'],
				   		}],
				labels: labels
				},
			options: {
				maintainAspectRatio:false,
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

	function postData(object) {
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

	function addSales(salesManToCheck) {
		var salesMan = $('#salesman-select').val();
		var smtcLowCase = arrayToLowerCase(salesManToCheck);
		if (salesMan == null || !smtcLowCase.includes(salesMan.toLowerCase())) {
			alert('Invalid SalesMan name');
		} else {
			var date = $('#sales-date').val();
			var amount = parseInt($('#sales-amount').val());
			if (isNaN(amount) || amount < 1) {
				alert('Invalid amount');
			} else {
				var isoDate = moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
				if (isoDate == 'Invalid date' || isoDate != moment(date,'YYYY-MM-DD').format('DD/MM/2017')) {
					alert('Invalid date');
				} else {
					var dataObject = {salesman:stringCapitalize(salesMan),amount:amount,date:isoDate};
					postData(dataObject);
				};
			};
		};
	};

	function arrayToLowerCase(array) {
		var newArray = [];
		for (var i = 0; i < array.length; i++) {
			var string = array[i].toLowerCase();
			newArray.push(string);
		};
		return newArray
	};

	function stringCapitalize(string) {
    	return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
	};

	function replaceCanvas() {
		$('.chart-1 canvas').replaceWith('<canvas id="montly-revenue"></canvas>'); // // reset canvas
		$('.chart-2 canvas').replaceWith('<canvas id="annual-revenuexsalesman"></canvas>'); // // reset canvas
		$('.chart-3 canvas').replaceWith('<canvas id="quarter-chart"></canvas>'); // // reset canvas
	}





});
