const AssistantV1 = require('ibm-watson/assistant/v1');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


//configuracao para o IBM Watson assistant
const assistant = new AssistantV1({
	url: 'https://gateway.watsonplatform.net/assistant/api',
	version: '2020-01-04',
	authenticator: new IamAuthenticator({ apikey: 's186MeFDdmgCLgpSxDlWj76MASkbhjj0JaigG594kyWm'})	
});

//configuracao para o IBM Watson Text to Speech
const textToSpeech = new TextToSpeechV1({
	authenticator: new IamAuthenticator({ apikey: 'aNagdWUJUEcXRk8kPE7AAU8VD9zVlN5m_HfU-aCDgOJu'}),
	url: 'https://stream.watsonplatform.net/text-to-speech/api/'
});

//configuracao para o IBM Watson Speech to Text
const speechToText = new SpeechToTextV1({
	authenticator: new IamAuthenticator({ apikey: 'awRmeTsBAyEbocPRqDcAfIP6SMnNtRksq_wCmyPiYT1I'}),
	url: 'https://stream.watsonplatform.net/speech-to-text/api/'
});

/*
//configuracao para o IBM Watson Language translator
const translator = new TranslatorV1({
	authenticator: new IamAuthenticator({ apikey: 'pOh41INmHt83MLUufvGEs07XpWWy2NuLnaNxKmdRvnGv'}),
	version: '2020-05-08',
	url: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/489efbf1-0ef5-4000-ae9a-a024dbabde30'
});
*/

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({apikey: 'pOh41INmHt83MLUufvGEs07XpWWy2NuLnaNxKmdRvnGv'}),
  url: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/489efbf1-0ef5-4000-ae9a-a024dbabde30',
});

module.exports = { assistant, textToSpeech, speechToText, languageTranslator};