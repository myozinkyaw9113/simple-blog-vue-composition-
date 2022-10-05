import { router } from "Resources/plugins/vue-router";
import store from "Resources/store";
import ConstantKeys from "Resources/config/constants";
import { except_route } from "Resources/config/route";
import rank from "Resources/config/rank";
import routePreset from "Resources/config/route";
import { getMessage } from "../plugins/i18n";

import core_helper from '../../../core/resources/js/util/util';

const config = {
    SEARCH_ALGO: 'normal'
};

const cloneJson = json => {

    if(!json){
        return json;
    }

    return JSON.parse(JSON.stringify(json));
};

const isJson = str => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};

const implodeArray = (data) => {
    return data.map((item) => item).join(",");
};

const num = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    0: "0",
    "၁": "1",
    "၂": "2",
    "၃": "3",
    "၄": "4",
    "၅": "5",
    "၆": "6",
    "၇": "7",
    "၈": "8",
    "၉": "9",
    "၀": "0",
    ".": ".",
};

const transPaginate = (data) => {
    let numArr = String(data).split('');
    numArr = numArr.map((i) => num[i]);
    return parseInt(numArr.join(''));
};


// const splitMultiple = core_helper.splitMultiple;

const splitMultiple = (str, arr) => {
    if (!str || arr.length == 0) {
        console.warn("splitMultiple invalid string ", str, arr);
        return [];
    }

    if (arr.length > 1) {
        return splitMultiple(str.split(arr.shift()).join(","), arr);
    }

    return str
        .split(arr.shift())
        .filter(item => item)
        .join(",")
        .split(",");
};

const getServiceFeeName = services_name => {
    // get service fee name by service name
    let services_fee_name = ConstantKeys.enum_services_matcher[services_name];
    return services_fee_name;
};

const getServiceName = service_fee_name => {
    let keys = Object.keys(ConstantKeys.enum_services_matcher);
    let result = "";
    var BreakException = {};

    try {
        keys.forEach(service_name => {
            if (
                ConstantKeys.enum_services_matcher[service_name] ===
                service_fee_name
            ) {
                result = service_name;
                throw BreakException;
            }
        });
    } catch (e) {
        console.warn(e);
    }

    return result;
};

const parseJson = json => {
    if (isJson(json)) {
        return JSON.parse(json);
    }

    return json;
};

const castToString = val => {
    return val + "";
};

// list, keyToSearch, pointOfObjectKey
const search = (hay, needle, key, strict, algo = config.SEARCH_ALGO) => {

    if (!Array.isArray(hay) || !needle || !key) {
        return null;
    }
    //split key word as letter array
    let charNeedleList = castToString(needle).toLowerCase().split("");

    // loop array to take out individual object
    hay = hay.filter(item => {
        // take out value from object by using pointOfObjectKey

        let valueGotByNestedKey = getNestedValue(key, item);

        if (!valueGotByNestedKey) {
            return null;
        }

        let currentWord = castToString(valueGotByNestedKey)
            .toLowerCase()
            .split("");

        let status = false;

        if(algo == 'smart'){
            status = smartSearchAlgo(charNeedleList, currentWord, strict);
        }
        else{
            status = normalSearchAlgo(charNeedleList, currentWord, strict);
        }


        return status;
    });

    return hay;
};

const smartSearchAlgo = (charNeedleList, currentWord, strict) => {
    let status = false;

    for (var i = 0; i < charNeedleList.length; i++) {
        let charN = charNeedleList[i];
        let ini = currentWord.indexOf(charN);

        if (ini > -1) {
            if (i === charNeedleList.length - 1) {
                if (strict) {
                    status =
                        castToString(currentWord).length ===
                        charNeedleList.length;
                } else {
                    status = true;
                }
            }
            currentWord = currentWord.slice(ini + 1);
        } else {
            break;
        }
    }

    return status;
};

const normalSearchAlgo = (charNeedleList, currentWord, strict) => {

    let status = false;

    for (var i = 0; i < charNeedleList.length; i++) {

        let currentNeedle = charNeedleList[i];
        let currentChar = currentWord[i];

        if (currentNeedle == currentChar) {
            if (i === charNeedleList.length - 1) {
                if (strict) {
                    status = castToString(currentWord).length === charNeedleList.length;
                } else {
                    status = true;
                }
            }
        }
        else{
            break;
        }
    }

    return status;
};


const filterListByCallback = (list, key, value = null) => {
    if (!Array.isArray(list) || !key) {
        console.warn("filterLIsByCallback Invalid Params");
        return list;
    }

    return list.filter(item => {
        return item[key] != value;
    });
};

//get date
const gd = (year, month, day) => {
    return new Date(year, month, day).getTime();
};

const avatarImg = img => {
    $(img)
        .on("load", function() {            $(img).show();
            $(img)
                .siblings(".avatar")
                .remove(); // clear previous avatar
        })
        .on("error", function() {
            // console.error("error loading image", img.name, img.src);
            // get avatar class to from attr of img tag

            let avatarClass = $(this).attr("avatar_class");

            if (!avatarClass) {
                //if not default avatar class
                avatarClass = "file_image fas";
            }

            $(img)
                .siblings(".avatar")
                .remove(); // clear previous avatar

            $(this)
                .parent("div")
                .append(
                    $(
                        `<div class="avatar ${avatarClass} rounded-circle"></div>`
                    )
                ); // add avatar div before img

            $(this).hide(); // hide img tag
        });
};

