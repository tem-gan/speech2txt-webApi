//languages
/*
var langs = [
  [
    "English",
    ["en-AU", "Australia"],
    ["en-CA", "Canada"],
    ["en-IN", "India"],
    ["en-NZ", "New Zealand"],
    ["en-ZA", "South Africa"],
    ["en-GB", "United Kingdom"],
    ["en-US", "United States"],
  ],
  [
    "Español",
    ["es-AR", "Argentina"],
    ["es-BO", "Bolivia"],
    ["es-CL", "Chile"],
    ["es-CO", "Colombia"],
    ["es-CR", "Costa Rica"],
    ["es-EC", "Ecuador"],
    ["es-SV", "El Salvador"],
    ["es-ES", "España"],
    ["es-US", "Estados Unidos"],
    ["es-GT", "Guatemala"],
    ["es-HN", "Honduras"],
    ["es-MX", "México"],
    ["es-NI", "Nicaragua"],
    ["es-PA", "Panamá"],
    ["es-PY", "Paraguay"],
    ["es-PE", "Perú"],
    ["es-PR", "Puerto Rico"],
    ["es-DO", "República Dominicana"],
    ["es-UY", "Uruguay"],
    ["es-VE", "Venezuela"],
  ],
  ["Français", ["fr-FR"]],
  ["Italiano", ["it-IT", "Italia"], ["it-CH", "Svizzera"]],
  ["Português", ["pt-BR", "Brasil"], ["pt-PT", "Portugal"]],
  ["日本語", ["ja-JP"]],
  ["Lingua latīna", ["la"]],
];
*/
//HTML element declarations
var button = document.getElementById("start_button");
var info = document.getElementById("info");
var final_span = document.getElementById("final_span");
var interim_span = document.getElementById("interim_span");
//variable declarations
var final_transcript = "";
var recognizing = false;
var ignore_onend: boolean;
var start_timestamp: number;

  //checks if webkitSpeechRecognition is compatible with current browser
  if (!("webkitSpeechRecognition" in window)||(webkitSpeechRecognition==null)) {
    //hides mic button if not compatible
    upgrade();
    //else shows button and initializes speechrecognition api
  } else {
    var webkitSpeechRecognition: any;
    if (button) {
      button.style.display = "inline-block";
    }

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    //recognizer on start handler
    recognition.onstart = function () {
      recognizing = true;
      showInfo("info_speak_now");
    };
    //recognizer error handler
    recognition.onerror = function (event: SpeechRecognitionError) {
      if (button) {
        button.classList.remove("start_button_pulse");
        button.classList.add("start_button_default");
      }
      if (event.error == "no-speech") {
        showInfo("info_no_speech");
      }
      if (event.error == "audio-capture") {
        showInfo("info_no_microphone");
      }
      if (event.error == "not-allowed") {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo("info_blocked");
        } else {
          showInfo("info_denied");
        }
      }
      ignore_onend = true;
    };
    //recognizer on stop handler
    recognition.onend = function () {
      recognizing = false;
      if (ignore_onend) {
        return;
      }

      if (!final_transcript) {
        //  showInfo('info_start');
        return;
      }
      showInfo("");
    };
    //recognizer transcript result handler
    recognition.onresult = function (event: SpeechRecognitionEvent) {
      var interim_transcript = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      if (final_span) {
        final_span.innerHTML = linebreak(final_transcript);
      }
      if (interim_span) {
        interim_span.innerHTML = linebreak(interim_transcript);
      }
    };
  }

/*
  OnClick Handler function (start/stop recognizer and button styles)
*/
  function startButton(event: MouseEvent) {
    if (recognizing) {
      recognition.stop();
      showInfo("");
      if (button) {
        button.classList.remove("start_button_pulse");
        button.classList.add("start_button_default");
      }
      return;
    }
    final_transcript = "";
    //language is currently hardcoded to english
    recognition.lang = "en-US";
    recognition.start();
    ignore_onend = false;
    if (final_span) {
      final_span.innerHTML = "";
    }
    if (interim_span) {
      interim_span.innerHTML = "";
    }
  
    showInfo("info_allow");
    start_timestamp = event.timeStamp;
    if (button) {
      button.classList.add("start_button_pulse");
    }
  }
/*
    Helper functions
*/
//hide button when speechrecognition api is not compatible with the browser
function upgrade() {
  if (button) {
    button.style.visibility = "hidden";
  }
  showInfo("info_upgrade");
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s: string) {
  return s.replace(two_line, "<p></p>").replace(one_line, "<br>");
}

var first_char = /\S/;

function capitalize(s: string) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}

//Function for showing the appropriate feedback at an event
function showInfo(s: string) {
  if (s && info) {
    for (
      var child = info.firstChild as HTMLElement;
      child;
      child = child.nextSibling as HTMLElement
    ) {
      if (child.style) {
        child.style.display = child.id == s ? "inline" : "none";
      }
    }
    info.style.visibility = "visible";
  } else {
    if (info) {
      info.style.visibility = "hidden";
    }
  }
}

/* CHANGE LANGUAGE OF RECOGNIZER(May use in the future)
   for (var i = 0; i < langs.length; i++) {
     select_language.options[i] = new Option(langs[i][0], i);
   }
   select_language.selectedIndex = 6;
   updateCountry();
   select_dialect.selectedIndex = 6;
   showInfo('info_start');

   function updateCountry() {
     for (var i = select_dialect.options.length - 1; i >= 0; i--) {
       select_dialect.remove(i);
     }
     var list = langs[select_language.selectedIndex];
     for (var i = 1; i < list.length; i++) {
       select_dialect.options.add(new Option(list[i][1], list[i][0]));
     }
     select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
   }

   */
