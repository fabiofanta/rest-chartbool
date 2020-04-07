$(document).ready(function () {

$.ajax({
	url: 'http://157.230.17.132:4009/sales',
	success: function(data) {
		console.log(data);
		var revenuesData = data;
		var montlyRevenues = {};
		var month = moment(data.date).month().format('MMMM'))
		for (var i = 0; revenuesData.length; i++) {
			var revenueData = revenuesData[i];
			if (montlyRevenues[colore] === undefined) {
				montlyRevenues[colore] = 0;
			}

		}
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
