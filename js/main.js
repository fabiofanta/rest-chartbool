$(document).ready(function () {


$.ajax({
	url: 'http://157.230.17.132:4009/sales',
	success: function(data) {
		var revenuesData = data;
		console.log(revenuesData);
		var montlyRevenues = {};
		console.log(montlyRevenues);
		var salesManRevenues = {};
		var totalRevenue = 0;

		for (var i = 0; i < revenuesData.length; i++) {
			var revenueData = revenuesData[i];
			console.log(revenueData);
			var date = revenueData.date;
			var salesMan = revenueData.salesman;
			var isoDate = moment(date,"DD/MM/YYYY");
			var monthName = isoDate.month();
			var labelRev = [];
			var dataRev = [];
			console.log(totalRevenue);
			var salesManlabel = [];
			var salesMandata = [];


			if (montlyRevenues[monthName] === undefined) {
				montlyRevenues[monthName] = 0;
			};

			if (salesManRevenues[salesMan] === undefined) {
				salesManRevenues[salesMan] = 0;
			};
			montlyRevenues[monthName] += revenueData.amount;
			salesManRevenues[salesMan] += revenueData.amount;
			totalRevenue += revenueData.amount;


		};

		for (var key in montlyRevenues) {
			labelRev.push(moment().month(key).format('MMMM'));
			dataRev.push(montlyRevenues[key]);
		};

		for (var key in salesManRevenues) {
			salesManlabel.push(key);
			salesMandata.push(((salesManRevenues[key]/totalRevenue)*100).toFixed(2));
		};

		console.log(salesManlabel);
		console.log(salesMandata);

		chart(lineChartData('line',dataRev,labelRev),'montly-revenue');
		chart(pieChartData('pie',salesMandata,salesManlabel),'annual-revenuexsalesman');

	}
});











	function chart(data,selector) {
		var ctx = $('#'+ selector +'');
		var myChart = new Chart(ctx,data);
	};

	function lineChartData(type,data,labels) {
		var data = {
			type: type,
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

	}
	function pieChartData(type,data,labels) {
		var data = {
			type: type,
			data: {
				datasets: [{
				   data: data,
				   label:'Annual revenues per Salesman',
				   backgroundColor: ['blue','red','yellow','green']

			   }],
			labels: labels,
			}
		}

		return data

	}
});