const loadImg = e => {
    console.log("image loading fail");
    let input = e.target;
    let img = $(e.target).siblings("img")[0];

    if (!img) {
        img = $(e.target)
            .parents("div")
            .siblings("img")[0];
    }

    if (!img) {
        console.warn("Not Found img tag");
    }

    // if (img.getAttribute("img-data")) {
    //     img.setAttribute("src", img.getAttribute("img-data"));
    //     return false;
    // }

    if (input.files && input.files[0]) {
        console.log("image: ", input);
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log("image: ", img);
            img.setAttribute("src", e.target.result);
            img.setAttribute("img-data", e.target.result);
            img.style.cssText = "width:100%;height:100%";
            $(img)
                .siblings(".avatar")
                .remove();
        };
        reader.readAsDataURL(input.files[0]);
        console.log("filding loading....", input.files[0]);
        return input.files[0];
    } else {
        console.log("fail image loading");
    }
};

const castBool = data => {
    if (typeof data === "string") {
        return data === "true";
    }
    return !!data;
};

const urlToFileName = url => {
    if (url) {
        let nameArr = splitMultiple(url, ["/"]);
        return nameArr[nameArr.length - 1];
    }
    return [];
};

const objToArray = obj => {
    if (obj && typeof obj == "object") {
        let arr = [];
        Object.keys(obj).map(key => {
            if (typeof obj[key] == "object") {
                arr.push({ [key]: obj[key] });
            } else {
                arr.push({ [key]: obj[key] });
            }
        });
        return arr;
    }
    return obj;
};

const isFunction = functionToCheck => {
    return (
        functionToCheck &&
        {}.toString.call(functionToCheck) === "[object Function]"
    );
};

const getTownShipById = (list, township_id) => {
    if (isNaN(township_id)) {
        console.warn(township_id, "is not a valid number");
        return;
    }
    return findById(list, Number(township_id));
};

const getResponseError = error => {
    let errors = error.response.data.errors;
    let key = Object.keys(errors)[0];

    return {
        errors: errors,
        firstError: {
            key: key,
            message: errors[key][0]
        }
    };
};

const getValidateError = (validateStatus, field) => {
    let validationObj = {
        message:
            validateStatus && validateStatus[field]
                ? validateStatus[field][0]
                : "",
        status: validateStatus ? !!validateStatus[field] : false
    };

    return validationObj;
};

const prepareForRevalidate = (oldValidationStatus, form) => {
    let buff = {};
    Object.keys(oldValidationStatus).forEach(key => {
        Object.assign(buff, { [key]: form[key] });
    });
    return buff;
};

// string ကနေ date obj ပြောင်းပေးတယ်
// day month year သို့ year month day parameter ပေးလို့ရ
// separator မပါရင် / သို့ - သုံးပြီး day month year ခွဲမယ်
const toDate = core_helper.toDate;

const statusUi = status => {
    return status
        ? `<center><button class="btn btn-primary btn-circle noti-circle" type="button">
                      <i class="fa fa-check"></i>
                  </button></center>`
        : `<center><button class="btn bg-danger btn-circle noti-circle" type="button">
                      <i class="fa fa-times"></i>
                  </button></center>`;
};

const shortText = (str, length = 30) => `${str.substr(0, length)}...`;

const toTitle = str => {
    let arr = str.split("_");
    arr = arr.map(item => {
        return item.charAt(0).toUpperCase() + item.slice(1);
    });
    return arr.join(" ");
};

// lastIndex က နောက်ဆုံးတခုကို လိုချင်ရင် true
const findByKeyword = (list, key, value, lastIndex, activeConsole) => {

    if (!has(key)|| !has(value)) {

        consoleTrace(activeConsole, [
            "Key or Value is invalid ",
            key,
            value
        ]);

        return null;
    }

    if(!has(list) || Object.keys(list).length == 0){
        consoleTrace(activeConsole, [
            "list is invalid ",
            list
        ]);
        return null;
    }

    if (typeof list != "array" && typeof list != "object") {
        consoleTrace(activeConsole, [
            "list is not array nor object",
            list
        ]);
        return null;
    }

    if (lastIndex) {
        list = list.reverse();
    }

    if (typeof list === "object") {
        const val = Object.values(list);

        if (typeof val == "undefined") return null;

        const result = val.find(item => {
            consoleTrace(getConsoleTraceKey(key), ['before match ', key, item, value]);
            return matchOrInclude(getNestedValue(key, item), value);
        });

        if (!result) {
            consoleTrace(activeConsole, [
                "Not Found ",
                value,
                " may be value is not correct"
            ]);
        }
        return result;
    }

    consoleTrace(activeConsole, "nested value ", val);

    return list.find(
        item => matchOrInclude(getNestedValue(key, item), value)
    );
};

const matchOrInclude = (item, value) => {

    if(Array.isArray(item)){
        return item.includes(value.toString());
    }

    return has(item) && has(value) && item.toString() === value.toString();
};

const consoleTrace = (consoleTrace, message) => {
    if (consoleTrace) {
        console.error(...message);
    }
};

const findById = (list, id, consoleTrace) => findByKeyword(list, "id", parseInt(id, 10), consoleTrace);

const parseInteger = num => {
    let result = parseInt(num);

    return isNaN(result) ? 0 : result;
};

const sortedByDate = (list, key) => {
    let sortedList = $(list).sort((a, b) => {
        return moment(a[key]).isAfter(b[key]) ? -1 : 1;
    });

    return sortedList;
};

const sortedByKey = (list, key, ascend) => {
    let sortedList = $(list).sort((a, b) => {
        if (ascend) {
            if(key) {
                return getNestedValue(key, a) < getNestedValue(key, b) ? 1 : -1;
            }
            else {
                return a < b ? 1 : -1;
            }
        } else {
            if(key) {
                return getNestedValue(key, a) > getNestedValue(key, b) ? 1 : -1;
            }
            else {
                return a > b ? 1 : -1;
            }
        }
    });

    return $.makeArray(sortedList);
};

// to check given text is html code or not
const isHTML = str => {
    var doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
};

const getTextFromHtml = html => {
    var temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};

const toString = data => {

    if (typeof data == "string") {
        return data;
    }

    return data.toString();
};

