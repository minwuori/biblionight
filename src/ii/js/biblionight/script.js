// document.addEventListener('DOMContentLoaded', function(){ // Аналог $(document).ready(function(){
//   console.log('Hello!')

//   // Если должен быть найден один элемент
//   if((e = document.querySelectorAll("#form_error_message_frontend + div > div:last-child label")) !== null)
//     e.classList.add('last'); // Аналог выборки и присвоения класса
//   // Если элементов будет много
//   Array.prototype.forEach.call(document.querySelectorAll("#form_error_message_frontend + div > div:last-child label"), function(e){
//    e.classList.add('last');
//   });
// });

function OnAnswer(data){
	if(data=='ok') {
		var s='<p class="text text--grey">Вы зарегистрированы! <span class="text--blue">Спасибо</span> за регистрацию на нашем сайте.</p>';
		$("#text_form_reg_container").html(s);
		$(".slide1").hide(300);
	}
}

$(document).ready(function($) {

	var mailOnSubmite = false;
	var emailRegexp =(/^.+@.+[.].{2,}$/i);

	function errorMessage(elementValid,theClass,message) {
		$(elementValid).after('<p class="'+theClass+'-message message"></p>');
		$("."+theClass+"-message").html(message);
		var pos = $(elementValid).offset();
		$("."+theClass+"-message").css({
			top: pos.top + elementValid.height(),
			left: pos.left
		});
	}

	function errorMessageReset(theClass) {
		$("."+theClass+"-message").detach();
	}

	var formValidationObject = {

		"errors" : false,
		"passValidate" : function() {
			if (!($("#pass").val() == "") && !($("#pass2").val() == "")) {
				if ($("#pass").val() == $("#pass2").val()) {
					if ($("#pass").val().length>5)
						{errorMessageReset('pass');}
					else {
						errorMessageReset('pass');
						errorMessage($("#pass"),'pass','Число символов в пароле должно быть не меньше 6');
						formValidationObject.errors = true;
					}
				} else {
					errorMessageReset('pass');
					errorMessage($("#pass"),'pass','Не совпадает');
					formValidationObject.errors = true;
				}
			} else {
				errorMessageReset('pass');
				errorMessage($("#pass"),'pass','Заполните поля');
				formValidationObject.errors = true;
			}
		},
		"emailValidate"	: function() {
			if (emailRegexp.test($("#mail").val())) {
				errorMessageReset('email');
			}
			else if (!$("#mail").val()) {
				errorMessageReset('email');
				errorMessage($("#mail"),'email','Заполните это поле');
				formValidationObject.errors = true;
			}
			else {
				errorMessageReset('email');
				errorMessage($("#mail"),'email','Не правильно введено');
				formValidationObject.errors = true;
			}
		},
		"subEmailValidate"	: function() {
			if (emailRegexp.test($("#subMail").val())) {
				errorMessageReset('subMail');
			}
			else if (!$("#subMail").val()) {
				errorMessageReset('subMail');
				errorMessage($("#subMail"),'subMail','Заполните это поле');
				formValidationObject.errors = true;
			}
			else {
				errorMessageReset('subMail');
				errorMessage($("#subMail"),'subMail','Не правильно введено');
				formValidationObject.errors = true;
			}
		},
		"subConfirmValidate"	:	function(){

			if(!$("#confirm").prop("checked")){
				errorMessageReset('confirm');
				errorMessage($("#confirm"),'confirm','Не отмечено');
				formValidationObject.errors = true;
			} else {
				errorMessageReset('confirm');
			}
		},
	 	"submitForm" : function() {
				if(formValidationObject.errors == false) {
 				errorMessageReset('submit');
					var e=$("#mail").val();
					var p=$("#pass").val();
     				$.post('/events/biblionight/regus.php',{e:e,p:p},OnAnswer);
					return false;
 			} else {
 				errorMessageReset('submit');
 				errorMessage($("#regSend"),'submit','Заполните все поля корректно');
 			}
 		},
 		"subscribeForm" : function(data) {
			 mailOnSubmite = false;
 			if(formValidationObject.errors == false) {
 				errorMessageReset('submit');
				if(data=='next') {
					var eemail=$("#subMail").val();
					$("#empotd").text(eemail);
					$("#mail").val(eemail);
					$(".slide1").hide(300);
					$(".slide2").slideDown(300);
				}
				if(data=='stop') {
					var eemail=$("#subMail").val();
					$("#empotd").text(eemail);
					$(".slide1").hide(300);
					$(".slide2").slideDown(300);
					$("#text_form_reg_container").hide();
				}
 			} else {
 				errorMessageReset('submit');
 			}
 		}
	}

	$("#regSend").click(function(event) {
		formValidationObject.errors = false;
		formValidationObject.emailValidate();
		formValidationObject.passValidate();
		formValidationObject.subConfirmValidate();
		formValidationObject.submitForm();
		return false;
	});

	$("#subscribeSend").click(function(event) {
		formValidationObject.errors = false;
		formValidationObject.subEmailValidate();
		if(!formValidationObject.errors)
			if (!mailOnSubmite) {
				mailOnSubmite = true;
				$.post('/events/biblionight/api.php',{e:$("#subMail").val()},formValidationObject.subscribeForm);
			}
		return false;
	});
});