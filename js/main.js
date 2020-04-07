$(document).ready(function () {


$.ajax({
	url: 'http://157.230.17.132:4009/sales',
	success: function(data) {
		var revenuesData = data;
		var montlyRevenues = {};
		for (var i = 0; i < revenuesData.length; i++) {
			var revenueData = revenuesData[i];
			console.log(revenueData);
			var isoDate = moment(revenueData.date,"DD/MM/YYYY");
			console.log(isoDate);
			var month = isoDate.format('MMMM');
			console.log(month);
			// if (montlyRevenues[colore] === undefined) {
			// 	montlyRevenues[colore] = 0;
			// }
		};
	}


})











	function chart(data,selector) {
		var ctx = $('#'+ selector +'');
		var myChart = new Chart(ctx,data);
	};

	function chartData(type,data,labels) {
		var data = {
			type:type,
			data: {
				datasets: [{
				   data: data,
				   backgroundColor: labels,
			   }],
			labels: labels,
			}
		}

		return data

	}
});
