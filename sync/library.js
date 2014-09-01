function Library(filesystem, container) {
  this.filesystem = filesystem;
  this.container = container
  this.filesystem.root.getFile('pathing.txt', {create: true, exclusive: true},function(blah){}, function(e){});
  
  var nodes = {};
  this.getListNode = function(path) { 
    return nodes[path]; 
  };
  this.setListNode = function(path, node) { 
    nodes[path] = node; 
  };
  console.log("hi");
  getEntries(filesystem);
  console.log("hih");
  
  function saveFile(blob, path){
    filesystem.root.getFile(path, {create: true, exclusive: true},function(fileEntry){
      
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(e) {
          console.log('Write completed.');
        };
  
        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };
        console.log('What?');
        fileWriter.write(blob);
        console.log('Who?');
        }, function(e){});
    }, function(e){});
    getEntries(filesystem);
  }
  
  document.getElementById('addThisPdf').addEventListener('click', function(){
    //saveFile(PDFView.url);
    //console.log(PDFView.filename);
    var blob = PDFView.getBlob();
    saveFile(blob, PDFView.url);
  });
  
  


  
  
/*
  var tools = createElement('div', {class:'editor-tools'});
  tools.appendChild(createElement('span', {id:'editor-path'}));
  tools.appendChild(createElement(
      'button', {id:'editor-save', class:'button',
                 disabled:true, innerText:'Save'}));
  tools.appendChild(createElement(
      'button', {id:'editor-saveas', class:'button',
                 innerText:'Save As'}));
  tools.appendChild(createElement(
      'button', {id:'editor-new', class:'button',
                 innerText:'New'}));
  this.container.appendChild(tools);

  appendEditor.call(this, createElement('textarea'));

  function appendEditor(editor) {
    this.container.appendChild(editor);
    editor.setAttribute('id', 'editor-content');

    var scratchPath = '* scratch *';
    this.setCurrentPath(scratchPath);
    this.isScratch = function() {
      return ($('#editor-path').innerText == scratchPath);
    };

    $('#editor-new').addEventListener('click', function() {
      this.setContent('');
      this.setCurrentPath(scratchPath);
    }.bind(this));
    $('#editor-save').addEventListener('click', this.save.bind(this));
    $('#editor-saveas').addEventListener('click', this.saveAs.bind(this));
    $('#editor-content').addEventListener('keydown', function() {
      if (!this.isScratch())
        $('#editor-save').disabled = false;
    }.bind(this));
    $('body').addEventListener('keydown', function(e) {
      if (e.keyCode == 27) {
        var dialog = $('.editor-dialog');
        if (dialog) dialog.parentNode.removeChild(dialog);
      }
    });
  };*/
}


function listResults(entries){
  var fragment = document.createDocumentFragment();

  entries.forEach(function(entry, i) {
    var li = document.createElement('li');
    li.innerHTML = ['<span>', entry.name, '</span>'].join('');
    fragment.appendChild(li);
  });
  document.getElementById('filelist').innerHTML = "";
  document.querySelector('#filelist').appendChild(fragment);
}


function getEntries (fs) {
  console.log("1");
  var dirReader = fs.root.createReader();
  var entries = [];
  console.log("2");
  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
    console.log("4");
     dirReader.readEntries (function(results) {
       console.log("5");
      if (!results.length) {
        console.log("6");
        listResults(entries.sort());
      } else {
        console.log("7");
        entries = entries.concat(toArray(results));
        readEntries();
      }
    }, console.log('hihi'));
  };
  console.log("3");
  readEntries(); // Start reading dirs.
  console.log("8");
}


function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}