// to get text from html code or plain text
const getText = str => (isHTML(str) ? $(str).text() : str);

// to get text with length 70 from html code or text
const getFormattedMessage = data => {
    let text = getText(data);
    return shortText(text, 70);
};

// to get model name from 'Ds\Core\Models\Merchant'
const getModelClass = str => str.split("\\")[3];

// remove item from array by matching given item's id
const removeItem = (list, item, callback) => {
    if (!callback) {
        return list.filter(element =>
            item.id === element.id ? false : element
        );
    } else {
        return list.filter(element => callback(element));
    }
};

// for currency format like 100000 => 100,000 | 10000000 => 10,000,000
const currencyFormat = (value, decimal) => {
    if (value != 0 && !value) {
        console.warn("currencyFormat => invalid value ", value);
        return "0";
    }

    if (decimal) {
        value = parseFloat(value).toFixed(decimal);
    }

    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1, ");
};

const getNormalPriceFormat = value => value.toString().replace(",", "");


const localeIndex = core_helper.localeIndex;

const localeNumbering = (num, messageList) => {
    let currencyNumber = currencyFormat(num);
    return localeIndex(currencyNumber, messageList);
};

const getPhoneTag = data => {
    if (!data) {
        return [];
    }

    if (typeof data === "string") {
        data = JSON.parse(data);
    }

    return data.map(item => ({ key: "", value: item.trim() }));
};

const joinArray = arr => {
    if (!arr && typeof arr != "array") {
        console.warn("can't join array");
        return arr;
    }
    if (typeof arr == "string") {
        try {
            arr = JSON.parse(arr);
        } catch (e) {
            console.warn("can't parse json string to array");
        }
    }
    return arr.join(", ");
};

const mergeArray = (arr1, arr2, key) => {
    let mergeList = arr1.concat(arr2);
    if (typeof mergeList[0] === "object") {
        return uniqueObjectArray(mergeList, key ? key : "id");
    }
    return uniqueArray(mergeList);
};

const uniqueArray = array => Array.from(new Set(array));

const uniqueObjectArray = (list, key) => {

    list = filterNullForPayload(list);

    return list.filter(
        (value, index, self) =>
            self.map(o => o[key]).indexOf(value[key]) === index
    );
};

const matchArray = (arr1, arr2) => {
    if (arr1.length != arr2.length) {
        return false;
    }

    arr1 = arr1.filter(item => {
        return arr2.includes(item);
    });

    return arr1.length == arr2.length;
};

// getPhoneString([{key: "", value: "098765432"}, {key: "",value: "0949388733"}])
// @return "09876554432, 098776636673"
const getPhoneString = data => {

    if (!Array.isArray(data) || (Array.isArray(data) && data.length == 0)) {
        if (isJson(data) && isNaN(data)) {
            data = JSON.parse(data);
        } else {
            return data;
        }
    }

    if (data[0] && data[0].value) {
        return data.map(item => item.value).join(" , ");
    } else {
        return Array.isArray(data) ? data.join(",") : data;
    }
};


const transformToList = (data, callback) => {
    let list = {
        data: [],
        type: "lang",
        badge: false,
        bkey: "key",
        bvalue: "value"
    };

    let buff = [];

    Object.keys(data).map(item => {
        if (undefined != data[item]) {
            if (callback) {
                buff.push(callback(data, item));
            } else {
                buff.push({
                    key: item,
                    value: data[item],
                    cssClass: "bgc-white"
                });
            }
        }
    });

    list.data = buff;

    return list;
};


const transformToListTable = (data, callback, locale) => {
    let list = {
        keys: ["key", "value"],
        header: {
            data: [],
            attr: []
        },
        body: {
            data: [],
            attr: {
                key: {
                    class: "fw-600"
                }
            },
            components: {}
        }
    };
    if (data) {
        Object.keys(data).map(item => {
            if (undefined != data[item]) {
                if (typeof data[item] == "object") {
                    let nestedList = transformToList(data[item]);
                    list.body.data = mergeArray(
                        list.body.data,
                        nestedList.data
                    );
                } else {
                    if (callback) {
                        list.body.data.push(callback(data, item));
                    } else {
                        list.body.data.push({
                            key: item,
                            value: data[item]
                        });
                    }
                }
            }
        });
    }

    return list;
};

// to hide route for current user even though has permission for that route
const isExceptRoute = routeName => {
    if (!routeName) {
        console.warn("util.isExceptRoute => route name is invalid ", routeName);
        return false;
    }
    let user = store.state.auth.user;
    if (!user) {
        console.warn(
            "util.isExceptRoute => no active current user at store ",
            user
        );
        return false;
    }

    return except_route[user.role.slug]
        ? except_route[user.role.slug].includes(routeName.toLowerCase())
        : false;
};

const isLowerSpecificRank = routeName => {
    if (!routeName) {
        console.warn(
            "util.isLowerSpecificRank => route nams is undefined ",
            routeName
        );
        return false;
    }

    let user = store.state.auth.user;

    if (!user) {
        console.warn(
            "util.isExceptRoute => no active current user at store ",
            user
        );
        return false;
    }

    if (rank.highest_role_under_post_officer[routeName]) {
        return user.role.id < rank.highest_role_under_post_officer[routeName];
    }

    return false;
};

const isUpperRank = role => {
    return store.state.auth.user.role.level < role.level;
};

