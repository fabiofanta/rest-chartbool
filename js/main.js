$(document).ready(function () {


$.ajax({
	url: 'http://157.230.17.132:4009/sales',
	success: function(data) {
		var revenuesData = data;
		console.log(revenuesData);
		var montlyRevenues = {};

		for (var i = 0; i < revenuesData.length; i++) {
			var revenueData = revenuesData[i];
			console.log(revenueData);
			var date = revenueData.date;
			var isoDate = moment(date,"DD/MM/YYYY");
			console.log(isoDate);
			var monthName = isoDate.format('MMMM');
			var labelRev = [];
			var dataRev = [];


			if (montlyRevenues[monthName] === undefined) {
				montlyRevenues[monthName] = 0;
			};
			montlyRevenues[monthName] += revenueData.amount;
		};

		console.log(montlyRevenues);

		for (var key in montlyRevenues) {
			labelRev.push(key);
			dataRev.push(montlyRevenues[key]);
		};

		chart(chartData('line',dataRev,labelRev),'montly-revenue');

	}
});











	function chart(data,selector) {
		var ctx = $('#'+ selector +'');
		var myChart = new Chart(ctx,data);
	};

	function chartData(type,data,labels) {
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
});
