function addValueToPassword(button){
    var currVal=$('#passcode').val();
    if(button=='bksp'){
        $('#passcode').val(currVal.substring(0,currVal.length - 1));
    }else{
        $('#passcode').val(currVal.concat(button));
    }
}

function getPassword(){
    if(typeof Storage=='undefined'){
        alert("Not supported by the browser");
    }else if(localStorage.getItem('user')!=null){
        return JSON.parse(localStorage.getItem('user')).NewPassword;
    }else{
        return '2345';
    }
}

$('#btnEnter').click(function(){
    var password=getPassword();
    if(document.getElementById('passcode').value==password){
        $('#btnEnter').attr('href','#pageMenu').button();
    } else {
        alert('Incorrect Password!');
    }
});
