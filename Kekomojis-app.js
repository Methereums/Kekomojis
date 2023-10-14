// Kekomojis - 2023 | Metabytes <3


// ----- COMPROBAR SI LAS PREFERENCIAS DEL USUARIO ESTÁN DISPONIBLES  -----

function getAllStorageData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });
}




// ----- COMPROBAR LAS EXCEPCIONES PRIMERO ANTES DE EJECUTAR  -----

var currentURL = window.location.href;

function checkForExceptionsFirst() {

    if (['.js','.xml','.svg'].some(char => currentURL.endsWith(char))) {
        console.log(window.location.href);
		return 0 ;
    }
	
    if (currentURL.includes('twitter.com')) {
        console.log(window.location.href);
		return 0 ;		
    }
	
    if (currentURL.includes('youtube.com/shorts')) {
        console.log(window.location.href);
		return 0 ;		
    }
	
    if (currentURL.includes('ShowThisPageWithoutEmojiExtension')) {
        console.log(window.location.href);
		return 0 ;		
    }	

}



function checkForURLexceptions(URLfrOptions) {

	var x;
	URLfrOptions.forEach( (element) => {
    	if (currentURL.includes( element )) {
        console.log(window.location.href + ' está en la lista de exclusión de Kekomojis.');
		x = 0 ;
		return x ; 
		}
		});
	return x;		
}



function twemojify( CDNfrOptions ) {

var cdn;
switch( CDNfrOptions *1 ) {
  case 0:
    cdn = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/";
    break;
  case 1:
    cdn = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/";
    break;
  case 2:
    cdn = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/";
    break;	
  default:
    cdn = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/";
  }


    if (currentURL.includes('youtube.com')) {
        RunOnYTpagesOnly( cdn );
		return;
    }

    twemoji.parse(document.body, {
		base: cdn,
        className: 'ext-emoji',
        folder: 'svg',
        ext: '.svg'
    });

};




// ----- CARGA DE ESTILOS PARA PÁGINAS NORMALES -----

function styleForNormalPages() {

    try {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
		style.setAttribute('id','twemojiStyleNP');
        style.innerHTML = `/* twemoji styles */
	img.ext-emoji, .small-emoji {
		height: 1em;
		width: 1em;
		margin: 0 .05em 0 .1em;
		vertical-align: -0.1em;
		display: inline-block;
		border: none !important;
	}`;
      if( !document.getElementById('twemojiStyleNP') ) { head.appendChild(style); }  
    } catch {
        console.log('No se encontró la etiqueta <head>.');
		return;
    }

}





// ----- INICIO DEL SCRIPT PARA YOUTUBE -----

