var zoneDirector;
var company;
V = Class.create();
V.reWhitespace = /^\s+$/;
V.reAlphanumeric = /^[a-zA-Z0-9]+$/;
V.reNumber = /^[0-9]+$/;
V.reSysName = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;
V.reRegName = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;
V.reDevName = /^[a-zA-Z0-9][\sa-zA-Z0-9_-]*$/;
V.reLetterOrDigit = /^([a-zA-Z]|\d)$/;
V.reDigit = /^\d/;
V.reInteger = /^\d+$/;
V.reEssid = /(^[!-~]([ -~]){0,30}[!-~]$)|(^[!-~]$)/;
V.reAreaName = /^(?:[!-~]|(?:[!-~]([ -~]){0,30}[!-~]))$/;
V.rePassphrase = /(^[!-~]([ -~]){6,61}[!-~]$)|(^([0-9a-fA-F]){64}$)/;
V.reWEP64 = /^([0-9a-fA-F]){10}$/;
V.reWEP128 = /^([0-9a-fA-F]){26}$/;
V.reGPS = /^[-]?([0-9]){1,3}(\.([0-9]){1,8})?$/;
V.rePassword = /^[!-~]([ -~]){2,30}[!-~]$/;
V.reSnmpv3Passphrase = /(^[!-~]([ -~]){6,30}[!-~]$)|(^([0-9a-fA-F]){32}$)/;
V.reAscii = /^[\x21-\x7e]*$/;
V.reMulAddr = /^([f]){2}/;
V.reVLANs = /^\d{1,4}(-\d{1,4}){0,1}(,\d{1,4}(-\d{1,4}){0,1}){0,15}$/;
V.reCertCountryCode = /^[a-zA-Z][a-zA-Z]$/;
V.wildcard = "Any";
V.wc = "*";
V.trim = function(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
};
V._trim = function(id) {
    var s = V.trim($F(id));
    $(id).value = s;
    return s;
};
V.highlight = function(id, _f65) {
    Element.addClassName(id, "errorhighlight");
    Field.activate(id);
    setTimeout((function() {
        Element.removeClassName(id, "errorhighlight");
    }).bind(this), _f65 ? _f65 : 5000);
};
V.normal = function(id) {
    Element.removeClassName(id, "errorhighlight");
};
V.checkASCII = function(id, msg) {
    V.normal(id);
    var s = V._trim(id);
    if (!V.reAscii.test(s)) {
        return V.promptError(id, msg);
    }
    return true;
};
V.checkMACAuth = function(id, id2, name) {
    V.normal(id);
    V.normal(id2);
    var s = V._trim(id);
    if (s < 3) {
        return V.promptError(id2, V.localize(Msg.E_FailMACAuth, name));
    }
    return true;
};
V.checkEmpty = function(id, name) {
    V.normal(id);
    var s = V._trim(id);
    if (s == null || s == "" || V.reWhitespace.test(s)) {
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    return true;
};
V.checkLength = function(id, min, max, name) {
    V.normal(id);
    var s = V._trim(id);
    if (s.length < min || s.length > max) {
        return V.promptError(id, V.localize(Msg.E_FailLength, name, min, max));
    }
    return true;
};
V.checkRE = function(id, re, msg) {
    V.normal(id);
    var s = V._trim(id);
    if (!re.test(s)) {
        return V.promptError(id, msg);
    }
    return true;
};
V.checkGPS = function(id1, id2, msg) {
    V.normal(id1);
    V.normal(id2);
    var s1 = V._trim(id1);
    var s2 = V._trim(id2);
    if (s1 == "" && s2 == "") {
        return true;
    }
    if (s1 == "" && s2 != "") {
        return V.promptError(id1, msg);
    }
    if (s1 != "" && s2 == "") {
        return V.promptError(id2, msg);
    }
    if (!V.reGPS.test(s1)) {
        return V.promptError(id1, msg);
    }
    if (!V.reGPS.test(s2)) {
        return V.promptError(id2, msg);
    }
    if (s1 < -90 || s1 > 90) {
        return V.promptError(id1, msg);
    }
    if (s2 < -180 || s2 > 180) {
        return V.promptError(id2, msg);
    }
    return true;
};
V.checkDevName = function(id, msg) {
    V.normal(id);
    var s = V._trim(id);
    var re = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
    if (s == "") {
        return true;
    }
    if (!V.reDevName.test(s)) {
        if (!re.test(s)) {
            return V.promptError(id, msg);
        }
    }
    return true;
};
V.checkPosInteger = function(id, name) {
    V.normal(id);
    var s = V._trim(id);
    if (V.reInteger.test(s) && s > 0) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailPosInteger, name));
};
V.checkProtocol = function(id, name, _f88) {
    V.normal(id);
    var s = V._trim(id);
    var _f8a = /^\d{1,3}$/;
    if (_f8a.test(s) && s >= 0 && s < 255 || s.toLowerCase() == V.wildcard.toLowerCase() || (s == "" && _f88)) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailProtocol, name));
};
V.checkPort = function(id, name, _f8d) {
    V.normal(id);
    var s = V._trim(id);
    var _f8f = /^\d{1,5}$/;
    if (_f8f.test(s) && s > 0 && s < 65535 || s.toLowerCase() == V.wildcard.toLowerCase() || (s == "" && _f8d)) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailPort, name));
};
V.checkPortRange = function(id, name, _f92) {
    V.normal(id);
    var s = V._trim(id);
    var _f94 = /^\d{1,5}-\d{1,5}$/;
    if (_f94.test(s)) {
        var _f95 = s.split("-");
        if (parseInt(_f95[0]) > parseInt(_f95[1])) {
            $(id).value = _f95[1] + "-" + _f95[0];
        }
        return true;
    }
    return V.checkPort(id, name, _f92);
};
V.checkIcmpv6Type = function(id, name, _f98) {
    V.normal(id);
    var s = V._trim(id);
    var _f9a = /^\d{1,3}$/;
    if (_f9a.test(s) && s >= 0 && s < 255 || s.toLowerCase() == V.wildcard.toLowerCase() || (s == "" && _f98)) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailProtocol, name));
};
V.checkIP = function(id, name, _f9d) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "") {
        if (_f9d) {
            return true;
        }
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    if (!V.isValidIP(s)) {
        return V.promptError(id, V.localize(Msg.E_FailIP, name, s));
    }
    return true;
};
V.checkIPv6 = function(id, name, _fa1) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "") {
        if (_fa1) {
            return true;
        }
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    if (!V.isValidIPv6(s)) {
        return V.promptError(id, V.localize(Msg.E_FailIP, name, s));
    }
    return true;
};
V.checkIPv4OrIPv6 = function(id, name, _fa5, _fa6) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "") {
        if (_fa5) {
            return true;
        }
        if (_fa6) {
            return false;
        }
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    if (V.isValidIP(s) || V.isValidIPv6(s)) {
        return true;
    } else {
        if (_fa6) {
            return false;
        }
        return V.promptError(id, V.localize(Msg.E_FailIP, name, s));
    }
    return true;
};
V.isValidIP = function(ip) {
    var reIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (reIP.test(ip)) {
        var _faa = ip.split(".");
        if (_faa[0] >= 1 && _faa[0] <= 223 && _faa[1] >= 0 && _faa[1] <= 255 && _faa[2] >= 0 && _faa[2] <= 255 && _faa[3] >= 0 && _faa[3] <= 255) {
            return true;
        }
    }
    return false;
};
V.isIP = function(ip) {
    var reIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (reIP.test(ip)) {
        var _fad = ip.split(".");
        if (_fad[0] >= 0 && _fad[0] <= 255 && _fad[1] >= 0 && _fad[1] <= 255 && _fad[2] >= 0 && _fad[2] <= 255 && _fad[3] >= 0 && _fad[3] <= 255) {
            return true;
        }
    }
    return false;
};
V.isValidIPv6 = function(ip) {
    var _faf = (/::/.test(ip) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(ip) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(ip));
    if (_faf) {
        var _fb0 = ip.split(":");
        var part = _fb0[0].toLowerCase();
        if (V.reMulAddr.test(part)) {
            return false;
        }
        return true;
    }
    return false;
};
V.isIPv6 = function(ip) {
    return (/::/.test(ip) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(ip) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(ip));
};
V.checkIPMask = function(_fb3, _fb4, _fb5, _fb6) {
    V.normal(_fb3);
    V.normal(_fb5);
    var ip = _Fd1(V._trim(_fb3));
    var mask = _Fd1(V._trim(_fb5));
    if ((ip & ~mask) == 0 || (ip | mask) == -1) {
        V.promptError(_fb3, V.localize(Msg.E_FailIP, _fb4, V._trim(_fb3)));
        return false;
    }
    return true;
};
V.checkSubnetId = function(ip) {
    var reIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    var s = V._trim(ip);
    if (reIP.test(s)) {
        var _fbc = s.split(".");
        if (_fbc[0] >= 1 && _fbc[0] <= 223 && _fbc[1] >= 0 && _fbc[1] <= 255 && _fbc[2] >= 0 && _fbc[2] <= 255 && _fbc[3] >= 0 && _fbc[3] <= 255) {
            return true;
        }
    }
    return false;
};
V.checkNetmask = function(id, name, _fbf) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "") {
        if (_fbf) {
            return true;
        }
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    var _fc1 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (_fc1.test(s)) {
        var _fc2 = true;
        var _fc3 = false;
        var _fc4 = s.split(".");
        for (var i = 0; i < _fc4.length; i++) {
            if (_fc4[i] > 255 || _fc4[i] < 0) {
                _fc3 = true;
                break;
            }
            for (var j = 128; j >= 1; j = j / 2) {
                if ((_fc4[i] & j) > 0) {
                    if (!_fc2) {
                        _fc3 = true;
                        break;
                    }
                } else {
                    _fc2 = false;
                }
            }
            if (_fc3) {
                break;
            }
        }
        if (!_fc3) {
            return true;
        }
    }
    return V.promptError(id, V.localize(Msg.E_FailNetmask, name, s));
};
V.checkSubnet = function(id, name, _fc9) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "" || s.toLowerCase() == V.wildcard.toLowerCase()) {
        if (_fc9) {
            return true;
        }
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    var _fcb = s.split("/");
    if (V.isIP(_fcb[0]) && _fcb[1] > 0 && _fcb[1] <= 32) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailSubnet, name, s));
};
V.checkIPv6Scope = function(id, name, _fce) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "" || s.toLowerCase() == V.wildcard.toLowerCase()) {
        if (_fce) {
            return true;
        }
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    var _fd0 = s.split("/");
    if (V.isIPv6(_fd0[0]) && _fd0[1] > 0 && _fd0[1] <= 128) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailSubnet6, name, s));
};
V.checkMAC = function(id, name, _fd3, _fd4) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "") {
        if (_fd3) {
            return true;
        }
        if (_fd4) {
            return false;
        }
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    var re = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
    if (re.test(s)) {
        return true;
    }
    if (_fd4) {
        return false;
    }
    return V.promptError(id, V.localize(Msg.E_FailMAC, name, s));
};
V.checkEmail = function(id, name, _fd9) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "") {
        if (_fd9) {
            return true;
        }
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (re.test(s)) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailEmail, name, s));
};
V._checkSame = function(id1, id2, _fde, _fdf, _fe0) {
    V.normal(id1);
    V.normal(id2);
    var s1 = V._trim(id1);
    var s2 = V._trim(id2);
    if (!_fe0) {
        if (s1 == "") {
            V.promptError(id1, V.localize(Msg.E_FailEmpty, _fde));
            return "empty";
        }
        if (s2 == "") {
            V.promptError(id2, V.localize(Msg.E_FailEmpty, _fdf));
            return "empty";
        }
    }
    if (s1 == s2) {
        return true;
    }
    return false;
};
V.checkSame = function(id1, id2, _fe5, _fe6, _fe7) {
    var res = V._checkSame(id1, id2, _fe5, _fe6, _fe7);
    if (res == "empty") {
        return false;
    } else {
        if (res) {
            return true;
        }
    }
    return V.promptError(id1, V.localize(Msg.E_FailSame, _fe5, _fe6));
};
V.checkDiff = function(id1, id2, _feb, _fec, _fed) {
    var res = V._checkSame(id1, id2, _feb, _fec, _fed);
    if (res == "empty") {
        return false;
    } else {
        if (!res) {
            return true;
        }
    }
    return V.promptError(id1, V.localize(Msg.E_FailDiff, _feb, _fec));
};
V.checkIPRange = function(id1, id2, _ff1, _ff2) {
    V.normal(id1);
    V.normal(id2);
    var s1 = V._trim(id1);
    var s2 = V._trim(id2);
    if (s1 == "") {
        return V.promptError(id1, V.localize(Msg.E_FailEmpty, _ff1));
    }
    if (s2 == "") {
        return V.promptError(id2, V.localize(Msg.E_FailEmpty, _ff2));
    }
    if (_Fd1(s1) < _Fd1(s2)) {
        return true;
    }
    return V.promptError(id1, V.localize(Msg.E_FailIPRange, s1, s2));
};
V.checkVLAN = function(id, name, _ff7) {
    V.normal(id);
    var s = V._trim(id);
    var _ff9 = /^\d{1,4}$/;
    if (_ff7 && s == "") {
        return true;
    }
    if (_ff9.test(s) && s > 0 && s < 4095) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailVLAN, name));
};
V.checkRange = function(id, name, min, max, _ffe) {
    V.normal(id);
    var s = V._trim(id);
    if (!_ffe && s == "") {
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    if (V.reNumber.test(s) && s >= min && s <= max) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailRange, name, min, max));
};
V.checkDigit = function(id, name, _1002, _1003, _1004) {
    V.normal(id);
    var s = V._trim(id);
    var len = s.length;
    if (!_1004 && s == "") {
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    if (V.reNumber.test(s) && len >= _1002) {
        if (!_1003 || len <= _1003) {
            return true;
        }
    }
    if (!_1003) {
        return V.promptError(id, V.localize(Msg.E_FailDigit1, name, _1002));
    }
    return V.promptError(id, V.localize(Msg.E_FailDigit2, name, _1002, _1003));
};
V.checkUTF8Name = function(id, name, max, type) {
    V.normal(id);
    var s = V._trim(id);
    var ss = s.match(/[^\x00-\xff]/ig), len = (ss) ? (ss.length * 2 + s.length) : s.length;
    if (ss && type == "eng") {
        return V.promptError(id, V.localize(Msg.E_FailUTF8Name, name));
    }
    if (len <= max) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailUTF8NameLen, name, max));
};
V.checkMultiple = function(id, name, mult) {
    V.normal(id);
    var s = V._trim(id);
    if (s == "") {
        return V.promptError(id, V.localize(Msg.E_FailEmpty, name));
    }
    if (V.reNumber.test(s) && (s % mult) == 0) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailMultiple, name, mult));
};
V.checkUsername = function(id, name) {
    V.normal(id);
    var s = V._trim(id);
    var _1014 = /^[a-zA-Z][a-zA-Z.0-9_]*$/;
    if (_1014.test(s) && s.length <= 32) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailUsername, name));
};
V.checkPassword = function(id, name) {
    if (V._checkPassword(id, name, true)) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailPassword, name));
};
V.checkOldPassword = function(id, name) {
    if (V._checkPassword(id, name)) {
        return true;
    }
    return V.promptError(id, V.localize(Msg.E_FailOldPassword, name));
};
V._checkPassword = function(id, name, _101b) {
    V.normal(id);
    var s = V._trim(id);
    if (_101b && s == "********") {
        return true;
    }
    if (V.rePassword.test(s) && s.length >= 4 && s.length <= 32) {
        return true;
    }
    return false;
};
V.checkVlanSet = function(id, name, max, _1020) {
    showErr = _1020 || V.promptError;
    var str, count = 0;
    V.normal(id);
    str = $F(id).replace(/\s/g, "");
    if (str == "") {
        showErr(id, v.localize(Msg.E_FailEmpty, name));
        return false;
    }
    if (!V.reVLANs.test(str)) {
        showErr(id, V.localize(Msg.E_BadVLANsFormat, name));
        return false;
    }
    var str = str.replace(/(\d+)\-(\d+)/g, function(n, b, e) {
        if (b && e) {
            b = parseInt(b);
            e = parseInt(e);
            if (b > e) {
                var tmp = b;
                b = e;
                e = tmp;
            }
            var ret = [b];
            while (b < e) {
                ret.push(++b);
            }
        }
        return ret.join(",");
    });
    var _1027 = str.split(",").sort(function(a, b) {
        return a - b;
    });
    var low = parseInt(_1027[0]), high = parseInt(_1027[_1027.length - 1]);
    if (low < 1 || high > 4094) {
        showErr(id, V.localize(Msg.E_VLANOutOfScope, name));
        return false;
    }
    if ((count = _1027.length) <= 1) {
        return true;
    }
    var array = [];
    high = low;
    for (var i = 1; i < _1027.length; i++) {
        var s = parseInt(_1027[i]);
        if (s - high == 0) {
            count--;
        } else {
            if (s - high == 1) {
                high = s;
            } else {
                if (high == low) {
                    array.push(low);
                } else {
                    array.push(low + "-" + high);
                }
                high = low = s;
            }
        }
    }
    if (high == low) {
        array.push(low);
    } else {
        array.push(low + "-" + high);
    }
    if (count > max) {
        showErr(id, V.localize(Msg.E_ExceedMaxCounter, name, max));
        return false;
    }
    $(id).value = array.toString();
    return true;
};
V.isSameSubnet = function(ip1, ip2, _1030) {
    var _1031, ip2Value, netmaskValue;
    if (V.reInteger.test(ip1)) {
        _1031 = ip1;
        ip1 = _Fe1(_1031);
    } else {
        _1031 = _Fd1(ip1);
    }
    if (V.reInteger.test(ip2)) {
        ip2Value = ip2;
        ip2 = _Fe1(ip2Value);
    } else {
        ip2Value = _Fd1(ip2);
    }
    if (V.reInteger.test(_1030)) {
        netmaskValue = _1030;
        _1030 = _Fe1(netmaskValue);
    } else {
        netmaskValue = _Fd1(_1030);
    }
    if ((_1031 & netmaskValue) == (ip2Value & netmaskValue)) {
        return true;
    } else {
        return false;
    }
};
V.isSameScope = function(ip1, ip2, _1034) {
    var _1035, ip2Value;
    var i;
    var addr1, addr2;
    var _1038 = 2;
    _1035 = ip1.toLowerCase();
    ip2Value = ip2.toLowerCase();
    if (!V.isIPv6(ip2Value)) {
        return false;
    }
    var _1039 = ip2Value.split(":");
    if (_1039[0] == "fe80") {
        return true;
    } else {
        addr1 = _Ff1(_1035);
        addr2 = _Ff1(ip2Value);
        for (i = 0; i < parseInt(_1034 / (_1038 * 8), 10); i++) {
            if (addr1[i] != addr2[i]) {
                return false;
            }
        }
        if ((parseInt(addr1[parseInt(_1034 / (_1038 * 8))], 16) >> ((_1038 * 8) - _1034 % (_1038 * 8))) != (parseInt(addr2[parseInt(_1034 / (_1038 * 8))], 16) >> ((_1038 * 8) - _1034 % (_1038 * 8)))) {
            return false;
        }
    }
    return true;
};
V.checkSameSubnet = function(id, name, ip1, ip2, _103e, act) {
    var flag = V.isSameSubnet(ip1, ip2, _103e);
    if (flag) {
        return true;
    } else {
        if (act == "0") {
            V.promptError(id, V.localize(Msg.E_FailSameSubnet, ip1, ip2, _103e));
            return false;
        } else {
            if (act == "1") {
                flag = V.promptConfirm(id, V.localize(Msg.E_FailSameSubnetWithWarning, ip1, ip2, _103e)) ? "yes" : false;
                return flag;
            }
        }
    }
    flag = V.promptConfirm(id, V.localize(Msg.E_FailSameSubnetWithConfirm, ip1, ip2, _103e)) ? "yes" : false;
    return flag;
};
V.checkSameScope = function(id, name, ip1, ip2, _1045, act) {
    var flag = V.isSameScope(ip1, ip2, _1045);
    if (flag) {
        return true;
    } else {
        if (act == "0") {
            V.promptError(id, V.localize(Msg.E_FailSameScope, ip1, ip2, _1045));
            return false;
        } else {
            if (act == "1") {
                flag = V.promptConfirm(id, V.localize(Msg.E_FailSameScopeWithWarning, ip1, ip2, _1045)) ? "yes" : false;
                return flag;
            }
        }
    }
    flag = V.promptConfirm(id, V.localize(Msg.E_FailSameScopeWithConfirm, ip1, ip2, _1045)) ? "yes" : false;
    return flag;
};
V.checkSubAltName = function(id, name) {
    var s = V._trim(id);
    var san = s.replace(/^\s*|\s*$/g, "");
    if (san != "") {
        var reIP = /^IP:*/;
        var reDNS = /^DNS:*/;
        if (!reIP.test(san) && !reDNS.test(san)) {
            V.promptConfirm(id, V.localize(Msg.E_CertSANFormatErr, name));
            return false;
        }
    }
    $(id).value = san;
    return true;
};
V.checkSingleEntry = function(id, name) {
    V.normal(id);
    var s = V._trim(id);
    var _1051 = /[,; ]/;
    if (_1051.test(s)) {
        V.promptConfirm(id, V.localize(Msg.E_MultipleItemsNotAllowed, name));
        return false;
    }
    return true;
};
V.checkCounrtyCode = function(id, name) {
    V.normal(id);
    var s = V._trim(id).toUpperCase();
    if (!V.reCertCountryCode.test(s)) {
        return V.promptError(id, V.localize(Msg.E_FailCountryCode, name));
    }
    return true;
};
V.confirmSameIpPair = function(msg, i1, i2, j1, j2) {
    var same = false;
    if (i1 == j1 && i2 == j2) {
        same = true;
    } else {
        if (i1 == j2 && i2 == j1) {
            same = true;
        }
    }
    if (same == false) {
        return confirm(msg);
    }
    return same;
};
V.promptError = function(id, msg) {
    if (id != "") {
        V.highlight(id);
    }
    alert(msg);
    return false;
};
V.promptConfirm = function(id, msg) {
    if (confirm(msg)) {
        return true;
    }
    V.highlight(id);
    return false;
};
V.localizeOEMString = function(msg) {
    if (zoneDirector) {
        msg = msg.replace(/\{zd\}/g, zoneDirector);
    }
    if (company) {
        msg = msg.replace(/\{cn\}/g, company);
    }
    return msg;
};
V.localize = function(msg) {
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp("\\{" + i + "\\}", "g");
        msg = msg.replace(re, arguments[i]);
    }
    msg = V.localizeOEMString(msg);
    return msg;
};
V.localizeArgs = function(msg, args) {
    for (var i = 0; i < args.length; i++) {
        var re = new RegExp("\\{" + (i + 1) + "\\}", "g");
        msg = msg.replace(re, args[i]);
    }
    msg = V.localizeOEMString(msg);
    return msg;
};
