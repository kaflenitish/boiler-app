$('#frmNewRecordForm').submit(function() {

    var formOperation = $('#btnSubmitRecord').val();

    if (formOperation == 'Add') {
        addRecord();
        $.mobile.changePage('#pageRecords');
    } else if (formOperation == 'Edit') {
        editRecord($('#btnSubmitRecord').attr('indexToEdit'));
        $.mobile.changePage('#pageRecords');
        $('#btnSubmitRecord').removeAttr('indexToEdit');
    }

    /*Must return false, or else submitting form
     * results in reloading the page
     */
    return false;
});

$('#pageNewRecordForm').on('pageshow', function() {
    //We need to know if we are editing or adding a record everytime we show this page
    //If we are adding a record we show the form with blank inputs
    var formOperation = $('#btnSubmitRecord').val();

    if (formOperation == 'Add') {
        clearRecordForm();
    } else if (formOperation == 'Edit') {
        //If we are editing a record we load the stored data in the form
        showRecordForm($('#btnSubmitRecord').attr('indexToEdit'));
    }
});

function loadUserInformation() {
    try {
        var user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {


        console.log(e);
    }
    if (user != null) {
        $('#divUserSection').empty();
        var today = new Date();

        $('#divUserSection').append(
            "Manufacturer: " +
            user.Manufacturer +
            ' | Date: ' +
            user.DateOfPurchase +
            ' | Boiler: ' +
            user.BoilerID +
            ' | Pressure: ' +
            user.MaxPressure +
            ' | Temperature: ' +
            user.MaxTemperature
        );
        $('#divUserSection').append(
            "<br><a href='#pageUserInfo' data-mini='true' data-role='button' data-icon='edit' data-iconpos='left' data-inline='true' >Edit Profile</a><hr>"
        );
        $('#divUserSection [data-role="button"]').button(); // 'Refresh' the button
    }
}

function clearRecordForm() {
    $('#datExamDate').val('');
    $('#txtPressure').val('');
    $('#txtTemperature').val('');

    return true;
}

function compareDates(a, b) {
    var x = new Date(a.Date);
    var y = new Date(b.Date);

    if (x > y) {
        return 1;
    } else {
        return -1;
    }
}

function listRecords() {
    try {
        var tbRecords = JSON.parse(localStorage.getItem('tbRecords'));
    } catch (e) {

        console.log(e);
    }

    //Load previous records, if they exist
    if (tbRecords != null) {
        //Order the records by date
        tbRecords.sort(compareDates);

        //Initializing the table
        $('#tblRecords').html(
            '<thead>' +
            '   <tr>' +
            '     <th>Date</th>' +
            "     <th><abbr title='Pressure'>Pressure</abbr></th>" +
            "     <th><abbr title='Temperature'>Temperature</abbr></th>" +
            '     <th>Edit / Delete</th>' +
            '   </tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>'
        );

        //Loop to insert the each record in the table
        for (var i = 0; i < tbRecords.length; i++) {
            var rec = tbRecords[i];
            $('#tblRecords tbody').append(
                '<tr>' +
                '  <td>' +
                rec.Date +
                '</td>' +
                '  <td>' +
                rec.Pressure +
                '</td>' +
                '  <td>' +
                rec.Temperature +
                '</td>' +
                "  <td><a data-inline='true'  data-mini='true' data-role='button' href='#pageNewRecordForm' onclick='callEdit(" +
                i +
                ")' data-icon='edit' data-iconpos='notext'></a>" +
                "  <a data-inline='true'  data-mini='true' data-role='button' href='#' onclick='callDelete(" +
                i +
                ")' data-icon='delete' data-iconpos='notext'></a></td>" +
                '</tr>'
            );
        }

        $('#tblRecords [data-role="button"]').button(); // 'Refresh' the buttons. Without this the delete/edit buttons wont appear
    } else {
        tbRecords = []; //If there is no data,set an empty array
        $('#tblRecords').html('');
    }
    return true;
}

function showRecordForm(index) {
    try {
        var tbRecords = JSON.parse(localStorage.getItem('tbRecords'));
        var rec = tbRecords[index];
        $('#datExamDate').val(rec.Date);
        $('#txtPressure').val(rec.Pressure);
        $('#txtTemperature').val(rec.Temperature);
    } catch (e) {


        console.log(e);
    }
}

/* Checks that users have entered all valid info
 * and that the date they have entered is not in
 * the future
 */
function checkRecordForm() {
    //for finding current date
    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var currentDate =
        d.getFullYear() +
        '/' +
        (('' + month).length < 2 ? '0' : '') +
        month +
        '/' +
        (('' + date).length < 2 ? '0' : '') +
        date;

    if (
        $('#txtPressure').val() != '' &&
        $('#datExamDate').val() != '' &&
        $('#datExamDate').val() <= currentDate
    ) {
        return true;
    } else {
        return false;
    }
}

function callEdit(index) {
    $('#btnSubmitRecord').attr('indexToEdit', index);
    /*.button("refresh") function forces jQuery
     * Mobile to refresh the text on the button
     */
    $('#btnSubmitRecord')
        .val('Edit')
        .button('refresh');
}

// Delete the given index and re-display the table
function callDelete(index) {
    deleteRecord(index);
    listRecords();
}
// function to add record
function addRecord() {
    if (checkRecordForm()) {
        var record = {
            Date: $('#datExamDate').val(),
            Pressure: $('#txtPressure').val(),
            Temperature: $('#txtTemperature').val()
        };

        try {
            var tbRecords = JSON.parse(localStorage.getItem('tbRecords'));
            if (tbRecords == null) {
                tbRecords = [];
            }
            tbRecords.push(record);
            tbRecords.sort(compareDates);
            localStorage.setItem('tbRecords', JSON.stringify(tbRecords));
            alert('Saving Information');
            clearRecordForm();
            listRecords();
        } catch (e) {

            console.log(e);
        }
    } else {
        alert('Please complete the form properly.');
    }

    return true;
}
// function to delete record
function deleteRecord(index) {
    try {
        var tbRecords = JSON.parse(localStorage.getItem('tbRecords'));

        tbRecords.splice(index, 1);

        if (tbRecords.length == 0) {
            /* No items left in records, remove entire
             * array from localStorage
             */
            localStorage.removeItem('tbRecords');
        } else {
            localStorage.setItem('tbRecords', JSON.stringify(tbRecords));
        }
    } catch (e) {

        console.log(e);
    }
}
// function to edit record
function editRecord(index) {
    if (checkRecordForm()) {
        try {
            var tbRecords = JSON.parse(localStorage.getItem('tbRecords'));
            tbRecords[index] = {
                Date: $('#datExamDate').val(),
                Pressure: $('#txtPressure').val(),
                Temperature: $('#txtTemperature').val()
            }; //Alter the selected item in the array
            tbRecords.sort(compareDates);
            localStorage.setItem('tbRecords', JSON.stringify(tbRecords)); //Saving array to local storage
            alert('Saving Information');
            clearRecordForm();
            listRecords();
        } catch (e) {

            console.log(e);
        }
    } else {
        alert('Please complete the form properly.');
    }
}


/* The value of the Submit Record button is used
 * to determine which operation should be
 * performed
 */
$('#btnAddRecord').click(function() {
    /*.button("refresh") function forces jQuery
     * Mobile to refresh the text on the button
     */
    $('#btnSubmitRecord')
        .val('Add')
        .button('refresh');
});