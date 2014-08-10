function webViewerInitialized() {
  var params = PDFView.parseQueryString(document.location.search.substring(1));
  var file = 'file' in params ? params.file : DEFAULT_URL;

  var fileInput = document.createElement('input');
  fileInput.id = 'fileInput';
  fileInput.className = 'fileInput';
  fileInput.setAttribute('type', 'file');
  fileInput.oncontextmenu = noContextMenuHandler;
  document.body.appendChild(fileInput);

  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    document.getElementById('openFile').setAttribute('hidden', 'true');
    document.getElementById('secondaryOpenFile').setAttribute('hidden', 'true');
  } else {
    document.getElementById('fileInput').value = null;
  }

  // Special debugging flags in the hash section of the URL.
  var hash = document.location.hash.substring(1);
  var hashParams = PDFView.parseQueryString(hash);

  if ('disableWorker' in hashParams) {
    PDFJS.disableWorker = (hashParams['disableWorker'] === 'true');
  }

  if ('disableRange' in hashParams) {
    PDFJS.disableRange = (hashParams['disableRange'] === 'true');
  }

  if ('disableAutoFetch' in hashParams) {
    PDFJS.disableAutoFetch = (hashParams['disableAutoFetch'] === 'true');
  }

  if ('disableFontFace' in hashParams) {
    PDFJS.disableFontFace = (hashParams['disableFontFace'] === 'true');
  }

  if ('disableHistory' in hashParams) {
    PDFJS.disableHistory = (hashParams['disableHistory'] === 'true');
  }

  if ('webgl' in hashParams) {
    PDFJS.disableWebGL = (hashParams['webgl'] !== 'true');
  }

  if ('useOnlyCssZoom' in hashParams) {
    PDFJS.useOnlyCssZoom = (hashParams['useOnlyCssZoom'] === 'true');
  }

  if ('verbosity' in hashParams) {
    PDFJS.verbosity = hashParams['verbosity'] | 0;
  }

  if ('ignoreCurrentPositionOnZoom' in hashParams) {
    IGNORE_CURRENT_POSITION_ON_ZOOM =
      (hashParams['ignoreCurrentPositionOnZoom'] === 'true');
  }



  var locale = PDFJS.locale || navigator.language;
  if ('locale' in hashParams) {
    locale = hashParams['locale'];
  }
  mozL10n.setLanguage(locale);

  if ('textLayer' in hashParams) {
    switch (hashParams['textLayer']) {
      case 'off':
        PDFJS.disableTextLayer = true;
        break;
      case 'visible':
      case 'shadow':
      case 'hover':
        var viewer = document.getElementById('viewer');
        viewer.classList.add('textLayer-' + hashParams['textLayer']);
        break;
    }
  }

  if ('pdfBug' in hashParams) {
    PDFJS.pdfBug = true;
    var pdfBug = hashParams['pdfBug'];
    var enabled = pdfBug.split(',');
    PDFBug.enable(enabled);
    PDFBug.init();
  }

  if (!PDFView.supportsPrinting) {
    document.getElementById('print').classList.add('hidden');
    document.getElementById('secondaryPrint').classList.add('hidden');
  }

  if (!PDFView.supportsFullscreen) {
    document.getElementById('presentationMode').classList.add('hidden');
    document.getElementById('secondaryPresentationMode').
      classList.add('hidden');
  }

  if (PDFView.supportsIntegratedFind) {
    document.getElementById('viewFind').classList.add('hidden');
  }

  // Listen for unsuporrted features to trigger the fallback UI.
  PDFJS.UnsupportedManager.listen(PDFView.fallback.bind(PDFView));

  // Suppress context menus for some controls
  document.getElementById('scaleSelect').oncontextmenu = noContextMenuHandler;

  var mainContainer = document.getElementById('mainContainer');
  var outerContainer = document.getElementById('outerContainer');
  mainContainer.addEventListener('transitionend', function(e) {
    if (e.target == mainContainer) {
      var event = document.createEvent('UIEvents');
      event.initUIEvent('resize', false, false, window, 0);
      window.dispatchEvent(event);
      outerContainer.classList.remove('sidebarMoving');
    }
  }, true);

  document.getElementById('sidebarToggle').addEventListener('click',
    function() {
      this.classList.toggle('toggled');
      outerContainer.classList.add('sidebarMoving');
      outerContainer.classList.toggle('sidebarOpen');
      PDFView.sidebarOpen = outerContainer.classList.contains('sidebarOpen');
      PDFView.renderHighestPriority();
    });

  document.getElementById('viewThumbnail').addEventListener('click',
    function() {
      PDFView.switchSidebarView('thumbs');
    });

  document.getElementById('viewOutline').addEventListener('click',
    function() {
      PDFView.switchSidebarView('outline');
    });

  document.getElementById('viewAttachments').addEventListener('click',
    function() {
      PDFView.switchSidebarView('attachments');
    });

  document.getElementById('previous').addEventListener('click',
    function() {
      PDFView.page--;
    });

  document.getElementById('next').addEventListener('click',
    function() {
      PDFView.page++;
    });

  document.getElementById('zoomIn').addEventListener('click',
    function() {
      PDFView.zoomIn();
    });

  document.getElementById('zoomOut').addEventListener('click',
    function() {
      PDFView.zoomOut();
    });

  document.getElementById('pageNumber').addEventListener('click',
    function() {
      this.select();
    });

  document.getElementById('pageNumber').addEventListener('change',
    function() {
      // Handle the user inputting a floating point number.
      PDFView.page = (this.value | 0);

      if (this.value !== (this.value | 0).toString()) {
        this.value = PDFView.page;
      }
    });

  document.getElementById('scaleSelect').addEventListener('change',
    function() {
      PDFView.setScale(this.value);
    });

  document.getElementById('presentationMode').addEventListener('click',
    SecondaryToolbar.presentationModeClick.bind(SecondaryToolbar));

  document.getElementById('openFile').addEventListener('click',
    SecondaryToolbar.openFileClick.bind(SecondaryToolbar));

  document.getElementById('print').addEventListener('click',
    SecondaryToolbar.printClick.bind(SecondaryToolbar));

  document.getElementById('download').addEventListener('click',
    SecondaryToolbar.downloadClick.bind(SecondaryToolbar));


  if (file) {
    PDFView.open(file, 0);
  }
}