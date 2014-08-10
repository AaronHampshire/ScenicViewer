/*
Copyright 2012 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Eric Bidelman (ericbidelman@chromium.org)
Updated: Joe Marini (joemarini@google.com)
*/

var chosenEntry = null;
var chooseFileButton = document.querySelector('#choose_file');
var printPath = document.querySelector('#file_path');
var textarea = document.querySelector('#textarea');
var path;
function errorHandler(e) {
  console.error(e);
}



function readAsText(fileEntry, callback) {
  fileEntry.file(function(file) {
    var reader = new FileReader();

    reader.onerror = errorHandler;
    reader.onload = function(e) {
      callback(e.target.result);
    };

    reader.readAsText(file);
  });
}

// for files, read the text content into the textarea
function loadFileEntry(_chosenEntry) {
  chosenEntry = _chosenEntry;
  console.log(chosenEntry.fullPath);
  PDFJS.getDocument(chosenEntry.fullPath).then(function(pdf) {

    // Using promise to fetch the page
    pdf.getPage(1).then(function(page) {
      var scale = 1.5;
      var viewport = page.getViewport(scale);
  
      //
      // Prepare canvas using PDF page dimensions
      //
      var canvas = document.getElementById('the-canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      //
      // Render PDF page into canvas context
      //
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  });
  /*
  chosenEntry.file(function(file) {
    readAsText(chosenEntry, function(result) {
      textarea.innerHTML = result;
    });
    displayEntryData(chosenEntry);
  });
  */
}

chooseFileButton.addEventListener('click', function(e) {
  var accepts = [{
    mimeTypes: ['text/*'],
    extensions: ['js', 'css', 'txt', 'html', 'xml', 'tsv', 'csv', 'rtf']
  }];
  //webViewerInitialized();

  chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function(theEntry) {
    if (!theEntry) {
      console.log('No file selected.');
      return;
    }
    // use local storage to retain access to this file
    chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
    
    chrome.fileSystem.getDisplayPath(theEntry, function(displaypath){
      path = displaypath;
      printPath.innerHTML = path;
    });
    
  
    chrome.storage.local.get('chosenFile',function(result){
      
      var url = PDFJS.createBlob(result);
      console.log(url);
      loadFileEntry(url);
      
      //console output = {myTestVar:'my test var'}
    })
    
    //loadPDF(theEntry);
  
  });
});


function loadPDF(_file){
  //var file = _file;
  var pdfFile = '~/D/hw5.pdf';
 chrome.fileSystem.getDisplayPath(_file, function(displaypath){
      console.log(displaypath);
    });
    
  
}

