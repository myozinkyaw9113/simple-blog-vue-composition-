const defaultSetting = {};
defaultSetting.mainHostUrl = "http://hr_api.test/api";
let token = '';

defaultSetting.requestHeader = {
    Accept: "application/json",
    "Content-Type": "application/json",
    // "X-API-TOKEN": "6c83c7a07d8d672b8b3acee09c26b883",
    Authorization: `Bearer ${token}`
};
defaultSetting.fileRequestHeader = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    // "X-API-TOKEN": "6c83c7a07d8d672b8b3acee09c26b883",
    Authorization: `Bearer ${token}`
};
export default defaultSetting;