const permissionCheckOverRouteList = (current_route_list, consoleRoute) => {
    //return true;

    let result = false; //preset

    if (current_route_list.includes(consoleRoute)) {
        console.error("console Route included.....", current_route_list);
    }

    try {
        // loop route name list given by params
        current_route_list.forEach(route => {
            consoleForTrace(route == consoleRoute, [route]);

            let routeName, permit;

            if (Array.isArray(route)) {
                routeName = route[0];
                permit = route[1];
            } else {
                routeName = route;
            }

            if (!route) {
                consoleForTrace(routeName == consoleRoute, [
                    "after channing to route name" + route + " " + routeName
                ]);
            }

            if (isExceptRoute(routeName)) {
                consoleForTrace(routeName == consoleRoute, [
                    "it is except Route"
                ]);
                // if except route denied
                result = false;
            }

            if (isLowerSpecificRank(routeName)) {
                consoleForTrace(routeName == consoleRoute, [
                    "it is LowerSpecificRank Route"
                ]);

                result = false;
            }

            let resultForCurrentRoute = checkPermissionForRoute(
                routeName,
                permit,
                consoleRoute
            );

            if (!resultForCurrentRoute) {
                consoleForTrace(routeName == consoleRoute, [
                    "result of console route ===> ",
                    resultForCurrentRoute,
                    +""
                ]);
            }

            result |= resultForCurrentRoute; // allow access if permission is not set

            if (result) {
                throw BreakException;
            }
        });
    } catch (e) {}

    return result;
};

const consoleForTrace = (routeName, consoleRoute, message) => {
    if (consoleRoute && routeName == consoleRoute) {
        console.error(...message);
    }
};


const checkWithCallback = route => {

    let meta = route.meta;

    if(typeof meta.callback == 'function'){
        return meta.callback();
    }

    return true;
};


const isSuperAdmin = () => {
    let user = store.state.auth.user;

    if (!user.role) {
        return false;
    }

    return user.role && rank.list.SUPER.includes(user.role.slug);
};

const hasBranchCollection = () => {
    let user = store.state.auth.user;

    return !!user.branch_collection_id;
};

const isRegionManager = () => {
    let user = store.state.auth.user;
    if (!user.role) {
        return false;
    }
    return (
        user.role &&
        user.role.slug ===
            [rank.list.REGION_MANAGER, rank.list.IT_SUPPORT_REGION]
    );
};



const isLuxaryRank = () => {
    let user = store.state.auth.user;
    if (!user.role) {
        return false;
    }

    return user.role.level <= rank.rank_enum.lowest_admin_role;
};

const editableStaff = () => {
    let user = store.state.auth.user;
    if (!user.role) {
        return false;
    }

    return user.role.level <= rank.rank_enum.editable_role_level;
};

const isNoBranchUser = () => {
    return isSpecificRole(rank.no_branch_roles);
};

const isNoBranchStaff = (role) => {
    return isSpecificRoleForStaff(role);
};


const isNayPyiTaw = () => {
    let user = store.state.auth.user;

    if (!user.role) {
        return false;
    }

    return user.role.level <= rank.rank_enum.nay_pyi_taw_role;
};

const checkRankForPermission = level => {
    let user = store.state.auth.user;

    if (!user.role) {
        return false;
    }

    return user.role.level <= level;
};

const onlyHigherRankOf = rank_lvl => {
    let user = store.state.auth.user;
    if (!user.role) {
        return false;
    }
    return user.role.level < rank_lvl;
};

const onlyLowerRankOf = rank_lvl => {
    let user = store.state.auth.user;
    return user.role.level > rank_lvl;
};

const hasPermissionOverList = permissionList => {
    let flag = true;

    permissionList.map(permission => {
        flag = flag & hasPermission(permission);
    });

    return flag;
};

const hasPermission = permission => {
    let user = store.state.auth.user;

    let current_user_permissions = user.role
        ? user.role.permissions
            ? user.role.permissions
            : []
        : [];

    return current_user_permissions.indexOf(permission) != -1;
};

const checkForOnlyRoute = routeName => {
    let user = store.state.auth.user;

    let accessibleSlug = routePreset.only_route[routeName];

    if (!accessibleSlug) {
        return true; // allow access cause not specific
    }

    return accessibleSlug.includes(user.role.slug);
};

const isRole = slug => {

    let user = store.state.auth.user;

    return slug == user.role.slug;

};

