
	document.getElementById('card-view-btn').onclick(function () {
		document.getElementById('.patients-card-view').removeClass('no-display');
		document.getElementById('.patients-table-view').addClass('no-display');
	}) 

	document.getElementById('table-view-btn').onclick(function () {
		document.getElementById('.patients-table-view').removeClass('no-display');
		document.getElementById('.patients-card-view').addClass('no-display');
	})