function RunOnYTpagesOnly( cdn ) {
	
	
// Agregar <style> al <head>
var head = document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.setAttribute('id','twemojiStyleYT');
style.innerHTML = `/* twemoji styles */
img.ext-emoji, .small-emoji, .emoji {
    height: 1em !important;
    width: 1em !important;
    margin: 0 .05em 0 .1em;
    vertical-align: -0.1em;
    padding: 0px 4px 0px 4px;
    display: inline-block;
	content-visibility: auto;
}
.twemojified {
   color: var(--yt-spec-text-primary);
   white-space: pre-wrap;
   font-size: 1.4rem;
   line-height: 2rem;
}
h1 .twemojified, a[id="video-title"] .twemojified {
   font-size: 18px;
}
.TWEclass, yt-formatted-string[id="description-text"] + .twemojified, .metadata-snippet-container .twemojified {
    display: none !important;
}`;

if( !document.getElementById('twemojiStyleYT') ) { head.appendChild(style); }
currentURL = window.location.href;




// Deshacer todos los cambios anteriores, si los hay
function TweDelete() {
	try {
		document.querySelectorAll('.twemojified')
			.forEach(e => e.remove());
		document.querySelectorAll('h1 .twemojified')
			.forEach(e => e.remove());
		document.querySelectorAll('.TWEclass')
			.forEach(e => e.classList.remove('TWEclass')); 
	} catch (error) {
		console.error(error);
	}   
}

	
// Convertir el texto original y ocultar los antiguos
   function TweParse() {
        TweDelete(); 
        document.querySelectorAll('.small-emoji')
            .forEach(e => e.removeAttribute("alt"));
        document.querySelectorAll('.emoji')
            .forEach(e => e.removeAttribute("alt"));
			
			
        var imgB = document.getElementsByTagName('yt-formatted-string');
		var load = imgB.length;
        
		for (var i = 0; i < load; i++) {
            
		// Copiar y convertir originales en un nuevo <span>, luego ocultar el contenedor de texto original
            if (twemoji.test(imgB[i].innerText)) {

				if ( imgB[i].classList == 'TWEclass' ) { continue; }
                imgB[i].classList.add('TWEclass');
                //document.querySelectorAll('.ext-emoji').forEach(e => e.removeAttribute("alt"));

                var Updated = twemoji.parse(imgB[i].innerHTML, {
					base: cdn,
                    className: 'ext-emoji',
                    folder: 'svg',
                    ext: '.svg'
                });
				
                imgB[i].insertAdjacentHTML("afterend", "<span class=twemojified>" + Updated + "</span>");
            }
        }
    }
    // Ejecutar en la primera carga
    function RunTwemoji() {
		setTimeout( TweParse, 2000 );
    }

    function DelTwemoji() {
        TweDelete();
		setTimeout( TweDelete, 1500 );
    }
    window.onscroll = function () {
        RunTwemoji();
    };
    // Ejecutar cada vez que el usuario navegue a una nueva página de YouTube
    document.addEventListener('yt-navigate-finish', function (event) {
        RunTwemoji();
    });
    document.addEventListener('yt-navigate-start', function (event) {
        DelTwemoji();
        location.reload();
		return false;
    });
    // Fin del script para YouTube
}





// ----- LÓGICA PARA EL DIÁLOGO DE OPCIONES FLOTANTE -----

// Variables declaradas
var inputValues, demoClasses, oldSize, newSize, sizeA, sizeB;

// Cambiar el tamaño de los emojis

function changeSize( inputValues ) {

	demoClasses = document.querySelectorAll('.ext-emoji');
	if (!demoClasses) { return; }

	// Obtener el valor que se colocó en el <input> o casilla
	inputValues = document.getElementById("twemojiNewSize").value;
	inputValues = Number(inputValues);

	if( document.getElementById('twemojiStyleB') ) {
		document.getElementById('twemojiStyleB').remove();
		}

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
	style.setAttribute('id','twemojiStyleB');
    style.innerHTML = "img.ext-emoji, .emoji.small-emoji, .small-emoji {height: "
	                   + inputValues
	                   + "em !important;width: "
	                   + inputValues + "em !important;}";
    head.appendChild(style);

}