const checkPermissionForRoute = (route, permit, consoleRoute) => {

    consoleForTrace(route, consoleRoute, [
        "initial parameters ===> ",
        route,
        permit
    ]);

    let current_route_obj;

    if (typeof route === "string") {
        // route name
        current_route_obj = getRouteByName(route, consoleRoute == route);

        consoleForTrace(route, consoleRoute, [
            "after converting obj ===> ",
            current_route_obj
        ]);
    } else {
        current_route_obj = route;
        consoleForTrace(route, consoleRoute, [
            "already obj ===> ",
            current_route_obj
        ]);
    }

    if (!current_route_obj) {
        consoleForTrace(route, consoleRoute, [
            "Can't Found route ",
            route,
            current_route_obj
        ]);
        console.warn("no found route for ", route, permit);
        return false;
    }

    if (isGlobalRoute(current_route_obj)) {
        return true;
    }

    if (!checkForOnlyRoute(current_route_obj.name)) {
        consoleForTrace(route, consoleRoute, [
            "this route is only for specific role"
        ]);
        return false;
    }

    if(checkLevelRoute(current_route_obj)){ // သတ်မှတ်တဲ့ level ဆို ဝင်ခွင့်ပြု
        consoleForTrace(route, consoleRoute, [
            "this route is specific level route"
        ]);
        return true;
    }
    else{ // အခြား level တွေပိတ်ထားတဲ့ key 'notOtherLevel' ကိုစစ် ပါရင် အခြား level တွေဝင်ခွင့်မရ | မပါရင် အခြား level တွေ permission ဆက်စစ်
        if(current_route_obj.meta && current_route_obj.meta.notOtherLevel){
            return false; // အခြား level ဝင်ခွင့်မရ
        }
    }

    if(checkSpecificRole(current_route_obj)){
        consoleForTrace(route, consoleRoute, [
            "this route is specific level route"
        ]);
        return true;
    }
    else{ // အခြား level တွေပိတ်ထားတဲ့ key 'onlySpecificRole' ကိုစစ် ပါရင် အခြား level တွေဝင်ခွင့်မရ | မပါရင် အခြား level တွေ permission ဆက်စစ်
        if(current_route_obj.meta && current_route_obj.meta.onlySpecificRole){
            return false; // အခြား level ဝင်ခွင့်မရ
        }
    }

    if (!checkForHasBranch(current_route_obj)) {
        consoleForTrace(route, consoleRoute, [
            "this route is only for has branch user role"
        ]);
        return false;
    }


    if(!checkWithCallback(current_route_obj)){
        consoleForTrace(route, consoleRoute, [
            "denied by callback"
        ]);
        return false;
    }

    if (!checkForInternationalBranch(current_route_obj)) {
        consoleForTrace(route, consoleRoute, [
            "this route is only for international branch role"
        ]);
        return false;
    }

    let permission = current_route_obj.meta
        ? current_route_obj.meta.permissions
        : undefined;

    consoleForTrace(route, consoleRoute, ["needed permission ==> ", permission]);

    if (typeof permission === "object") {
        consoleForTrace(route, consoleRoute, ["permission is object ==> ", permission]);
        // page has with many tab
        if (permit && permission[permit]) {

            consoleForTrace(route, consoleRoute, ["with permit ==> ", permit]);

            let subPermission = permission[permit];

            consoleForTrace(route, consoleRoute, ["sub permission ==> ", subPermission]);

            if(typeof subPermission == 'function'){
                return subPermission();
            }

            permission = permission[permit];

        } else {

            consoleForTrace(route, consoleRoute, ["with no permit "]);
            // if no permit is set
            let permissions = Object.values(permission);

            consoleForTrace(route, consoleRoute, ["permissions ==> ", permissions]);

            let BreakException = {};
            let result = false;
            try {
                result = permissions.map(permission => {
                    if (permission) {
                        if (hasPermission(permission)) {
                            throw BreakException;
                        }
                    }
                });
            } catch (e) {
                result = true;
            }

            if (!result) {
                consoleForTrace(route, consoleRoute, ["permission denied"]);
            }
            consoleForTrace(route, consoleRoute, ["permission accepted", result]);
            return result;
        }
    }

    if (permission) {
        let result = hasPermission(permission);

        if (!result) {
            consoleForTrace(route, consoleRoute, ["permission denied"]);
        }

        return result;
    }
};

const checkLevelRoute = (route) => {

    let user = store.state.auth.user;

    let meta = route.meta;

    if(meta && meta.allowLevel){
        return user.role.level <= route.meta.allowLevel;
    }
    // not allow
    return false;
};


const checkSpecificRole = (route) => {

    let meta = route.meta;

    if(meta && meta.onlySpecificRole){
        return isSpecificRole(meta.onlySpecificRole);
    }
    // not allow
    return false;
};

const isSpecificRole = (roles) => {

    let user = store.state.auth.user;

    return roles.includes(user.role.slug);

};

const isSpecificRoleForStaff = (role) => {

    let roles = rank.no_branch_roles;

    return roles.includes(role.slug);

};

const checkForHasBranch = route => {
    let user = store.state.auth.user;

    let meta = route.meta;

    if (meta && meta.hasBranch) {
        return !!user.branch;
    }

    return true; // allow
};

const checkForInternationalBranch = route => {
    let user = store.state.auth.user;

    let meta = route.meta;

    if (meta && meta.international_branch) {
        return !!(user.branch && user.branch.international_mail);
    }

    return true;
};

const getPresetDashboard = () => {
    let user = store.state.auth.user;

    return routePreset.dashboard[user.role.slug];
};

const getHomeRoute = (user, trace) => {
    let homeList = ["dashboard", "officer-dashboard"];

    let prefixDashboard = getPresetDashboard();

    let prefixDashboardRouteName =
        prefixDashboard && typeof prefixDashboard == "object"
            ? prefixDashboard.name
            : prefixDashboard;

    if (checkPermissionForRoute(prefixDashboardRouteName)) {
        consoleTrace(trace, ['prefixDashboardRouteName', prefixDashboardRouteName]);
        return prefixDashboardRouteName;
    }

    let result = "unauthorized";
    var BreakException = {};
    try {
        homeList.forEach(routeName => {
            let route = getRouteByName(routeName);

            let status = checkPermissionForRoute(route);

            if (status) {
                result = routeName;
                throw BreakException;
            }
        });
    } catch (e) {
        console.warn(e);
    }

    if (result == "unauthorized") {
        let suitableRoute;
        // find suitable route for current user
        try {
            suitableRoute = searchRouteByPermission(user.role.permissions[0]);
            console.error("suitableRoute", suitableRoute);
        } catch (e) {
            return "403";
        }

        if (suitableRoute) {
            result = suitableRoute.name;
        }
    }

    console.warn("forbidden by home route", result);
    return result;
};

const searchRouteByPermission = permission => {
    return findByKeyword(router.options.routes, "meta.permissions", permission);
};

const getRouteByName = (routeName, consoleTrace) => {
    return findByKeyword(
        router.options.routes,
        "name",
        routeName,
        false,
        consoleTrace
    );
};


const isDirectDeliver = label => {
    let user = store.state.auth.user;

    if (label.accept_branch_id == label.deliver_branch_id) {
        return true;
    }

    if (label.instant_deliver) {
        return true;
    }

    let branches = user.all_branches.map(branch => branch.id);

    if (branches.includes(label.deliver_branch_id)) {
        return true;
    }

    // let townships = user.all_branches.map(branch => branch.township.id);

    // if(townships.includes(label.deliver_branch.township_id))
    // {
    //     return true;
    // }

    if (
        user.branch &&
        user.branch.town &&
        label.deliver_branch &&
        user.branch.town.id == label.deliver_branch.town_id
    ) {
        return true;
    }

    return false;
};

