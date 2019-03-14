document.addEventListener('DOMContentLoaded', function(){ // Аналог $(document).ready(function(){
	var today = new Date(),// получить сегодняшнюю дату
	selectors = {
		number: '.number',
		dateActive: '.date__item_active',
		dateDisable: '.date__item_disable'
	},
	circleDate = document.querySelectorAll(selectors.number),// элемент с датой
	arrDate = [], // массив родителей элементов даты
	date; // значение элемента с датой
	
	if (today.getFullYear() === 2019 && today.getMonth() === 3){

		for (var i = 0; i < circleDate.length; i++){

			date = +circleDate[i].innerHTML;
			arrDate.push(circleDate[i].parentNode);

			if (today.getDate() >= date){

				if (arrDate[i].classList.contains(selectors.dateActive.substring(1))){

					arrDate[i].classList.add(selectors.dateDisable.substring(1));

				} else {

					arrDate[i].classList.add(selectors.dateActive.substring(1));
				}
			}
		}
	}
});
