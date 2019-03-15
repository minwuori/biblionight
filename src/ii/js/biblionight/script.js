document.addEventListener('DOMContentLoaded', function(){ 
	
    var owl = {
        isEyeProcessed: false, // есть ли движение
        eyeLeft: '.owl-eye-left', // селектор левого глаза
        eyeRight: '.owl-eye-right', // селектор правого глаза
        radius: 6, // радиус вращения


        // инициализация
        init: function(){

            owl.eyeLeft = document.querySelector(owl.eyeLeft);
            owl.eyeRight = document.querySelector(owl.eyeRight); 

            owl.eyeBallRight = owl.eyeRight.children;
            owl.eyeBallLeft = owl.eyeLeft.children;

            owl.x = owl.eyeLeft.getBoundingClientRect().left + 37; // координата контейнера глаза слева
            owl.y = owl.eyeLeft.getBoundingClientRect().top + 25; // координата кониейнепа глаза сверху

            document.addEventListener('mousemove', (function(e) {
                owl.cursorX = e.pageX;
                owl.cursorY = e.pageY;

                owl.followCursor();
            }));
        },

        //слежение за курсором
        followCursor: function(){
            
            if (!owl.isEyeProcessed) {
                owl.isEyeProcessed = true;
                var y = ((owl.radius * (owl.cursorY - owl.y)) / Math.sqrt((owl.cursorX - owl.x) * (owl.cursorX - owl.x) + (owl.cursorY - owl.y) * (owl.cursorY - owl.y))) + owl.y;
                var x = (((y - owl.y) * (owl.cursorX - owl.x)) / (owl.cursorY - owl.y)) + owl.x;
                owl.eyeBallRight[0].style.cssText = 'margin-top: ' + (y - owl.y + 1) + 'px; \ margin-left: ' + (x - owl.x) + 'px;';
                owl.eyeBallLeft[0].style.cssText = 'margin-top: ' + (y - owl.y + 1) + 'px; \ margin-left: ' + (x - owl.x) + 'px;';
                owl.isEyeProcessed = false;
            }
        }
    };
	

    function checkOnDate() {
        var today = new Date(),// получить сегодняшнюю дату
        selectors = {
            number: '.number',
            dateActive: '.date__item_active',
            dateDisable: '.date__item_disable'
        },
        circleDate = document.querySelectorAll(selectors.number), // элемент с датой
        arrDate = [], // массив родителей элементов даты
        date; // значение элемента с датой
        
        if (today.getFullYear() === 2019 && today.getMonth() === 3){ // сравнить текущий год и месяц

            for (var i = 0; i < circleDate.length; i++){

                date = +circleDate[i].innerHTML; // преобразовать значение даты в число
                arrDate.push(circleDate[i].parentNode); // закинуть родительские элементы даты в массив

                if (today.getDate() >= date){ // сравнить дни

                    if (arrDate[i].classList.contains(selectors.dateActive.substring(1))){ // проверить имеется ли класс активности

                        arrDate[i].classList.add(selectors.dateDisable.substring(1)); // навесить класс прошедшей даты

                    } else {

                        arrDate[i].classList.add(selectors.dateActive.substring(1)); // навесить класс активности даты
                    }
                }
            }
        }

    };
	

	var form = {
        inputSelector: '.mail', // описание инпута
        errorContainerSelector: '.error-message', // селектор контейнера с ошибкой
        isValid: false, // валидная ли форма
        regular:{
            'email': /^.+@.+[.].{2,}$/i // регулярка для валидации
        },
        validationMessages: { // сообщения для валидации
            required: 'Это поле должно быть заполнено',
            correctMail: 'Введите корректный email адрес'
        },
        countSubmitForm: 0, // количество попыток сабмита формы

        // инициализация инпута
        initInput: function (){
            form.notification = document.querySelector('#notification');
            form.input = form.notification.querySelector('input');

            form.notification.addEventListener('input', form.onChange)

            var submitButton = document.querySelector('.subscribeSend');
            submitButton.addEventListener('click', form.onSubmit);

            form.notification.addEventListener('submit', function (e) {
                e.preventDefault();
                form.onSubmit();
            });
        },

        // отслеживание ввода
        onChange: function (){
            if(form.countSubmitForm > 0){
                var errorContainer = this.querySelector(form.errorContainerSelector);
                if(errorContainer){
                    this.removeChild(errorContainer);
                }
                form.validate(form.input);
            }
        },

        // подтверждение формы
        onSubmit: function (){
            focusError();

            deleteErrorMessages();

            form.isValid = true;
            
			form.validate(form.input);

            if(form.isValid){
                form.notification.submit();
                //здесь добавить что сделать с контентом
                return;
            }

            form.countSubmitForm++;

            // фокус на ошибке
            function focusError(){
                var errorContainer = document.querySelector(form.inputSelector);
                var error = errorContainer.parentNode.querySelectorAll('input');
				error[0].focus();
            }

            // удаление предыдущих сообщений об ошибках
            function deleteErrorMessages(){
                var errorContainers = document.querySelectorAll(form.errorContainerSelector);
                for( var i = 0; i < errorContainers.length; i++){
                    var error = errorContainers.item(i);
                    error.parentElement.removeChild(error);
                }
            }
        },

        // валидация инпута
        validate: function(input){
            if(!validateRequireInput(input)){
                form.isValid = false;
            } else if(!testforRegular(input)){
                form.isValid = false;
            }

            // проверка заполненности обязательного поля
            function validateRequireInput(input){
                if(input.hasAttribute('required') && !input.value ){
                    form.createErrorMessage(input, form.validationMessages.required);
                    return false;
                }

                return true;
            }

            // проверка на соответствие регулярке
            function testforRegular(input){
                var pattern = form.regular[input.getAttribute('name')];
                    if(pattern && !pattern.test(input.value)){
                        form.createErrorMessage(input, form.validationMessages.correctMail);
                        return false;
                    }
                return true;
            }
        },

        // создание контейнера с ошибкой
        createErrorMessage: function(input, errorText){
            var errorContainer = document.createElement('div');
            errorContainer.className = 'error-message';
            errorContainer.innerHTML = errorText;
            errorContainer.style.display = 'block';
            input.parentNode.appendChild(errorContainer);
        }
    };

    checkOnDate();
    form.initInput();
    owl.init();

});