const isReturn = label => {
    let returnConfirmLog = findByKeyword(
        label.transaction,
        "status",
        ConstantKeys.label_status_enum.RETURN_CONFIRMED
    );

    return !!returnConfirmLog;
};

const isForward = label => {
    return false;
};

const isDirectReturn = label => {
    return isReturn(label) && isDirectDeliver(label);
};


const getLabelTransactionType = (label, skipStatus = []) => {

    let type = undefined;

    if (isDirectDeliver(label) && !skipStatus.includes("direct")) {
        return "direct";
    }

    if (isDirectReturn(label) && !skipStatus.includes("direct_return")) {
        return "direct_return";
    }

    if (isReturn(label) && !skipStatus.includes("return")) {
        return "return";
    }

    if (isForward(label) && !skipStatus.includes("forward")) {
        return "forward";
    }

    if (!skipStatus.includes("normal")) {
        type = "normal";
    }

    return type;
};

const calculateStatus = label => {
    let type = undefined;
    let skipStatus = [];
    let result = undefined;

    do {
        type = getLabelTransactionType(label, skipStatus);

        let times = 1;

        console.warn("shipping type", type, skipStatus);

        let transaction = label.transaction.filter(log => log.viewable);

        transaction = sortedByKey(transaction, "id", "desc");

        let currentStatus = transaction[0] ? transaction[0].status : null;

        let beforeStatus = transaction[1]
            ? transaction[1].status
            : ConstantKeys.label_status_enum.PENDING;

        if (type == "forward") {
            result = calculateForward(type, beforeStatus, currentStatus, times);
        }
        if (type == "direct") {
            result = calculateDirect(type, beforeStatus, currentStatus, times);
        }
        if (type == "direct_return") {
            result = calculateDirectReturn(
                type,
                beforeStatus,
                currentStatus,
                times
            );
        }
        if (type == "return") {
            result = calculateReturn(type, beforeStatus, currentStatus, times);
        }
        if (type == "redirect") {
            result = calculateRedirect(
                type,
                beforeStatus,
                currentStatus,
                times
            );
        }
        if (type == "normal") {
            result = calculateNormal(type, beforeStatus, currentStatus, times);
        }

        if (result && !result.next) {
            skipStatus.push(type);
        }

        // console.log(
        //     "next round neeed ",
        //     !(result && result.status && result.status.next)
        // );
    } while (type && !(result && result.status && result.status.next));

    return result;
};

const calculateByShippingType = (type, currentStatus) => {
    let process_status_list = ConstantKeys.label_status_process_enum[type]; // get status list by shipping type

    if (!process_status_list) {
        console.error("Could not found type of shipping ==> ", type);
    }

    process_status_list = cloneJson(process_status_list);

    let index = process_status_list.indexOf(currentStatus.toUpperCase());

    let next = process_status_list[index + 1];
    console.log("next status ==> ", next);
    return {
        next: ConstantKeys.label_status_enum[next],
        current: currentStatus,
        index: index, // index က status process list ရဲ့ index ဘယ်လောက်မှာတွေ့တာလဲဆိုတဲ့ဟာ
        end: process_status_list.length - 1 == index // နောက်ထပ် status မရှိတော့ရင် end true
    };
};

// duplicate ထပ်နေတဲ့ status တွေမပါလို့ calculateByShippingType သုံးပီးရှာ
const calculateNormal = (type, beforeStatus, currentStatus) => {
    return calculateByShippingType(type, currentStatus);
};

const calculateDirect = (type, beforeStatus, currentStatus) => {
    return calculateByShippingType(type, currentStatus);
};

const calculateDirectReturn = (type, beforeStatus, currentStatus) => {
    return calculateByShippingType(type, currentStatus);
};

const calculateForward = (type, beforeStatus, currentStatus) => {
    console.log("calculating forward ");
    return calculateByShippingType(type, currentStatus);
};

const calculateRedirect = (type, beforeStatus, currentStatus) => {
    return getStatus(type, beforeStatus, currentStatus, 1);
};

