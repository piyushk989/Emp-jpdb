const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const dbName = "Emp";
const relName = "Emp-Rel";
const token = "90934760|-31949208985523414|90955990";

// Save record number to local storage
const saveRecNo2LS = (resJson) => {
    const lvData = JSON.parse(resJson.data);
    localStorage.setItem("recno", lvData.rec_no);
};

// Get input as JSON object
const getRollNoAsJsonObj = () => {
    const roll = $("#Number").val();
    return JSON.stringify({ Number: parseInt(roll) });
};

// Fill data in form fields
const fillData = (resJson) => {
    saveRecNo2LS(resJson);
    const data = JSON.parse(resJson.data).record;
    $("#name").val(data.name);
    $("#email").val(data.email);
    $("#Number").val(data.Number);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#name").focus();
};

// Fetch data based on ID
const getEmployee = () => {
    const rollJsonObj = getRollNoAsJsonObj();
    const getRequest = createGET_BY_KEYRequest(token, dbName, relName, rollJsonObj);
    jQuery.ajaxSetup({ async: false });
    const resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#name").focus();
    } else if (resJsonObj.status === 200) {
        fillData(resJsonObj);
    }
};

// Validate form data before sending
const validateData = () => {
    const number = $("#Number").val();
    const name = $("#name").val();
    const email = $("#email").val();

    if (!number) {
        alert("Number (ID) is missing");
        $("#Number").focus();
        return "";
    }

    if (!name) {
        alert("Name is missing");
        $("#name").focus();
        return "";
    }

    if (!email) {
        alert("Email is missing");
        $("#email").focus();
        return "";
    }

    const jsonStrObj = {
        Number: parseInt(number),
        name: name,
        email: email
    };

    return JSON.stringify(jsonStrObj);
};

// Save data to JPDB
const saveData = () => {
    const jsonStr = validateData();
    if (jsonStr === "") return;

    const putReqStr = createPUTRequest(token, jsonStr, dbName, relName);
    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#Number").focus();
};

// Change existing record
const changeData = () => {
    $("#change").prop("disabled", true);
    const jsonStr = validateData();
    if (jsonStr === "") return;

    const updateRequest = createUPDATERecordRequest(token, jsonStr, dbName, relName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#Number").focus();
};

// Reset the form
const resetForm = () => {
    $("#Number").val("");
    $("#name").val("");
    $("#email").val("");
    $("#Number").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
};
