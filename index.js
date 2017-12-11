"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var media_1 = require("@ionic-native/media");
var isArray_1 = require("rxjs/util/isArray");
var BASE_API_PATH = "http://192.168.60.113/api/v2/";
//const BASE_API_PATH: string = "https://dev.zero.eu/API/v1/";
/*export interface ZeroEntity {}

export interface Activity extends ZeroEntity {
    type: string;
    subtype?: string;
    target?: ElementSummary;
}

export interface ElementSummary {
    id: number;
    title?: string;
    image?: string;
}

export interface UserInfo {
    id: string;
    name: string;
    lastname: string;
    email: string;
    image: string;
    enablePushNotifications?: boolean,
    enableNewsletter?: boolean,
    isConnectedToFacebook?: boolean
}

export interface EventInterface extends ZeroEntity{
    id: string;
    title: string;
    image: string;
    venue: Venue;
    info: EventInfo;
    isOnSale: boolean;
}

export interface EventInfo {
    startTime: Date;
    endTime: Date;
    days?: number;
}

export interface Venue extends ZeroEntity{
    id: string;
    name: string;
    position: Geoposition;
    image: string;
    url?: string;
}

export interface Geoposition {
    coords: {
        lat: number;
        lng: number;
    }
    address: string;
}

export interface Sector {
    id: string;
    description: string;
    prices: Price[];
}

export interface Price {
    id: string;
    description: string;
    availability: number;
    net: number;
    presale?: number;
    commission?: number;
}

export interface SearchResult {
    events?: SearchElement[];
    venues?: SearchElement[];
    artists?: SearchElement[];
}

export interface SearchElement {
    id: number,
    category: string,
    title: string,
    subtitle: string,
    image: string
}

export interface Ticket extends ZeroEntity{
    title: string;
    price: string;
}

export interface Artist extends ZeroEntity {
    id: string;
    name: string;
    image: string;
    topTrack: Track;
}*/
var EZError = (function (_super) {
    __extends(EZError, _super);
    function EZError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        return _this;
    }
    EZError.fromString = function (reason, separator) {
        if (separator === void 0) { separator = ':'; }
        var err = reason.split(separator);
        if (err.length == 2) {
            var code = reason.split(separator)[0];
            var msg = reason.split(separator)[1];
            if (!isNaN(parseInt(code))) {
                return new EZError(parseInt(code), msg);
            }
            else {
                if (!isNaN(parseInt(msg))) {
                    return new EZError(parseInt(msg), code);
                }
                else {
                    return new EZError(500, reason);
                }
            }
        }
        else {
            return new EZError(500, reason);
        }
    };
    return EZError;
}(Error));
exports.EZError = EZError;
var EZUser = (function () {
    function EZUser(id, first_name, last_name, email, profile_image, enable_push_notifications, enable_email_notifications, enable_newsletter, is_connected_to_facebook) {
        if (enable_push_notifications === void 0) { enable_push_notifications = false; }
        if (enable_email_notifications === void 0) { enable_email_notifications = false; }
        if (enable_newsletter === void 0) { enable_newsletter = false; }
        if (is_connected_to_facebook === void 0) { is_connected_to_facebook = false; }
        this.enable_push_notifications = false;
        this.enable_email_notifications = false;
        this.enable_newsletter = false;
        this.is_connected_to_facebook = false;
        if (!id || !first_name || !last_name || !email)
            return null;
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.profile_image = profile_image;
        this.enable_push_notifications = enable_push_notifications;
        this.enable_email_notifications = enable_email_notifications;
        this.enable_newsletter = enable_newsletter;
        this.is_connected_to_facebook = is_connected_to_facebook;
    }
    EZUser.json = function (json) {
        return new EZUser(json.id, json.first_name, json.last_name, json.email, EZImage.json(json.profile_image), json.enable_push_notifications, json.enable_email_notifications, json.enable_newsletter, json.is_connected_to_facebook);
    };
    EZUser.prototype.preferences = function () {
        return { enable_push_notifications: this.enable_push_notifications, enable_email_notifications: this.enable_email_notifications, enable_newsletter: this.enable_newsletter, is_connected_to_facebook: this.is_connected_to_facebook };
    };
    EZUser.prototype.info = function () {
        return { id: this.id, first_name: this.first_name, last_name: this.last_name, email: this.email };
    };
    return EZUser;
}());
exports.EZUser = EZUser;
var EZDay = (function () {
    function EZDay(date, events) {
        this.date = date;
        this.events = events;
    }
    EZDay.json = function (json) {
        return new EZDay(new Date(json.date), EZEvent.array(json.events));
    };
    EZDay.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var ev = EZDay.json(arr[0]);
            if (ev)
                ret.push(ev);
        }
        return ret;
    };
    return EZDay;
}());
exports.EZDay = EZDay;
var EZEvent = (function () {
    function EZEvent(id, name, startDate, endDate, startTime, endTime, isRegular, price, excerpt, category, featured_image, gallery, venue, artists) {
        if (isRegular === void 0) { isRegular = false; }
        if (category === void 0) { category = []; }
        if (gallery === void 0) { gallery = []; }
        if (artists === void 0) { artists = []; }
        this.isRegular = false;
        this.id = id;
        this.name = name;
        this.isRegular = isRegular;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.price = price;
        this.excerpt = excerpt;
        this.category = category;
        this.featured_image = featured_image;
        this.gallery = gallery;
        this.artists = artists;
        this.venue = venue;
    }
    EZEvent.json = function (jsonEvent) {
        var id = jsonEvent.id;
        var name = jsonEvent.name.plain;
        var isRegular = jsonEvent.is_regular ? jsonEvent.is_regular : false;
        var startDate = jsonEvent.start_date ? new Date(jsonEvent.start_date) : null;
        var endDate = jsonEvent.end_date ? new Date(jsonEvent.end_date) : null;
        var startTime = jsonEvent.start_time ? new Date(jsonEvent.start_time) : null;
        var endTime = jsonEvent.end_time ? new Date(jsonEvent.end_date) : null;
        var price = EZPrice.json(jsonEvent.price);
        var excerpt = jsonEvent.excerpt && jsonEvent.excerpt.hasOwnProperty("plain") ? jsonEvent.excerpt.plain : null;
        var category = isArray_1.isArray(jsonEvent.category) ? jsonEvent.category : [];
        var featured_image = EZImage.json(jsonEvent.featured_image);
        var gallery = EZImage.array(jsonEvent.gallery);
        var artists = jsonEvent._embedded && jsonEvent._embedded.artists && jsonEvent._embedded.artists.length > 0 ? EZArtist.array(jsonEvent.artists) : [];
        var venue = (jsonEvent._embedded && jsonEvent._embedded.venue && jsonEvent._embedded.venue.length > 0) ? EZVenue.json(jsonEvent._embedded.venue[0]) : null;
        if (!id || !name || !startDate || !venue)
            return null;
        return new EZEvent(id, name, startDate, endDate, startTime, endTime, isRegular, price, excerpt, category, featured_image, gallery, venue, artists);
    };
    EZEvent.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var ev = EZEvent.json(arr[0]);
            if (ev)
                ret.push(ev);
        }
        return ret;
    };
    return EZEvent;
}());
exports.EZEvent = EZEvent;
var EZVenue = (function () {
    function EZVenue(id, name, featured_image, gallery, phone, website, rate, address, coords, category, excerpt, openingHours, priceLevel) {
        if (gallery === void 0) { gallery = []; }
        if (category === void 0) { category = []; }
        this.gallery = [];
        this.category = [];
        this.id = id;
        this.name = name;
        this.featured_image = featured_image;
        this.gallery = gallery;
        this.phone = phone;
        this.website = website;
        this.rate = rate;
        this.address = address;
        this.coords = coords;
        this.excerpt = excerpt;
        this.category = category;
        this.openingHours = openingHours;
        this.priceLevel = priceLevel;
        if (!id || !name)
            return null;
    }
    EZVenue.json = function (json) {
        var id = json.id;
        var name = json.name;
        var featured_image = EZImage.json(json.featured_image);
        var gallery = isArray_1.isArray(json.gallery) ? EZImage.array(json.gallery) : null;
        var phone = json.phone;
        var website = json.website;
        var rate = (typeof json.rate == 'number') ? json.rate : null;
        var address = json.address;
        var coords = json.coordinate && json.coordinate.hasOwnProperty('lat') && json.coordinate.hasOwnProperty('lng') ? json.coordinate : null;
        var excerpt = json.excerpt && json.excerpt.hasOwnProperty("plain") ? json.excerpt.plain : null;
        var category = json.category;
        var openingHours = EZTable.json(json.openingHours);
        var priceLevel = (typeof json.price_level == 'number') ? json.price_level : null;
        return new EZVenue(id, name, featured_image, gallery, phone, website, rate, address, coords, category, excerpt, openingHours, priceLevel);
    };
    EZVenue.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var venue = EZVenue.json(arr[0]);
            if (venue)
                ret.push(venue);
        }
        return ret;
    };
    return EZVenue;
}());
exports.EZVenue = EZVenue;
var EZImage = (function () {
    function EZImage(thumb, standard, large) {
        if (thumb || standard || large) {
            this.thumb = thumb;
            this.standard = standard;
            this.large = large;
        }
        else {
            return null;
        }
    }
    EZImage.json = function (jsonImage) {
        if (typeof jsonImage == "string")
            return new EZImage(null, jsonImage, null);
        var thumb = jsonImage.sizes.thumbnail ? jsonImage.sizes.thumbnail.file : null;
        var standard = jsonImage.sizes.medium ? jsonImage.sizes.medium.file : null;
        var large = jsonImage.sizes.large ? jsonImage.sizes.large.file : null;
        if (thumb || standard || large) {
            return new EZImage(thumb, standard, large);
        }
        return null;
    };
    EZImage.array = function (jsonArray) {
        var ret = [];
        if (!isArray_1.isArray(jsonArray) || jsonArray.length == 0)
            return ret;
        for (var i = 0; i < jsonArray.length; i++) {
            var img = EZImage.json(jsonArray[0]);
            if (img)
                ret.push(img);
        }
        return ret;
    };
    EZImage.prototype.fallBack = function (startFrom) {
        if (startFrom === void 0) { startFrom = 'large'; }
        switch (startFrom) {
            case 'large':
                return this.getStandard();
            case 'standard':
                return this.getThumb();
            case 'thumb':
                return null;
            default:
                return null;
        }
    };
    EZImage.prototype.getLarge = function () {
        return this.large ? this.large : this.fallBack('large');
    };
    EZImage.prototype.getStandard = function () {
        return this.standard ? this.standard : this.fallBack('standard');
    };
    EZImage.prototype.getThumb = function () {
        return this.thumb ? this.thumb : this.fallBack('thumb');
    };
    return EZImage;
}());
exports.EZImage = EZImage;
var EZArtist = (function () {
    function EZArtist(id, name, featured_image, gallery, preview, category, excerpt) {
        if (gallery === void 0) { gallery = []; }
        if (category === void 0) { category = []; }
        this.id = id;
        this.name = name;
        this.featured_image = featured_image;
        this.gallery = gallery;
        this.preview = preview;
        this.category = category;
        this.excerpt = excerpt;
    }
    EZArtist.json = function (jsonArtist) {
        var id = jsonArtist.id;
        var name = jsonArtist.name;
        var featured_image = EZImage.json(jsonArtist.featured_image);
        var gallery = EZImage.array(jsonArtist.gallery);
        var preview = new EZSoundTrack(jsonArtist.preview_url);
        var category = isArray_1.isArray(jsonArtist.category) ? jsonArtist.category : [];
        var excerpt = jsonArtist.excerpt && jsonArtist.excerpt.hasOwnProperty("plain") ? jsonArtist.excerpt.plain : null;
        if (!id || !name)
            return null;
        return new EZArtist(id, name, featured_image, gallery, preview, category, excerpt);
    };
    EZArtist.array = function (jsonArray) {
        var ret = [];
        if (!isArray_1.isArray(jsonArray) || jsonArray.length == 0)
            return ret;
        for (var i = 0; i < jsonArray.length; i++) {
            var img = EZArtist.json(jsonArray[0]);
            if (img)
                ret.push(img);
        }
        return ret;
    };
    return EZArtist;
}());
exports.EZArtist = EZArtist;
var EZSoundTrack = (function () {
    function EZSoundTrack(url) {
        this.isPlaying = false;
        this.media = null;
        this.disable = false;
        if (!url)
            return null;
        var that = this;
        this.url = url;
        this.media = (new media_1.Media()).create(this.url);
        this.media.onStatusUpdate.subscribe(function (status) {
            that.disable = false;
            if (status == 1 || status == 2) {
                that.isPlaying = true;
            }
            else if (status == 3 || status == 4) {
                that.isPlaying = false;
            }
        });
        this.media.onError.subscribe(function (error) {
            that.isPlaying = false;
            that.disable = false;
            Zero.onError(new EZError(9, "EZSoundTrack error: " + error));
        });
    }
    EZSoundTrack.prototype.play = function () {
        if (this.disable)
            return;
        this.disable = true;
        this.media.play();
    };
    EZSoundTrack.prototype.stop = function () {
        if (this.disable)
            return;
        this.disable = true;
        this.media.stop();
    };
    EZSoundTrack.prototype.toggle = function () {
        if (this.isPlaying) {
            this.stop();
        }
        else {
            this.play();
        }
    };
    return EZSoundTrack;
}());
exports.EZSoundTrack = EZSoundTrack;
var EZPrice = (function () {
    function EZPrice(display) {
        this.display = display;
    }
    EZPrice.json = function (jsonPrice) {
        var display = "";
        if (typeof jsonPrice == "string") {
            display = jsonPrice;
        }
        else if (jsonPrice.hasOwnProperty("price")) {
            display = jsonPrice.price;
        }
        else {
            return null;
        }
        return new EZPrice(display);
    };
    return EZPrice;
}());
exports.EZPrice = EZPrice;
var EZTable = (function () {
    function EZTable(dict) {
        this.dict = dict;
    }
    EZTable.json = function (json) {
        if (!isArray_1.isArray(json))
            return null;
        var dict = [];
        for (var i = 0; i < json.length; i++) {
            var el = json[i];
            var name_1 = el.name;
            var value = el.value;
            if (name_1 && value) {
                dict.push({ name: name_1, value: value });
            }
        }
        if (dict.length == 0)
            return null;
        return new EZTable(dict);
    };
    return EZTable;
}());
exports.EZTable = EZTable;
var EZTrigger = (function () {
    function EZTrigger(id, action) {
        this.id = id;
        this.trigger = action;
    }
    return EZTrigger;
}());
exports.EZTrigger = EZTrigger;
var EventManager = (function () {
    function EventManager(perPage, city, date, coords, category) {
        if (perPage === void 0) { perPage = 1; }
        if (city === void 0) { city = "null"; }
        if (date === void 0) { date = new Date(); }
        if (coords === void 0) { coords = null; }
        this.page = 0;
        this.perPage = perPage;
        this.city = city;
        this.date = date;
        this.coords = coords;
        this.category = category;
    }
    EventManager.prototype.next = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var dates = _this.date.getFullYear().toString() + "-" + _this.date.getMonth().toString() + "-" + _this.date.getDay().toString();
            var categories = _this.category && _this.category.length > 0 ? "&category=" + _this.category.join("|") : "";
            var coords = _this.coords ? "&coords[lat]=" + _this.coords.lat + "&coords[lng]=" + _this.coords.lng : "";
            _this.page++;
            ZeroPlugin.get(BASE_API_PATH + "events/tree?context=view&page=" + _this.page + "&days=" + _this.perPage + "&start_date=" + dates + "&metro_area=" + _this.city + "&order=asc" + coords + categories)
                .then(function (data) {
                resolve(EZDay.array(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EventManager.prototype.reset = function () {
        this.page = 0;
    };
    EventManager.get = function (id) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + "events/" + id + "&_embed=1")
                .then(function (data) {
                resolve(EZEvent.json(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return EventManager;
}());
exports.EventManager = EventManager;
var VenueManager = (function () {
    function VenueManager(perPage, city, date, coords, category) {
        if (perPage === void 0) { perPage = 30; }
        if (city === void 0) { city = "null"; }
        if (date === void 0) { date = new Date(); }
        if (coords === void 0) { coords = null; }
        this.page = 0;
        this.perPage = perPage;
        this.city = city;
        this.date = date;
        this.coords = coords;
        this.category = category;
    }
    VenueManager.prototype.next = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var dates = _this.date.getFullYear().toString() + "-" + _this.date.getMonth().toString() + "-" + _this.date.getDay().toString();
            var categories = _this.category && _this.category.length > 0 ? "&category=" + _this.category.join("|") : "";
            var coords = _this.coords ? "&coords[lat]=" + _this.coords.lat + "&coords[lng]=" + _this.coords.lng : "";
            _this.page++;
            ZeroPlugin.get(BASE_API_PATH + "locations?context=view&page=" + _this.page + "&per_page=" + _this.perPage + "&start_date=" + dates + "&metro_area=" + _this.city + "&order=asc" + coords + categories)
                .then(function (data) {
                resolve(EZVenue.array(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    VenueManager.prototype.reset = function () {
        this.page = 0;
    };
    VenueManager.get = function (id) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + "locations/" + id + "&_embed=1")
                .then(function (data) {
                resolve(EZVenue.json(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return VenueManager;
}());
exports.VenueManager = VenueManager;
var ArtistManager = (function () {
    function ArtistManager(perPage, category) {
        if (perPage === void 0) { perPage = 30; }
        this.page = 0;
        this.perPage = perPage;
        this.category = category;
    }
    ArtistManager.prototype.next = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var categories = _this.category && _this.category.length > 0 ? "&category=" + _this.category.join("|") : "";
            _this.page++;
            ZeroPlugin.get(BASE_API_PATH + "artists?context=view&page=" + _this.page + "&per_page=" + _this.perPage + "&order=asc" + categories)
                .then(function (data) {
                resolve(EZArtist.array(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    ArtistManager.prototype.reset = function () {
        this.page = 0;
    };
    ArtistManager.get = function (id) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + "artists/" + id + "&_embed=1")
                .then(function (data) {
                resolve(EZArtist.json(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return ArtistManager;
}());
exports.ArtistManager = ArtistManager;
var AccountManager = (function () {
    function AccountManager(user) {
        this.user = user;
    }
    AccountManager.current = function () {
        return new Promise(function (resolve, reject) {
            if (AccountManager.instance) {
                resolve(AccountManager.instance);
            }
            else {
                ZeroPlugin.userInfo().then(function (user) {
                    var u = EZUser.json(user);
                    if (u) {
                        AccountManager.instance = new AccountManager(u);
                        resolve(AccountManager.instance);
                    }
                    else {
                        reject(new EZError(500, "Not users found."));
                    }
                })["catch"](function (err) {
                    Zero.onError(EZError.fromString(err));
                    reject(EZError.fromString(err));
                });
            }
        });
    };
    AccountManager.login = function (grant, credentials) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.login(grant, credentials).then(function (result) {
                if (result) {
                    AccountManager.current().then(resolve)["catch"](function (err) {
                        Zero.onError(EZError.fromString(err));
                        reject(EZError.fromString(err));
                    });
                }
                else {
                    reject(new EZError(401, "Login Failed."));
                }
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.signup = function (first_name, last_name, email) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.signup(first_name, last_name, email).then(resolve)["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.setPassword = function (key, login, password) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.setPassword(key, login, password).then(resolve)["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.prototype.currentUser = function () {
        return this.user;
    };
    AccountManager.prototype.edit = function (user) {
        this.user = user;
        return this;
    };
    AccountManager.prototype.commit = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.updateUser(_this.user).then(resolve)["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.prototype.isLogged = function () {
        return new Promise(function (resolve, reject) {
            return ZeroPlugin.checkLogin().then(resolve)["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.prototype.editImage = function (base64) {
        var that = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.post(BASE_API_PATH + 'users/me/profileImage', { data: base64 }).then(function (res) {
                var img = EZImage.json(res);
                if (!img)
                    reject(new EZError(500, "Unexpected Response."));
                that.user.profile_image = img;
                resolve(img);
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.prototype.connectToFacebook = function (token) {
        var that = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.post(BASE_API_PATH + 'users/me/facebook', { token: token }).then(function (data) {
                that.user.is_connected_to_facebook = true;
                resolve();
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.prototype.disconnectFromFacebook = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.post(BASE_API_PATH + 'users/me/facebook?_method=DELETE', {}).then(function (data) {
                that.user.is_connected_to_facebook = false;
                resolve();
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.prototype.logout = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.logout().then(function () {
                AccountManager.instance = null;
                that.user = null;
                resolve();
            })["catch"](function (err) {
                Zero.onError(err);
                reject(err);
            });
        });
    };
    return AccountManager;
}());
exports.AccountManager = AccountManager;
var TriggerManager = (function () {
    function TriggerManager() {
    }
    TriggerManager.current = function () {
        if (!TriggerManager.instance)
            TriggerManager.instance = new TriggerManager();
        return TriggerManager.instance;
    };
    TriggerManager.prototype.each = function (trigger) {
        if (trigger.trigger.arguments.length > 0 && trigger.trigger.arguments[0] instanceof EZError) {
            this.errorTrigger.push(trigger);
        }
        else if (trigger.trigger.arguments.length > 0 && trigger.trigger.arguments[0] instanceof AccountManager) {
            this.loginTrigger.push(trigger);
        }
        else {
            this.logoutTrigger.push(trigger);
        }
    };
    TriggerManager.prototype.remove = function (id) {
        this.errorTrigger = this.errorTrigger.filter(function (t) {
            return t.id != id;
        });
        this.loginTrigger = this.loginTrigger.filter(function (t) {
            return t.id != id;
        });
        this.logoutTrigger = this.logoutTrigger.filter(function (t) {
            return t.id != id;
        });
    };
    TriggerManager.prototype.clean = function () {
        this.errorTrigger = [];
        this.loginTrigger = [];
        this.logoutTrigger = [];
    };
    TriggerManager.prototype.catchError = function (error) {
        this.errorTrigger.forEach(function (trigger) {
            trigger.trigger(error);
        });
    };
    TriggerManager.prototype.performLogin = function (am) {
        this.loginTrigger.forEach(function (trigger) {
            trigger.trigger(am);
        });
    };
    TriggerManager.prototype.performLogout = function () {
        this.logoutTrigger.forEach(function (trigger) {
            trigger.trigger();
        });
    };
    TriggerManager.instance = null;
    return TriggerManager;
}());
exports.TriggerManager = TriggerManager;
/*
export class Track {
    url: string;
    isPlaying: boolean = false;
    media: MediaObject;
    constructor(url: string) {
        this.url = url;
    }

    play = function(): Promise<void> {
        let o = this;
        this.media = new Media().create(this.url);
        return new Promise<void>((resolve, reject) => {
            o.media.onStatusUpdate.subscribe((status) => {
                if(status == 2) resolve();
            });
            o.media.onError.subscribe((error) => {
                o.media.release();
                reject(error);
            });
            o.media.play();
            o.isPlaying = true;
        });
    }

    stop = function(): Promise<void> {
        let o = this;
        return new Promise<void>((resolve, reject) => {
            o.media.onStatusUpdate.subscribe((status) => {
                if(status == 4) {
                    o.media.release();
                    o.isPlaying = false;
                    resolve();
                }
            });
            o.media.onError.subscribe((error) => {
                reject(error);
            });
            o.media.stop();
            o.isPlaying = false;
        });
    }

    toggle = function(): Promise<void> {
        if(this.isPlaying) {
            return this.stop();
        } else {
            return this.play();
        }
    }
}
*/
var Zero = (function () {
    function Zero() {
    }
    //TRIGGER
    /*private onLogoutAction;

    private onFirstAccessAction;

    private onLoginAction;

    private onErrorAction;*/
    Zero.init = function (clientID, clientSecret) {
        return ZeroPlugin.init(clientID, clientSecret);
    };
    Zero.registerLoginAction = function (action) {
        TriggerManager.current().each(action);
    };
    Zero.registerErrorAction = function (action) {
        TriggerManager.current().each(action);
    };
    Zero.registerLogoutAction = function (action) {
        TriggerManager.current().each(action);
    };
    Zero.onError = function (e) {
        TriggerManager.current().catchError(e);
    };
    Zero.onLogin = function (account) {
        TriggerManager.current().performLogin(account);
    };
    Zero.onLogout = function () {
        TriggerManager.current().performLogout();
    };
    Zero.openSupportTicket = function (subject, message) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.post(BASE_API_PATH + "support/", { subject: subject, message: message }).then(resolve)["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return Zero;
}());
exports.Zero = Zero;
//# sourceMappingURL=index.js.map