// type က shipping type, before status => နောက်ဆုံး ရဲ့ ရှေ့က status တခု, current status => နောက်ဆုံး status တခု, ရှာတဲ့အကြိမ်ရေ
const getStatus = (type, beforeStatus, currentStatus, times = 1) => {
    // shipping type ကော current status ကောရှိရင်
    if (type && currentStatus) {
        // if required info for searching is ready
        // shipping type ပေါ်မူတည်ပီး status process list ကိုယူ
        let process_status_list = ConstantKeys.label_status_process_enum[type]; // get status list by shipping type

        if (process_status_list) {
            process_status_list = cloneJson(process_status_list);
            // index of နဲ့ အကြိမ်ရေနဲ့ရှာ  အကြိမ်ရေက status process မှာ status တွေထပ်တာတွေရှိလို့ ဉပမာ redire မှာဆို SEND_TO_DESTINATION_BRANCH က ၂ခုထပ်နေတာ
            // status ၂ခုနဲ့ အစဉ်အတိုင်းတူနဲ့ဟာကိုရှာတာဆိုတော့ ပထမတခုမတူရင် နောက်တခုဆိုပီးရှာမှာ
            let index = process_status_list.indexOf(
                currentStatus.toUpperCase(),
                times
            );
            // current status တော့ရှာတွေ့ပီ
            if (index != -1) {
                // beready for next
                // current ပီးရင်နောက်လာမယ့်ဟာကို ယူ
                let key_of_next_status = process_status_list[index + 1];
                // before status ကိုလည်းယူ
                let before_status = process_status_list[index - 1];
                // before ရဲ့ before ပါယူ
                let before_status2 = process_status_list[index - 2];

                // before status ရခဲ့မယ်ဆိုရင် ရှာဖို့ပေးလိုက်တဲ့ before status နဲံတိုက်ကြည့် တူရင် တွေ့ပီ
                if (
                    beforeStatus &&
                    beforeStatus.toUpperCase() == before_status
                ) {
                    let searchResult = {
                        next: key_of_next_status // next status ကိုထည့်
                            ? ConstantKeys.label_status_enum[key_of_next_status]
                            : undefined,
                        current: currentStatus, // current status ကိုပြန်ထည့်
                        before: before_status // before status ကိုထည့်
                            ? ConstantKeys.label_status_enum[before_status]
                            : undefined,
                        before2: before_status2 // before ရဲ့ before status ကိုလည်းထည့်
                            ? ConstantKeys.label_status_enum[before_status2]
                            : undefined,
                        index: index, // index က status process list ရဲ့ index ဘယ်လောက်မှာတွေ့တာလဲဆိုတဲ့ဟာ
                        end: process_status_list.length - 1 == index // နောက်ထပ် status မရှိတော့ရင် end true
                    };

                    return searchResult;
                } else {
                    if (!beforeStatus) {
                        // အပေါ်ကအတိုင်း before status မရှိတဲ့  အခြေအနေ ဉပမာ pending
                        return {
                            next: key_of_next_status
                                ? ConstantKeys.label_status_enum[
                                      key_of_next_status
                                  ]
                                : undefined,
                            current: currentStatus,
                            before: undefined,
                            index: index,
                            end: process_status_list.length - 1 == index
                        };
                    } else {
                        // အကယ်၍ before status တော့ရှိတယ် ရှာဖို့ပေးလိုက်တဲ့ before status နဲ့ မတူရင် label process listရဲ့ ဒုတိယမြောက် current status နဲံ တူတဲ့ဟာကိုရှာ before status နဲ့ ပြန်တိုက်
                        return getStatus(
                            type,
                            beforeStatus,
                            currentStatus,
                            times + 1
                        );
                    }
                }
            } else {
                // မတွေ့ရင်
                // console.warn(
                //     `util.getStatus => Can\'t find status for ${currentStatus} with before ${beforeStatus} in ${type}`
                // );
            }
        } else {
            // console.warn(
            //     "util.getStatus => Can't find process status list for ",
            //     type
            // );
        }
    } else {
        // console.warn("util.getStatus => Invalid params ", type, currentStatus);
    }
};

const getConsoleTraceKey = key => {
    return castBool(localStorage.getItem(key));
}

const isGlobalRoute = route =>
    route.meta && route.meta.auth && route.meta.permissions == "global";

const isGuestRoute = route => route.matched.some(m => m.meta.guest);

const getTotal = (data, key) => {
    let total = 0;

    if (!Array.isArray(data)) {

        let keys = Object.keys(data);

        keys.forEach(key => {
            try {
                total += Number(data[key]);
            } catch (e) {
                console.warn("Invalid Number Format");
                console.warn(e);
            }
        });
    } else if (Array.isArray(data)) {
        if(key){
            data = data.map(item => item[key]);
        }
        // console.log(data);
        return data.reduce((a, b) => a + b, 0);
    }

    return total;
};

const acceptConfirmAction = configJson => {
    return new Promise((resolve, reject) => {
        Swal.fire(configJson).then(result => {
            if (result.value) {
                // user confirmed
                resolve(true);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // user refuse to confirm message
                resolve("denied");
            } else {
                // user close
                resolve(false);
            }
        });
    });
};

// get attr of obj by key and locale (if locale is not set, it will be used user's locale or default 'en')
const getLocaleAttr = (obj, key, locale) => {
    let localeKey = ["en", "mm"];

    if (!obj || !key) {
        console.warn("getLocaleAttr => invalid data ", obj, key);
        return "---";
    }

    let current_user = store.state.auth.user;

    let user_locale = current_user ? current_user.locale : "en";

    if (!locale) {
        locale = user_locale;
    }

    localeKey = removeItem(localeKey, locale, element => element !== locale);

    if (key.indexOf(".") != -1) {
        key = key.split(".")[0];
    } else {
        key = key + "_";
    }

    let value = obj[`${key}${locale}`];

    if (!value || null == value) {
        value = obj[`${key}${localeKey[0]}`];
        return value ? value : "---";
    }

    return value;
};

const transformPayloadToFormData = (payload, formData) => {
    Object.keys(payload).forEach(key => {
        let item = payload[key];

        if (item) {
            if (Array.isArray(item)) {
                item.forEach((i, index) => {
                    appendToFormData(formData, key, i, index);
                });
            } else {
                appendToFormData(formData, key, item);
            }
        }
    });
    return formData;
};

const appendToFormData = (formData, key, item, index) => {
    if (item && typeof item == "object" && item.name) {
        formData.append(`${key}[]`, item, item.name);
        console.log(formData, key, item, index);
    } else {
        formData.append(key, item);
    }
};

const transformToLocaleSelect = (key, value, list) => {
    let select = {
        list: [],
        bkey: "id",
        bvalue: "value"
    };

    if (!key || !value || !list || !Array.isArray(list)) {
        console.error("transformToLocaleSelect => invalid ", key, value, list);
        return select;
    }

    select = {
        list: list,
        bkey: key,
        bvalue: value
    };

    return select;
};

const captalize = str => {
    let str_arr = splitMultiple(str, [" "]);
    str = str_arr.map(word => {
        return word.charAt(0).toUpperCase() + word.substring(1);
    });
    return str.join(" ");
};

// postcode length ၄ ဖြစ်နေရင် ရှေ့မှာ 0 တလုံးထည့်ပေး
const formatPostcode = code => {
    let length = 5;
    let pad = "0";
    let diff = 0;
    let padding = "";

    if (code && code.length < length) {
        diff = length - code.length;
    }

    for (var i = 0; i < diff; i++) {
        padding += pad;
    }

    return padding + code + "";
};

