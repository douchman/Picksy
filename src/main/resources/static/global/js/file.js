export function generateFilePreviewURL(file, callback){
    if(!file) {
       return;
    }
    if ( file ){
        const reader = new FileReader();

        reader.onload = function(e){
            callback(e.target.result);
        }

        reader.readAsDataURL(file);
    }
}