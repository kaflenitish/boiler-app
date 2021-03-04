$('#frmUserForm').submit(function(){
    saveUserForm();
    return true;
});

function saveUserForm(){
    var user={
        Manufacturer: $('#txtManufacturer').val(),
        BoilerID: $('#txtBoilerID').val(),
        NewPassword: $('#changePassword'),
        DateOfPurchase: $('#datPurchaseDate').val(),
        MaxPressure: $('#txtMaxPressure').val(),
        MaxTemperature: $('#txtMaxTemperature').val()
    }

    try{
        localStorage.setItem('user', JSON.stringify(user));
        alert('Saving Information');
        $.mobile.changePage('#pageMenu');
        window.location.reload();
    }
    catch(e){
        console.log(e);
    }
}

function showUserForm(){
    try{
        var user=JSON.parse(localStorage.getItem('user'));
    }
    catch(e){
        console.log(e);
    }

    if (user != null){
        $('#txtManufacturer').val(user.Manufacturer);
        $('#txtBoilerID').val(user.BoilerID);
        $('#changePassword').val(user.NewPassword);
        $('#datPurchaseDate').val(user.DateOfPurchase);
        $('#txtMaxPressure').val(user.MaxPressure);
        $('#txtMaxTemperature').val(user.MaxTemperature);
    }
}