const getFormattedDate = core_helper.getFormattedDate;

const copy = id => {
    let range;
    let el = document.getElementById(id);

    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    } else if (window.getSelection) {
        let selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    try {
        document.execCommand("copy");
        return true;
    } catch (err) {
        return false;
    }
};

const isAlreadyClearance = cod => {
    if (cod) {
        return !!cod.issued_at;
    }
    return false;
};

const isNeedCurrentBranch = lvl => {
    return lvl >= rank.rank_enum.no_current_branch_role;
};

const getLangMessage = (key, messageList, config) => {

    let localeMessage = messageList[key];

    if (!localeMessage) {
        return config
            ? config[key]
                ? config[key]
                : key
            : key;
    }

    return localeMessage;
};

const getWithExpiry = (data, key) => {
    const itemStr = data;
    // if the item doesn't exist, return null
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);

    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key);

        return null;
    }

    return item.value;
};

const getTotalStatistic = (data, keys) => {
    let total = {};

    data.forEach(item => {
        keys.map(key => {
            Object.assign(total, {
                [key]: total[key] ? total[key] + item[key] : item[key]
            });
        });
    });
    console.log(total);
    return total;
};

const getPhoneJsonArray = (phones, stringFormat) => {
    if (phones) {
        if (isJson(phones)) {
            phones = JSON.parse(phones);
        }

        if (Array.isArray(phones) && phones.length > 0) {
            let json = getPhoneString(phones).split(",");
            return stringFormat ? JSON.stringify(json) : json;
        }
    }

    return [];
};

const assignObject = (from, to) => {

    let keys = Object.keys(from);

    keys.map(key => {
        if (
            from[key] != null &&
            typeof from[key] == "object" &&
            !Array.isArray(from[key])
        ) {
            if(to[key] && typeof to[key] == 'object'){
                Object.assign(to, {[key]: assignObject(from[key], to[key])});
            }
            else{
                if(from[key]){
                    if(!to){// to က undefined
                        to = {}; // initialize;
                    }

                    Object.assign(to , {[key]: from[key]});
                }
            }
        } else {
            Object.assign(to,  {[key]: from[key]});
        }
    });

    return to;
};

const filterNullForPayload = payload => {
    payload = cloneJson(payload);
    let keys = Object.keys(payload);

    keys.filter(key => {
        if (!payload[key]) {
            delete payload[key];
        }
    });

    return payload;
};

const canAccessAttr = (obj, nestedKey) => {

};

const isInDevelop = core_helper.isInDevelop;
const flashErrorMessage = core_helper.flashErrorMessage;
const getErrorMessage = core_helper.getErrorMessage;
const receiveResponse = core_helper.receiveResponse
const nestedReceiver = core_helper.nestedReceiver;
const getNestedValue = core_helper.getNestedValue;
const has = core_helper.has;
const toHour = core_helper.toHour;
const getRegionSlug = core_helper.getRegionSlug;

const titleCase = (str) => {
    if ((str===null) || (str===''))
       return false;
    else
        str = str.toString();

    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

const refreshWithDelay = (time) => {
    setTimeout(function () {
        window.location.reload();
    }, time);

};

export default {
    objToArray,
    splitMultiple,
    getServiceFeeName,
    getServiceName,
    cloneJson,
    isJson,
    parseJson,
    search,
    gd,
    isHTML,
    castBool,
    getTextFromHtml,
    getText,
    toString,
    isFunction,
    findByKeyword,
    findById,
    sortedByDate,
    sortedByKey,
    transformToList,
    removeItem,
    getModelClass,
    getFormattedMessage,
    toDate,
    avatarImg,
    loadImg,
    localeIndex,
    toTitle,
    shortText,
    getPhoneTag,
    joinArray,
    mergeArray,
    uniqueArray,
    uniqueObjectArray,
    matchArray,
    getPhoneString,
    getResponseError,
    getValidateError,
    getNestedValue,
    prepareForRevalidate,
    getTownShipById,
    isExceptRoute,
    checkPermissionForRoute,
    getRouteByName,
    getHomeRoute,
    isGlobalRoute,
    isGuestRoute,
    currencyFormat,
    getNormalPriceFormat,
    getTotal,
    getStatus,
    acceptConfirmAction,
    searchRouteByPermission,
    flashErrorMessage,
    getLocaleAttr,
    transformPayloadToFormData,
    permissionCheckOverRouteList,
    hasPermission,
    hasPermissionOverList,
    isUpperRank,
    isSuperAdmin,
    hasBranchCollection,
    isRegionManager,
    isLuxaryRank,
    localeNumbering,
    transformToLocaleSelect,
    transformToListTable,
    isLowerSpecificRank,
    castToString,
    captalize,
    getFormattedDate,
    editableStaff,
    copy,
    checkRankForPermission,
    onlyHigherRankOf,
    onlyLowerRankOf,
    isNayPyiTaw,
    formatPostcode,
    isAlreadyClearance,
    isNeedCurrentBranch,
    getLangMessage,
    getWithExpiry,
    calculateStatus,
    calculateForward,
    getTotalStatistic,
    urlToFileName,
    statusUi,
    getPresetDashboard,
    getPhoneJsonArray,
    assignObject,
    getErrorMessage,
    checkForHasBranch,
    receiveResponse,
    nestedReceiver,
    parseInteger,
    implodeArray,
    filterNullForPayload,
    filterListByCallback,
    isInDevelop,
    canAccessAttr,
    consoleTrace,
    titleCase,
    isRole,
    isSpecificRole,
    isNoBranchUser,
    isNoBranchStaff,
    has,
    toHour,
    getRegionSlug,
    refreshWithDelay,
    transPaginate,
};
