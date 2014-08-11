var supportsSyncFileSystem = chrome && chrome.syncFileSystem;

document.addEventListener(
  'DOMContentLoaded',
  function() {
    if (supportsSyncFileSystem){
      console.log("Sync File system supported.");
      openSyncableFileSystem();
    }
    else
    {
      console.log("Sync File system NOT supported.");
      openTemporaryFileSystem();
    }
  }
);

function onFileSystemOpened(fs, isSyncable) {
  console.log('Got Syncable FileSystem.');
  console.log('Got FileSystem:' + fs.name);
  var library = new Library(fs, 'libraryContainer');

  
}

function openTemporaryFileSystem() {

  hide('#conflict-policy')
  webkitRequestFileSystem(TEMPORARY, 1024,
                          onFileSystemOpened,
                          error.bind(null, 'requestFileSystem'));
}

function openSyncableFileSystem() {
  console.log('Here now');
  if (!chrome || !chrome.syncFileSystem ||
      !chrome.syncFileSystem.requestFileSystem) {
    console.log('Syncable FileSystem is not supported in your environment.');
    return;
  }


  console.log('Obtaining syncable FileSystem...');
  chrome.syncFileSystem.requestFileSystem(function (fs) {
    if (chrome.runtime.lastError) {
      console.log('requestFileSystem: ' + chrome.runtime.lastError.message);
      return;
    }
    onFileSystemOpened(fs, true);
  });
  
}


