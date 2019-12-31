var path_plugin = admingen.path_plugin;
var admin_url = admingen.admin_url;
var site_url = admingen.site_ur;
var url_ajax = admin_url + "admin-ajax.php";

console.log(admingen);

//Polyfill
if (![].contains) {
    Object.defineProperty(Array.prototype, 'contains', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchElement/*, fromIndex*/) {
            if (this === undefined || this === null) {
                throw new TypeError('Cannot convert this value to object');
            }
            var O = Object(this);
            var len = parseInt(O.length) || 0;
            if (len === 0) {
                return false;
            }
            var n = parseInt(arguments[1]) || 0;
            if (n >= len) {
                return false;
            }
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0)
                    k = 0;
            }
            while (k < len) {
                var currentElement = O[k];
                if (searchElement === currentElement ||
                        searchElement !== searchElement && currentElement !== currentElement
                        ) {
                    return true;
                }
                k++;
            }
            return false;
        }
    });
}
/*
 * @type Immediately Invoked Function Expression (IIFE)
 */
var widthDocumentApp = document.width;
var dateNowSystem = new Date();

var swerp = {
    gridValueLimit: {
        xs: 768,
        sm: 992,
        md: 1200,
        lg: 1200
    },
    gridValueDefault: {
        xs: 320,
        sm: 768,
        md: 992,
        lg: 1200
    },
    baseGrid: function () {
        return {
            xs: document.width < swerp.gridValueLimit.xs,
            sm: document.width >= swerp.gridValueLimit.xs && document.width < swerp.gridValueLimit.sm,
            md: document.width >= swerp.gridValueLimit.sm && document.width < swerp.gridValueLimit.md,
            lg: document.width >= swerp.gridValueLimit.lg
        };
    },
    gridCompatibility: function (strRef, width) {

        width = isNaN(width) ? document.width : width || document.width;
        var list = [];
        var limit = swerp.gridValueLimit;
        var ref = {
            xs: width <= limit.xs,
            sm: width <= limit.sm,
            md: width <= limit.md,
            lg: width <= limit.lg
        };
        for (var i in limit) {
            if (ref[i] && width <= document.width) {
                list.push(i);
            }
        }
        return list.indexOf(strRef) !== -1;
    },
    baseGridRef: function (width_reference) {
        width_reference = width_reference || document.width;
        var ref = swerp.baseGrid();
        return ref.xs ? 'xs' : ref.sm ? 'sm' : ref.md ? 'md' : 'lg';
    },
    fnBaseGrid: function (width_reference) {
        width_reference = width_reference || document.width;
        return {
            xs: width_reference < swerp.gridValueLimit.xs,
            sm: width_reference >= swerp.gridValueLimit.xs && width_reference < swerp.gridValueLimit.sm,
            md: width_reference >= swerp.gridValueLimit.sm && width_reference < swerp.gridValueLimit.md,
            lg: width_reference >= swerp.gridValueLimit.lg
        };
    },
    fnBaseGridValue: function (width_reference) {
        width_reference = width_reference || document.width;
        return width_reference - (width_reference * 0.02);
    },
    fnDefaultGridValue: function (grid) {
        return swerp.gridValueDefault[grid || 'lg'];
    },
    fnBaseGridResult: function (minValue, width_reference) {
        var BG = swerp.fnBaseGrid(width_reference);
        var width = minValue * (BG.xs ? 1 : BG.sm ? 2 : BG.md ? 3 : 4);
        if (width > 1168) {
            return 1168;
        }
        return width;
    },
    colors: {
        Yellow: [],
        Orange: [],
        Red: [
            {name: 'Maroon', hexa: '#800000', rgb: '(128,0,0)'},
            {name: 'DarkRed', hexa: '#8B0000', rgb: '(139,0,0)'},
            {name: 'FireBrick', hexa: '#B22222', rgb: '(178,34,34)'},
            {name: 'Brown', hexa: '#A52A2A', rgb: '(165,42,42)'},
            {name: 'Tomato', hexa: '#FF6347', rgb: '(255,99,71)'},
            {name: 'Red', hexa: '#FF0000', rgb: '(255,0,0)'}
        ],
        Cyan: [],
        Blue: [],
        Gray: []
    },
    telefoneFormat: {
        fixo: {mask: '(##) ####-####', pattern: /^\d{10}$/g},
        celular: {mask: '(##) #####-####', pattern: /^\d{11}$/g},
        f0x00: {mask: '#### ### ####', pattern: /^(0800|0300)\d{7}$/g},
        f4007: {mask: '####-####', pattern: /^(4007)\d{4}$/g}
    },
    getRefLayout: function (width) {
        //widthReference
        var wr = [575.98, 576, 767.98, 768, 991.98, 992, 1199.98];
        var retorno = 'lg';
        if (width > 768 && width <= 1199) {
            retorno = 'md';
        }
        if (width > 576 && width <= 768) {
            retorno = 'sm';
        }
        if (width < 576) {
            retorno = 'xs';
        }
        return retorno;
    },
    getWidthRef: function (width) {
        //widthReference
        var wr = [575.98, 576, 767.98, 768, 991.98, 992, 1199.98];
        var retorno = {'min-width': 980, 'max-width': 1200};
        if (width > 768 && width <= 1199) {
            retorno = {'min-width': 768, 'max-width': 980};
        }
        if (width > 576 && width <= 768) {
            retorno = {'min-width': 576, 'max-width': 768};
        }
        if (width < 576) {
            retorno = {'min-width': 300, 'max-width': 576};
        }
        return retorno;
    },
    toString: function () {
        return "Softland Sistemas";
    },
    inherit: function (obj) {
        if (obj === null)
            throw TypeError();
        if (Object.create)
            return Object.create(obj);
        var type = typeof obj;
        if (type !== "object" && type !== "function")
            throw TypeError();
        function fun() {}
        ;
        fun.prototype = obj;
        return new fun();
    },
    isNaN: isNaN,
    //Verifica se a variavel n?o ? is Undefined
    isUndefined: function (value) {
        return (typeof value === 'undefined');
    },
    //verifica se ? um array
    isArray: function (value) {
        return Array.isArray(value) && value instanceof Array ? true : false;
    },
    //verifica se ? um objeto
    isObject: function (value) {
        return !Array.isArray(value) ? value instanceof Object : false;
    },
    //verifica o tipo de lista Array ou Object.
    isTypeList: function (value) {
        return swerp.isArray(value) ? 'array' : swerp.isObject(value) ? 'object' : 'undefined';
    },
    //Retorna o tipo da variavel
    typeOf: function (value) {
        // Pode retornar
        // string, number, boolean, object, array, function, undefined
        return typeof value !== 'object' ? typeof value : swerp.isTypeList(value);
    },
    extend: function (o, p) {
        o = o || {};
        for (var prop in p) {
            o[prop.replace("classe", "class")] = p[prop];
        }
        return o;
    },
    merge: function (o, p) {
        o = o || {};
        for (var prop in p) {
            if (o.hasOwnProperty[prop])
                continue;
            o[prop] = p[prop];
        }
        return o;
    },
    restrict: function (o, p) {
        for (var prop in p) {
            if (!(prop in p))
                delete o[prop];
        }
        return o;
    },
    subtract: function (o, p) {
        for (var prop in p) {
            delete o[prop];
        }
        return o;
    },
    union: function (o, p) {
        return swerp.extend(swerp.extend({}, o), p);
    },
    intersection: function (o, p) {
        return swerp.restrict(swerp.extend({}, o), p);
    },
    clone: function (obj) {
        if (null == obj || "object" != typeof obj)
            return obj;
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = obj[attr];
        }
        return copy;
    },
    keys: function (o) {
        if (typeof o !== "object")
            throw TypeError();
        var result = [];
        for (var prop in o) {
            if (o.hasOwnProperty(prop))
                result.push(prop);
        }
        return result;
    },
    countProperties: function (obj) {
        if (swerp.isEmpty(obj)) {
            return 0;
        }
        if (swerp.typeOf(obj) !== 'object') {
            return 0;
        }
        return Object.keys(obj).length;
    },
    isEmpty: function (value, isProperts) {
        isProperts = isProperts === undefined ? false : isProperts;
        if (value === null) {
            return true;
        }
        if (swerp.isUndefined(value)) {
            return true;
        }
        if (value instanceof Date) {
            return false;
        }
        if (value instanceof RegExp) {
            return false;
        }
        var type = swerp.typeOf(value);
        switch (type) {
            case 'object':
                if (value == {}) {
                    return true;
                }
                if (isProperts) {
                    for (var prop in value) {
                        if (!swerp.isEmpty(value[prop])) {
                            return false;
                        }
                    }
                    return true;
                }
                return Object.keys(value).length == 0 ? true : false;
                break;
            case 'array':
                return value.length === 0 || value === [] ? true : false;
                break;
            case 'number':
                return false;
                break;
            case 'boolean':
                return false;
                break;
            case 'function':
                return false;
                break;
            default:
                if (value.length > 0) {
                    return false;
                }
                return true;
                break;
        }
    },
    isJson: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    stEquals: function (a, b) {
        if (swerp.isEmpty(a) || swerp.isEmpty(b)) {
            return false;
        }

        if (a.length != b.length) {
            return false;
        }

        return angular.toJson(a) == angular.toJson(b);
    },
    equals: function (a, b) {
        if (!swerp.isObject(a)) {
            return a === b;
        }
        if (swerp.isEmpty(a) || swerp.isEmpty(b)) {
            return false;
        }
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (swerp.isObject(a[propName])) {
                if (!swerp.equals(a[propName], b[propName])) {
                    return false;
                }
            }
            if (swerp.isArray(a[propName])) {
                return swerp.arrayEquals(a[propName], b[propName]);
            }
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    },
    pad: function (value, size, token, position) {
        token = token || '0';
        position = position == 'right' ? 'right' : 'left';
        if (swerp.isEmpty(value)) {
            value = "";
        }
        size = size - value.toString().length;
        var x = '';
        for (var i = 0; i < size; i++) {
            x = x.concat(token);
        }

        return position == 'left' ? x + value : value + x;
    },
    removeAccents: function (text) {
        var charIn = 'àèìòùâêîôûäëïöüáéíóúãõçÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÁÉÍÓÚÃÕÇ';
        var charVa = 'aeiouaeiouaeiouaeiouaocAEIOUAEIOUAEIOUAEIOUAOC';
        var oc = text.match(/[àèìòùâêîôûäëïöüáéíóúãõçÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÁÉÍÓÚÃÇ]/gm);
        if (oc !== null) {
            for (var i = 0; i < oc.length; i++) {
                text = text.replace(oc[i], charVa.charAt(charIn.indexOf(oc[i])));
            }
        }
        return text;
    },
    toLowerCaseFirst: function (string) {
        var charFirst = string.charAt(0).toLowerCase();
        return charFirst + string.substr(1);
    },
    capitalize: function (string) {
        var charFirst = string.charAt(0).toUpperCase();
        return  charFirst + string.slice(1).toLowerCase();
    },
    isRegexpTest: function (regex, value) {
        return regex.test(value);
    },
    mask: function (value, mask) {
        if (swerp.isEmpty(value)) {
            value = "";
        }
        if (mask.indexOf("|") !== -1) {
            var masks = mask.split("|");
            for (var i = 0; i < masks.length; i++) {
                mask = masks[0];
                if (value.length <= masks[i].replace(/[^#]/gm, "").length) {
                    mask = masks[i];
                    break;
                }
            }
        }
        if (mask.indexOf("!") !== -1) {
            return swerp.pad(value, mask.replace('!', ''));
        }
        if (mask.indexOf("?") !== -1) {
            return swerp.decimal.br(value, mask);
        }
        value = swerp.removeMask(value, mask);
        if (!swerp.isEmpty(value)) {
            var subst = swerp.isEmpty(mask) ? "" : mask.match(/#+/g);
            var aux1 = "", aux2 = [], pos = 0;
            if (subst != null) {
                for (var i = 0; i < subst.length; i++) {
                    aux1 = value.toString().substr(0, subst[i].length);
                    value = value.toString().replace(aux1, "");
                    aux2.push(aux1);
                }
                var maskedValue = mask.replace(/#+/g, function (match) {
                    var x = aux2[pos];
                    pos++;
                    return x;
                });
            }
            return maskedValue;
        }
        return value;
    },
    removeMask: function (value, mask) {
        value = value || "";
        var chars = mask.replace(/[^#]/g);
        var stris = mask.match(/[^#]/g);
        if (stris != null) {
            for (var i = 0; i < stris.length; i++) {
                value = value.toString().replace(stris[i], "");
            }
        }
        return value.substr(0, chars.length);
    },
    generateIdUnique: function (length, charSet) {
        length = length || 4;
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < length; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return "_" + randomString;
    },
    listUtilities: {
        updateList: function (list, newValues, start, property) {
            start = start || 0;
            var lastPosition = list.length - 1;
            if (start == lastPosition) {
                start = 0;
            } else {
                start = start + 1;
            }
            for (var i = 0; i < newValues.length; i++) {
                if (!swerp.isEmpty(property)) {
                    list[i + start][property] = newValues[i];
                } else {
                    list[i + start] = newValues[i];
                }
            }
        },
        listApportionmentRecalculation: function (totalRefer, list, index, property) {
            if (!swerp.isEmpty(list) && !swerp.isEmpty(index) && !swerp.isEmpty(property)) {
                var valOfChanged = swerp.isEmpty(list[index][property]) ? list[index] : list[index][property];
                var lastPosition = list.length - 1;
                var sumOfUnchanged = swerp.math.substractFromList(list, [index], property);
                var valor_retirado = (totalRefer - valOfChanged) - sumOfUnchanged;
                var rest;
                if (index == lastPosition) {
                    rest = sumOfUnchanged + valor_retirado;
                    return swerp.math.distribuitionWithoutRet(rest, lastPosition);
                }
                rest = (swerp.math.sumListStartingFrom(list, index, property) - valOfChanged) + valor_retirado;
                return swerp.math.distribuitionWithoutRet(rest, lastPosition - index);
            }
        }
    },
    math: {
        arredondar: function (value, size) {
            if (swerp.isEmpty(value) || isNaN(value)) {
                value = 0;
            }
            if (swerp.isEmpty(size) || isNaN(size)) {
                size = 0;
            }
            var base = Math.pow(10, (parseInt(size)));
            var nValue = (Math.round(parseFloat(value) * base) / base).toFixed(size);
            return parseFloat(nValue);
        },
        distribuitionWithoutRet: function (dividendo, divisor) {
            divisor = divisor == 0 ? 1 : divisor;
            var quociente = swerp.math.arredondar(dividendo / divisor, 2);
            var resto = swerp.math.arredondar(dividendo - (quociente * divisor), 2);
            var retorno = [];
            for (var i = 0; i < divisor; i++) {
                retorno.push(parseFloat((i == (divisor - 1)) ? swerp.math.arredondar(parseFloat(quociente) + parseFloat(resto), 2) : quociente));
            }
            return retorno;
        },
        substractFromList: function (listSource, listSubtract, property) {
            var newlist = [];
            for (var x = 0; x < listSubtract.length; x++) {
                for (var i = 0; i < listSource.length; i++) {
                    if (listSubtract[x] != i)
                        newlist.push(listSource[i]);
                }
            }
            return swerp.math.sum(newlist, property);
        },
        sum: function (list, property, sizeArredondar) {
            var sum = 0;
            if (!swerp.isEmpty(list)) {
                for (var i = 0; i < list.length; i++) {
                    if (!swerp.isEmpty(property)) {
                        sum = sum + parseFloat(eval('list[' + i + '].' + property));
                    } else {
                        sum = sum + parseFloat(list[i]);
                    }
                }
            }
            if (swerp.isEmpty(sizeArredondar)) {
                return sum;
            }
            return swerp.math.arredondar(sum, sizeArredondar);
        },
        sumListStartingFrom: function (list, start, property) {
            var newList = [];
            var lastPosition = list.length - 1;
            start = start || 0;
            if (!swerp.isEmpty(list)) {
                for (var i = start; i < lastPosition + 1; i++) {
                    newList.push(list[i]);
                }
                return swerp.math.sum(newList, property);
            }
            return null;
        }
    },
    decimal: {
        defaultValue: function (value, decimais) {
            var aux = value.toString().replace('.', "");
            value = aux.toString().replace(',', '.');
            decimais = !swerp.isEmpty(decimais) ? parseInt(decimais) : value.toString().indexOf('.') !== -1 ? value.toString().split('.')[1].length : 0;
            value = parseFloat(value);
            return swerp.math.arredondar(value, decimais);
        },
        br: function (value, decimais) {
            if (!swerp.isEmpty(value)) {
                var valueOrig = value;
                var isNegative = value < 0;
                var negative = valueOrig.toString().indexOf('-') !== -1 ? "-" : "";
                decimais = swerp.isEmpty(decimais) ? 2 : decimais;
                decimais = decimais.toString().replace(/\D/gim, "");
                var regx = "", repl = "", fill = "";
                if (decimais == "0") {
                    value = swerp.math.arredondar(value, 0);
                } else {
                    if (value.toString().indexOf('.') !== -1) {
                        value = value.toString().replace(".", ",");
                    }
                    if (value.toString().indexOf(',') !== -1) {
                        var vdec = value.toString().split(",")[1];
                        if (decimais >= value.toString().split(",")[1].length) {
                            fill = swerp.pad(vdec, decimais, 0, 'right');
                            value = value.toString().split(",")[0] + fill;
                        } else {
                            fill = swerp.decimal.defaultValue("0," + vdec, decimais);
                            value = (parseInt(value.toString().split(",")[0]) * (isNegative ? -1 : 1)) + fill;
                        }
                    } else {
                        fill = swerp.pad(0, decimais);
                        value = value + fill;
                    }
                    value = value.toString().replace(/\D/g, "");
                    var fillcheck = fill.toString().split(".");
                    if (!swerp.isEmpty(fillcheck[1])) {
                        var nP = valueOrig.toString().indexOf('.');
                        nP = nP == -1 || nP == 0 ? 1 : nP;
                        value = value.toString().substr(0, nP) + swerp.pad(fillcheck[1], decimais, 0, 'right');
                    }
                }
                for (var i = 0; i < parseInt((value.toString().length - parseInt(decimais)) / 3); i++) {
                    regx = regx.concat('([0-9]{3})');
                    repl = repl.concat('.$' + (i + 1));
                }

                regx = regx.concat('([0-9]{' + decimais.toString() + '})') + "$";
                repl = repl.concat(',$' + (parseInt((value.toString().length - parseInt(decimais)) / 3) + 1));

                var retorno = value.toString().replace(new RegExp(regx, 'g'), repl);
                if (decimais == "0") {
                    return negative + (retorno.toString().replace(",", ""));
                } else {
                    return negative + (((value.toString().length - parseInt(decimais)) % 3) === 0 ? retorno.substr(1) : retorno);
                }
            }
            return value;
        }
    },
    onlyNumbers: function (value) {
        value = swerp.isEmpty(value) ? "" : value;
        try {
            return value.toString().replace(/[^\d]+/g, '');
        } catch (e) {
            console.error(e);
            return '';
        }
    },
    date: {
        isDate: function (date) {
            date = date || "";
            var obj = {
                status: true,
                date: date,
                typeFormat: 'string'
            };
            if (date instanceof Date) {
                obj.status = true;
                obj.date = date;
                typeFormat: 'date'
            }
            if (swerp.isEmpty(date)) {
                obj.status = false;
                obj.date = "";
                obj.typeFormat = null;
            }
            if (swerp.typeOf(date) == 'string' && date.toString().match(/^([012]{1}[0-9]{1}|[3]{1}[01]{1})\/([01]{1}[0-9]{1})\/(\d{4})|( )$/g) == null) {
                obj.status = false;
                obj.value = "";
                obj.typeFormat = null;
            }
            return obj;
        },
        record: function () {
            var d = new Date();
            return d.getFullYear() + swerp.pad(d.getMonth(), 2) + swerp.pad(d.getDate(), 2) + '_' + d.getHours() + d.getMinutes() + d.getSeconds();
        },
        convertRecord: function (date) {
            var isDate = swerp.date.isDate(date);
            if (isDate.typeFormat == 'string') {
                var aux = date.split("/");
                return aux[2] + aux[1] + aux[0];
            }
            if (isDate.typeFormat == 'date') {
                date = swerp.date.isDate(convertBR);
                return swerp.date.convertRecord(convertBR);
            }
            return "";
        },
        convertBR: function (date) {
            date = date || new Date();
            if (!(date instanceof Date)) {
                date = date.indexOf('T') !== -1 ? date.substr(0, date.indexOf('T')) : date;
                var read = date.replace(/\-/g, "/").split("/");
                return read[2].substr(0, 4) + "/" + read[1] + "/" + read[0];
            }
            var dia = date.getDate();
            if (dia.toString().length === 1)
                dia = "0" + dia;
            var mes = date.getMonth() + 1;
            if (mes.toString().length === 1)
                mes = "0" + mes;
            var ano = date.getFullYear();
            return dia + "/" + mes + "/" + ano;
        },
        convertDF: function (date) {
            if (date instanceof Date) {
                return date;
            }
            if (swerp.isEmpty(date)) {
                return new Date;
            }
            var read = date.replace(/\-/g, "/").split("/");
            return new Date(read[2].substr(0, 4) + "/" + read[1] + "/" + read[0]);
        },
        stringToDateTime: function (stringDate) {
            try {
                //exemplo 13/05/2019 17:14:37
                if (stringDate instanceof Date) {
                    return stringDate;
                }
                if (swerp.typeOf(stringDate) === 'string') {
                    var a = stringDate.split("/");
                    var b = a[2].split(" ");
                    if (stringDate.indexOf(':') === -1) {
                        b[1] = "00:00:00";
                    }
                    var c = b[1].split(":");
                    return new Date(b[0], (a[1] - 1), a[0], c[0], c[1], c[2]);
                }
                return null;
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        dayAddition: function (dateBase, qtde) {
            var dateBaseNormalizada = swerp.date.stringToDateTime(dateBase);
            if (dateBaseNormalizada === null) {
                dateBaseNormalizada = new Date();
                return {
                    df: dateBaseNormalizada,
                    br: swerp.date.convertBR(dateBaseNormalizada)
                };
            }
            dateBaseNormalizada.setDate(dateBaseNormalizada.getDate() + parseInt(qtde || 0));
            return {
                df: dateBaseNormalizada,
                br: swerp.date.convertBR(dateBaseNormalizada)
            };
        },
        subtraction: function (date1, date2) {
            var dataAtual = new Date();
            date1 = swerp.isEmpty(date1) ? dataAtual : swerp.date.stringToDateTime(date1);
            date2 = swerp.isEmpty(date2) ? dataAtual : swerp.date.stringToDateTime(date2);
            var calc = Math.abs(date2 - date1);
            return {
                dias: (calc / (1000 * 60 * 60 * 24)) + 1,
                horas: (calc / (1000 * 60 * 60))
            };
        }
    },
    cfopUtil: {
        tipo: function (cfop) {
            return swerp.isEmpty(cfop) ? "" : cfop.toString().substr(0, 1);
        }
    },
    getlocalStorageObj: function (name) {
        var valor = localStorage.getItem('adminGen_' + name);
        if (!swerp.isEmpty(valor)) {
            try {
                var retorno = angular.isString(valor) ? angular.fromJson(valor) : valor;
                return retorno;
            } catch (e) {
                return null;
            }
        }
        return null;
    },
    setlocalStorageObj: function (name, obj) {
        try {
            localStorage.setItem('adminGen_' + name, angular.toJson(obj));
        } catch (e) {
            //todo;
        }
    },
    removeItemLocalStorageObj: function (name) {
        localStorage.removeItem('adminGen_' + name);
    },
    copylocal: function (v) {
        swerp.notificacaoEAlertas('success', 'Salvo na Area de Transferência');
        swerp.setlocalStorageObj('copylocal', angular.copy(v));
    },
    pastelocal: function () {
        return swerp.getlocalStorageObj('copylocal');
    },
    createPagination: function (totalPaginas, paginaAtual, np) {
        //np - NUMERO DE LIMITE DE PAGINAS A SER EXIBIDO.
        np = np || 5;
        /*
         * OBJETO DE RETORNO
         */
        var listaDePagina = [];
        paginaAtual = paginaAtual || 0;
        totalPaginas = totalPaginas + 1;
        /*
         * CALCULO
         */
        //1º DEFINI A PRIMEIRA OPÇÃO DA LISTA
        var first = paginaAtual % np === 0 ? paginaAtual : paginaAtual - (paginaAtual % np);
        //2º VALIDAÇÃO DE SEGURANÇÃO
        var last = totalPaginas <= np ? totalPaginas : np;
        //3º DEFINE A ULTIMA OPÇÃO DA LISTA
        last = (totalPaginas - first) > np ? last : totalPaginas - first;
        var count = first;
        for (var i = 0; i < last; i++) {
            listaDePagina[i] = {};
            listaDePagina[i].label = count + 1;
            listaDePagina[i].numero = count;
            count++;
        }

        return listaDePagina;
    },
    copyObj: function (objDestino, objOrigem) {
        for (let prop in objOrigem) {
            if (!['object', 'array'].contains(swerp.typeOf(objOrigem[prop]))) {
                if (!swerp.isEmpty(objDestino[prop]) && !swerp.isEmpty(objOrigem[prop])) {
                    objDestino[prop] = angular.copy(objOrigem[prop]);
                }
            } else {
                if (swerp.typeOf(objOrigem[prop]) === 'object') {
                    swerp.copyObj(objDestino[prop], objOrigem[prop]);
                } else {
                    for (let i = 0; i < objOrigem[prop].length; i++) {
                        swerp.copyObj(objDestino[prop][i], objOrigem[prop][i]);
                    }
                }
            }
        }
    }
};
Date.convertBR = swerp.date.convertBR;
Date.convertDF = swerp.date.convertDF;
Date.record = swerp.date.record;