function createOptionsBox( sizeInOption, CDNfrOptions ) {

	var optionContent ='<div id="twemojiContainer"><div id="logo"><center><img src="https://kekocity.com/uploads/02/8/4/9/4/8849470cb17dd9e0f508bc47b409bb6f.png" /></center></div><div id="twemojiSizeChanger"><b id="twemojiLabel">Emoji: </b> <input id="twemojiNewSize" type="number" step="0.01" value="1.00"></div><br><button id="twemojiButton" data-title="Convertir todos los emojis visibles en Kekomojis">¡Kekomojify!</button><button id="disableButton" data-title="Ver la actual página sin Kekomojis">Ver original</button><button id="gotoOptionsPage" data-title="Hacer cambios permanentes">Ir a Opciones</button><button id="readHelp" data-title="Leer el archivo de ayuda">Ayuda</button><button id="gotoCreditsPage" data-title="Ver los créditos y agradecimientos por el desarrollo de Kekomojis">Créditos</button><button id="gotoInfoPage" data-title="Ver la información acerca de Kekomojis">Acerca de...</button><div id="twemojiWarning">Cambios desde aquí son temporales y para esta pestaña.</div><div id="twemojiClose">&times;</div></div>';

	const options = document.createElement("div");
	options.innerHTML = optionContent;
	options.setAttribute('id','twemojiOptions');
	options.setAttribute('class','twemojioptions twemojiHidden');
	document.body.appendChild(options);

 document.getElementById("twemojiButton")
         .addEventListener("click", function () { styleForNormalPages(); twemojify( CDNfrOptions ); });

 document.getElementById("twemojiClose")
         .addEventListener("click", function () {
		  var element = document.getElementById("twemojiOptions");
		  element.classList.toggle("twemojiHidden");
		 });

 document.getElementById("twemojiNewSize")
         .addEventListener("click", function () {
		  changeSize( inputValues );
		  });

 document.getElementById("twemojiNewSize")
         .addEventListener("blur", function () {
		  changeSize( inputValues );
		  });
		  
 document.getElementById("twemojiNewSize")
         .addEventListener("keypress", function () {
		  if (event.key === "Enter") {
				  changeSize( inputValues );
		  }
		  });

 document.getElementById("disableButton")
         .addEventListener("click", function () {
		  if ( confirm('\nEsto abre la página actual en una nueva pestaña con la extensión deshabilitada, lo que facilita la comparación de cómo la extensión cambia las imágenes y el diseño de la página. \n\n¿Continuar?') ) {	 
		  window.open( currentURL + '?_ShowThisPageWithoutEmojiExtension','_blank');
		  } else { console.log('Acción Cancelada.') };
		  });
		  
 document.getElementById('gotoOptionsPage')
         .addEventListener('click', function() {
		  if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		  } else {
			window.open(chrome.runtime.getURL('o_Options.html'));
		  }
		  });

 document.getElementById('readHelp')
         .addEventListener('click', function() {
		  if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		  } else {
			window.open(chrome.runtime.getURL('o_Help.html'));
		  }
		  });
 document.getElementById('gotoCreditsPage')
         .addEventListener('click', function() {
		  if (chrome.runtime.openCreditsPage) {
			chrome.runtime.openCreditsPage();
		  } else {
			window.open(chrome.runtime.getURL('o_Credits.html'));
		  }
		  });
 document.getElementById('gotoInfoPage')
         .addEventListener('click', function() {
		  if (chrome.runtime.openInfoPage) {
			chrome.runtime.openInfoPage();
		  } else {
			window.open(chrome.runtime.getURL('o_About.html'));
		  }
		  });
		  
 document.getElementById("twemojiNewSize").value = sizeInOption;
 
}




// ----- EJECUTAR CUANDO SE CARGUE LA PÁGINA -----

function firstRun() {

const initStorageCache = getAllStorageData().then(items => {

try {
		sizeInOption = items['size'];
		CDNfrOptions = items['CDNs'];
		URLfrOptions = items['URLs'].split(/\r?\n/);
		} 
catch   {
		sizeInOption = 1 ;
		CDNfrOptions = 0 ;
		URLfrOptions = ['twitter.com']; 
	}


if( checkForExceptionsFirst() === 0 ) { return; };
if( checkForURLexceptions(URLfrOptions) === 0 ) { return; };


	 // Agregar estilos primero
     styleForNormalPages(); 

	// Inicializar después de cargar la página
	window.addEventListener('DOMContentLoaded', (event) => {
		styleForNormalPages();
		twemojify( CDNfrOptions ); 
		createOptionsBox( sizeInOption, CDNfrOptions );
		changeSize( sizeInOption ); 

		try {

			// Ejecutar cuando se actualice algo en la página
			var observer = new MutationObserver(function (mutations) {
				twemojify( CDNfrOptions );
			});
			observer.observe(document.body, {
				subtree: true,
				childList: true
				});
			}
			
		catch(e) { console.log(e);  }
	
	});

});

}

firstRun();