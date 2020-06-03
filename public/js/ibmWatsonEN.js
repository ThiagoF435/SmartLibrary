// Variavel para controlar o contexto do Dialogo
var contextDialog = '{}';

function sendMessageToAssistantEN(textMessage){
	//se nao recebeu a mensagem por parametro
	//recupera mensagem digitada pelo usuario
	if(textMessage === undefined || textMessage === ''){
		//var textMessage = document.chatForm.textMessage.value;
		var textMessage = document.chatForm.textMessage.value;
	}
	chat = document.getElementById('chat');
	
	//na primeira chamada (boas vindas) textMessage é undefined
	//entao define como vazio para dar erro na api
	if(textMessage === undefined || textMessage === '')
		textMessage = '';
	else //exibe a mensagem na tela
		chat.innerHTML += '&#129489 &gt ' + textMessage + '<br>';
		
	//limpa o campo input
	document.chatForm.textMessage.value = '';
	
	//alert(textMessageEN);
	//post para o ibm translate
	//atribui oq voltou pra gente em uma variavel
	//usa no restante.
	
	$.post("/ibmWatson/translator",
        { text: textMessage},
        //tratamento de sucesso de processamento do post
        function (returnedData, statusRequest) {
            // se ocorreu algum erro no processamento da API
            if (returnedData.status === 'ERRO')
                alert(returnedData.data);
            // caso os dados tenham retornado com sucesso
            else {
                // exibe retorno da API 
				var retorno = returnedData.data.result.translations[0].translation;
				//alert("entrei aqui: " + retorno);
					//post para serviço watsonAssistant
						$.post("/ibmWatson/assistant",
								{ text: retorno, contextDialog },
								//tratamento de sucesso de processamento da API
								function(returnedData, statusRequest){
									//se ocorreu algum erro no processamento da API
									if (returnedData.status === 'ERRO'){
										alert("Erro aqui no if");
										alert(returnedData.data);
									}
									else{
										//exibe retorno da API 
										var retornoB = JSON.stringify(returnedData.data.result.output.text);
										//alert(retornoB);
										$.post("/ibmWatson/translatorB",
													{ text: retornoB},
													//tratamento de sucesso de processamento do post
													function (returnedData, statusRequest) {
														// se ocorreu algum erro no processamento da API
														if (returnedData.status === 'ERRO')
															alert(returnedData.data);
														// caso os dados tenham retornado com sucesso
														else {
															// exibe retorno da API 
															
															var botingles = returnedData.data.result.translations[0].translation;
															var cl = botingles.replace(/"]/g, "");
															cl = cl.replace('["',"");
															//alert(cl);
															chat.innerHTML += '🤖 &gt ' + cl + '<br>';
															//contextDialog = JSON.stringify(botingles);		
														}
													}
												)

									}
								}
						)
						//tratamento de erro do post
						.fail(function(returnedData){
							alert('Erro' + returnedData.status + ' ' + returnedData.statusText);
						});
				
				
				
            }
        }
    )
	//tratamento de erro do post
	.fail(function(returnedData){
		alert('Erro que esta dando' + returnedData.status + ' ' + returnedData.statusText);
	});

}		

//envia mensagem quando o usuario aperta enter
$(document).keypress(
	function(event){
		if(event.which == '13'){
			event.preventDefault();
			sendMessageToAssistantEN();
		}
	}
);

//apos carregar todos os recursos da pagina, faz post para o servico
//para exibir mensagem de boas vindas do chat
$(document).ready(function(){
	
	chat.innerHTML += '🤖 &gt ' + 'Hello! I am the library chatbot, I am ready to help you. To start, say hi to me? 📚 😃' + '<br>';
	//sendMessageToAssistantEN();
});