/*
Editor.prototype.open = function(path) {
  this.filesystem.root.getFile(
      path, {},
      this.load.bind(this),
      error.bind(null, "getFile " + path));
};

Editor.prototype.load = function(entry) {
  log('Opening: ' + entry.fullPath);
  this.fileHasNewData = false;
  this.setCurrentPath(entry.fullPath);
  entry.file(function(file) {
    var reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = function(ev) {
      this.setContent(ev.target.result);
      $('#editor-save').disabled = true;
    }.bind(this);
  }.bind(this), error);
};
*//*
Library.prototype.save = function() {
  if (this.isScratch()) {
    return;
  }
  if (this.fileHasNewData) {
    this.showDialog({
      dialogLabel: 'The file is updated. Do you want to overwrite it?',
      submitLabel: 'Overwrite',
      cancelLabel: 'Cancel',
      submitCallback: function() {
        this.fileHasNewData = false;
        this.save();
      }.bind(this)
    });
    return;
  }
  var path = this.getCurrentPath();
  log('Saving to:' + path);
  this.filesystem.root.getFile(
      path, {create: true},
      function(entry) {
        entry.createWriter(function (writer) {
          writer.truncate(0);
          writer.onerror = error.bind(null, 'writer.truncate');
          writer.onwriteend = function() {
            var content = this.getContent();
            var blob = new Blob([content]);
            var size = content.length;
            writer.write(blob);
            writer.onerror = error;
            writer.onwriteend = this.onSave.bind(this, entry, size);
          }.bind(this);
        }.bind(this));
      }.bind(this));
};

Editor.prototype.saveAs = function() {
  this.showDialog({
    inputLabel: 'Save as: ',
    submitLabel: 'Save',
    cancelLabel: 'Cancel',
    submitCallback: this.onSaveAs.bind(this),
  });
};

Editor.prototype.onSave = function(entry, size) {
  $('#editor-save').disabled = true;
  this.fileHasNewData = false;
  log('File saved: ' + size + ' bytes');
  this.filer.reload();
};

Library.prototype.onSaveAs = function(path) {
  if (!validFileName(path))
    return;
  this.filesystem.root.getFile(
      path, {create: true, exclusive: true},
      function(entry) {
        this.setCurrentPath(entry.fullPath);
        this.save();
      }.bind(this),
      function(e) {
        error('The path already exists.');
        this.saveAs();
      }.bind(this));
};
/*
// dialogOptions {
//   dialogLabel: a string value to be shown at the top of the dialog.
//   inputLabel: a string value to be shown next to the input box.
//   submitLabel: a string value to be shown on the submit button.
//   cancelLabel: a string value to be shown on the cancel button.
//   submitCallback: a callback to be dispatched upon submit.
//   cancelCallback: callback to be dispatched upon cancel.
// }
Editor.prototype.showDialog = function(dialogOptions) {
  dialogOptions.submitCallback = dialogOptions.submitCallback || function() {};
  dialogOptions.cancelCallback = dialogOptions.cancelCallback || function() {};
  var dialog = createElement('div', {class:'editor-dialog'});
  if (dialogOptions.dialogLabel) {
    dialog.appendChild(createElement(
      'div', {innerText: dialogOptions.dialogLabel}));
  }
  var getInputValue = function() { return null; };
  if (dialogOptions.inputLabel) {
    dialog.appendChild(createElement(
      'span', {innerText: dialogOptions.inputLabel}));
    dialog.appendChild(createElement(
      'input', {id:'editor-dialog-input', type:'text', size:40}));
    getInputValue = function() { return $('#editor-dialog-input').value; };
  }
  var buttons = createElement('div', {class:'editor-dialog-buttons'});
  buttons.appendChild(createElement(
    'input', {id:'editor-dialog-submit',
              value:dialogOptions.submitLabel,
              type:'button'}));
  buttons.appendChild(createElement(
    'input', {id:'editor-dialog-cancel',
              value:dialogOptions.cancelLabel,
              type:'button'}));
  dialog.appendChild(buttons);
  this.container.appendChild(dialog);
  if (dialogOptions.inputLabel) {
    $('#editor-dialog-input').focus();
    $('#editor-dialog-input').addEventListener('keydown', function(e) {
      if (e.keyCode == 13) {
        dialogOptions.submitCallback(getInputValue());
        dialog.parentNode.removeChild(dialog);
      }
    }.bind(this));
  }
  $('#editor-dialog-submit').addEventListener('click', function() {
    dialogOptions.submitCallback(getInputValue());
    dialog.parentNode.removeChild(dialog);
  }.bind(this));
  $('#editor-dialog-cancel').addEventListener('click', function() {
    dialogOptions.cancelCallback();
    dialog.parentNode.removeChild(dialog);
  }.bind(this));
};

Editor.prototype.getCurrentPath = function() {
  return $('#editor-path').innerText;
};
/*
Editor.prototype.setCurrentPath = function(path) {
  $('#editor-path').innerText = path;
};

Editor.prototype.getContent = function() {
  return $('#editor-content').value;
}

Editor.prototype.setContent = function(content) {
  $('#editor-content').value = content;
}
*/
