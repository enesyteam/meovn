
var photo_counter = 0;
Dropzone.options.realDropzone = {
    uploadMultiple: false,
    previewsContainer: false,
    parallelUploads: 100,
    createImageThumbnails: false,
    maxFilesize: 2.5,
    addRemoveLinks: true,
    dictDefaultMessage: '',
    // dictFileTooBig: 'Image is bigger than 8MB',
    dictRemoveFileConfirmation: "Are you sure you wish to delete this image?",

    // The setting up of the dropzone
    init:function() {

        var myDropzone = this;

    },
    error: function(file, response) {
    },
    fallback: function(file,response){
        // file.previewElement.    
    },
    success: function(file,response) {
        $('.Me-avatar--large .Avatar-image').attr('src', '/images/profile_images/' + response.filename);
        $('.Me-avatar .Avatar--size40 .Avatar-image').attr('src', '/images/profile_thumbnail/' + response.filename);
    }
}



