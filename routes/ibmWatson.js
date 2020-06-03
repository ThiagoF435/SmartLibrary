var express = require('express');
var router = express.Router();
//recupera configuracoes de acesso aos servicos IBM Watson
const ibmWatson = require('../lib/ibmWatsonCredentials');
//adiciona package multer que permite recuperar stream de audio
//enviado para o servido text to speech
var multer = require('multer');
var upload = multer();

//post para o servico: IBM Watson Assistant
router.post('/assistant', function(req,res,next){
	//recupera mensagem de texto e contexto da conversa
	var {text, contextDialog} = req.body;
	context = JSON.parse(contextDialog);
	//constroi json para envio dos dados ao servico
	const params = {
		input: { text } ,
		//skill id
		workspaceId: '7d618f92-fd39-4d10-8f24-7185ca4baee3',
		context
	};
	//envia os dados ao servico e retorna mensagem
	ibmWatson.assistant.message(
	params,
	function(err, response){
		if(err)
			res.json({ status: 'ERRO', data: err.toString() });
		else
			res.json({ status: 'OK', data: response });
	}
	);
});

//---------------------------------------------------------------------------------
// get para o servico: IBM Watson Text to Speech
//---------------------------------------------------------------------------------
router.get('/textToSpeech', async(req, res, next) => {
	try{
		//constroi json para o envio dos dados ao servico
		var params = {
			text: req.query.text,
			accept: 'audio/mp3',
			voice: 'pt-BR_IsabelaVoice'
		};
		//envia os dados ao servico e armazena o retorno no objeto result
		const { result } = await ibmWatson.textToSpeech.synthesize(params);
		result.on('response',(response) => {
			//disponibiliza audio para o front-end
			response.headers['content-disposition'] = `attachment;
			filename=transcript.audio%2Fmp3`;
		});
		result.on('error', next);
		result.pipe(res);
	} catch(error){
		res.send(error);
	}
});

//--------------------------------------------------------
//post pra o servico IBM Watson Speech to Text
//--------------------------------------------------------
router.post('/speechToText', upload.single('audioFile'), function(req, res, next) {
	//recupera stream de audio para enviar ao servico
	var audioStream = req.file;
	
	//constroi json para envio dos dados ao serviço
	var params = {
		audio: audioStream.buffer,
		contentType: 'audio/l16; rate=44100',
		interim_results: true,
		model: 'pt-BR_BroadbandModel'
	};
	console.log(params);
	
	//envia os dados ao serviço e retorna o audio transcrito
	ibmWatson.speechToText.recognize(params, function(error, response){
		if(error)
			res.json({status: 'ERRO', data: error.code + ' - ' + error.toString() });
		else {
			console.log(JSON.stringify(response.result, null, 2));
			res.json({status: 'OK', data: response});
		}
	});
});

module.exports = router;

//--------------------------------------------------------------------
//post para o serviço : IBM Watson Language Translator para Português
//--------------------------------------------------------------------
router.post('/translator', function (req, res, next){
	const translateParams = {
        text: req.body.text,
        modelId: 'en-pt'
        //source: 'English',
        //target: 'Portuguese'
      };
	
	console.log(translateParams);

	ibmWatson.languageTranslator.translate(translateParams)
	  .then(translationResult => {
		console.log(JSON.stringify(translationResult, null, 2));
		//console.log(JSON.stringify(results,null,2));
		res.json({status: 'OK', data: translationResult});	
		//console.log(res.headers);
	  })
	  .catch(err => {
		res.json({ status: 'ERRO', data: err.code + ' - ' + err.toString() }),
		console.log('error:', err);
	  });
	
});


//------------------------------------------------------------------
//post para o serviço : IBM Watson Language Translator para Inglês
//------------------------------------------------------------------
router.post('/translatorB', function (req, res, next){
 	const translateParams = {
         text: req.body.text,
         modelId: 'pt-en'
         //source: 'Portuguese',
         //target: 'English',
       };
 	console.log(translateParams);
    
	ibmWatson.languageTranslator.translate(translateParams)
	  .then(translationResult => {
		console.log(JSON.stringify(translationResult, null, 2));
		//console.log(JSON.stringify(results,null,2));
		res.json({status: 'OK', data: translationResult});	
		//console.log(res.headers);
	  })
	  .catch(err => {
		res.json({ status: 'ERRO', data: err.code + ' - ' + err.toString() }),
		console.log('error:', err);
	  });
});
