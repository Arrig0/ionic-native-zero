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
var EZError = /** @class */ (function (_super) {
    __extends(EZError, _super);
    function EZError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        return _this;
    }
    EZError.fromString = function (reason, separator) {
        if (separator === void 0) { separator = ':'; }
        if (!reason || !(typeof reason == 'string'))
            return new EZError(500, "Generic Error");
        var err = reason.split(separator);
        if (err.length == 2) {
            var code = err[0];
            var msg = err[1];
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
var EZUser = /** @class */ (function () {
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
    EZUser.prototype.prepare = function () {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            profile_image: this.profile_image ? this.profile_image.getLarge() : null,
            enable_push_notifications: this.enable_push_notifications,
            enable_email_notifications: this.enable_email_notifications,
            enable_newsletter: this.enable_newsletter,
            is_connected_to_facebook: this.is_connected_to_facebook
        };
    };
    return EZUser;
}());
exports.EZUser = EZUser;
var EZType;
(function (EZType) {
    EZType["Event"] = "event";
    EZType["Venue"] = "venue";
    EZType["Artist"] = "artist";
    EZType["Article"] = "article";
})(EZType = exports.EZType || (exports.EZType = {}));
var EZMixin = /** @class */ (function () {
    function EZMixin(id, type, title, excerpt, featured_image) {
        if (id && type && title && excerpt && featured_image) {
            this.id = id;
            this.type = type;
            this.title = title;
            this.excerpt = excerpt;
            this.featured_image = featured_image;
        }
        else {
            return null;
        }
    }
    EZMixin.json = function (json) {
        if (!json)
            return null;
        var id = json.id;
        var type = EZMixin.parseType(json.type);
        var title = json.title ? json.title.plain : null;
        var excerpt = json.excerpt ? json.excerpt.plain : null;
        var image = EZImage.json(json.featured_image);
        return new EZMixin(id, type, title, excerpt, image);
    };
    EZMixin.array = function (jsonArray) {
        var ret = [];
        if (!isArray_1.isArray(jsonArray) || jsonArray.length == 0)
            return ret;
        for (var i = 0; i < jsonArray.length; i++) {
            var mix = EZMixin.json(jsonArray[i]);
            if (mix)
                ret.push(mix);
        }
        return ret;
    };
    EZMixin.parseType = function (val) {
        switch (val) {
            case "event":
                return EZType.Event;
            case "venue":
                return EZType.Venue;
            case "artist":
                return EZType.Artist;
            default:
                return EZType.Article;
        }
    };
    EZMixin.prototype.concrete = function () {
        switch (this.type) {
            case EZType.Event:
                return EventManager.get(this.id);
            case EZType.Venue:
                return VenueManager.get(this.id);
            case EZType.Artist:
                return ArtistManager.get(this.id);
        }
    };
    return EZMixin;
}());
exports.EZMixin = EZMixin;
var EZDate = /** @class */ (function () {
    function EZDate(date) {
        this.date = date;
    }
    EZDate.prototype.friendly = function () {
        var today = new Date();
        var ddays = this.date.getDate() - today.getDate();
        if (this.date.getMonth() == today.getMonth() && this.date.getFullYear() == today.getFullYear()) {
            if (ddays == 0) {
                return "Oggi";
            }
            else if (ddays == 1) {
                return "Domani";
            }
            else {
                return this.date.toLocaleDateString("it-IT", { weekday: 'long', month: 'long', day: 'numeric' });
            }
        }
        else {
            return this.date.toLocaleDateString("it-IT", { weekday: 'long', month: 'long', day: 'numeric' });
        }
    };
    return EZDate;
}());
exports.EZDate = EZDate;
var EZDay = /** @class */ (function () {
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
            var ev = EZDay.json(arr[i]);
            if (ev)
                ret.push(ev);
        }
        return ret;
    };
    EZDay.prototype.friendly = function () {
        return (new EZDate(this.date)).friendly();
    };
    return EZDay;
}());
exports.EZDay = EZDay;
var EZEvent = /** @class */ (function () {
    function EZEvent(id, name, startDate, endDate, startTime, endTime, price, excerpt, category, featured_image, gallery, venue, artists) {
        if (category === void 0) { category = []; }
        if (gallery === void 0) { gallery = []; }
        if (artists === void 0) { artists = []; }
        this.id = id;
        this.name = name;
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
        var name = jsonEvent.name ? jsonEvent.name.plain : null;
        var startDate = jsonEvent.start_date ? new Date(jsonEvent.start_date) : null;
        var endDate = jsonEvent.end_date ? new Date(jsonEvent.end_date) : null;
        var startTime = jsonEvent.start_time ? new Date((new Date()).toDateString() + " " + jsonEvent.start_time) : null;
        var endTime = jsonEvent.end_time ? new Date((new Date()).toDateString() + " " + jsonEvent.end_time) : null;
        var price = jsonEvent.price ? EZPrice.json(jsonEvent.price) : null;
        var excerpt = jsonEvent.excerpt && jsonEvent.excerpt.hasOwnProperty("plain") ? jsonEvent.excerpt.plain : null;
        var category = jsonEvent.category && isArray_1.isArray(jsonEvent.category) ? jsonEvent.category : [];
        var featured_image = jsonEvent.featured_image ? EZImage.json(jsonEvent.featured_image) : null;
        var gallery = jsonEvent.gallery ? EZImage.array(jsonEvent.gallery) : null;
        var artists = jsonEvent._embedded && jsonEvent._embedded.artists && jsonEvent._embedded.artists.length > 0 ? EZArtist.array(jsonEvent.artists) : [];
        var venue = (jsonEvent._embedded && jsonEvent._embedded.venue && jsonEvent._embedded.venue.length > 0) ? EZVenue.json(jsonEvent._embedded.venue[0]) : (jsonEvent.venue_id && jsonEvent.venue_name && jsonEvent.venue_coords ? EZVenue.json({ id: jsonEvent.venue_id, name: { plain: jsonEvent.venue_name }, coordinates: jsonEvent.venue_coords }) : null);
        if (!id || !name || !startDate || !venue)
            return null;
        return new EZEvent(id, name, startDate, endDate, startTime, endTime, price, excerpt, category, featured_image, gallery, venue, artists);
    };
    EZEvent.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var ev = EZEvent.json(arr[i]);
            if (ev)
                ret.push(ev);
        }
        return ret;
    };
    EZEvent.prototype.images = function () {
        return [this.featured_image].concat(this.gallery).filter(function (el) {
            return !!el;
        });
    };
    EZEvent.prototype.related = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'events/' + _this.id + "/related").then(function (data) {
                resolve(EZEvent.array(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EZEvent.prototype.reload = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'events/' + _this.id).then(function (json) {
                resolve(EZEvent.json(json));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EZEvent.prototype.pricing = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'events/' + _this.id + '/tickets/pricing').then(function (json) {
                resolve({
                    availability: json.availability,
                    currency: json.currency,
                    rates: EZRate.array(json.rates)
                });
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EZEvent.prototype.purchase = function (rates) {
        var that = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + "payments/token").then(function (data) {
                var token = data.token;
                if (token != null && token != "") {
                    BraintreePlugin.initialize(token, function () {
                        var s = 0;
                        for (var i = 0; i < rates.length; i++) {
                            var el = rates[i];
                            if (el.rate == null || el.rate.price == null)
                                return reject(new EZError(500, "Il pagamento non è andato a buon fine."));
                            var price = el.rate.price.price != null ? el.rate.price.price : 0;
                            var presale = el.rate.price.presale != null ? el.rate.price.presale : 0;
                            var charges = el.rate.price.charges != null ? el.rate.price.charges : 0;
                            s += el.quantity * (price + presale + charges);
                        }
                        var options = {
                            amount: s,
                            primaryDescription: that.name + " @ " + that.venue.name + " - " + (new EZDate(that.startDate)).friendly()
                        };
                        BraintreePlugin.presentDropInPaymentUI(options, function (result) {
                            if (result.userCancelled) {
                                reject(new EZError(403, "User cancel payment"));
                            }
                            else if (result.nonce != null && result.nonce != "") {
                                var ratesParam = rates.map(function (el, index) {
                                    return "rates[" + index + "]['id']=" + el.rate.id + "&rates[" + index + "]['quantity']=" + el.quantity;
                                }).join("&");
                                console.log(ratesParam);
                                ZeroPlugin.get(BASE_API_PATH + "cart/expresscheckout" + "/?payment_nonce=" + result.nonce + "&" + ratesParam).then(function (response) {
                                    console.log(JSON.stringify(response));
                                    if (response.status) {
                                        resolve();
                                    }
                                    else {
                                        reject(new EZError(500, "Il pagamento non è andato a buon fine."));
                                    }
                                })["catch"](function (err) {
                                    reject(new EZError(500, "Il pagamento non è andato a buon fine."));
                                });
                            }
                        });
                    }, reject);
                }
                else {
                    reject(new EZError(500, "Impossibile ottenere un token per il pagamento."));
                }
            })["catch"](function (err) {
                reject(new EZError(500, "Impossibile ottenere un token per il pagamento."));
            });
        });
    };
    return EZEvent;
}());
exports.EZEvent = EZEvent;
var EZVenue = /** @class */ (function () {
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
        if (!id || !name || !coords)
            return null;
    }
    EZVenue.json = function (json) {
        var id = json.id;
        var name = json.name ? json.name.plain : json.name;
        var featured_image = json.featured_image ? EZImage.json(json.featured_image) : null;
        var gallery = json.gallery && isArray_1.isArray(json.gallery) ? EZImage.array(json.gallery) : null;
        var phone = json.phone ? json.phone : null;
        var website = json.website ? json.website : null;
        var rate = json.ratings && (typeof json.ratings == 'number') ? json.ratings : null;
        var address = json.full_address ? json.full_address : null;
        var coords = json.coordinates && json.coordinates.hasOwnProperty('lat') && json.coordinates.hasOwnProperty('lng') ? json.coordinates : null;
        var excerpt = json.excerpt && json.excerpt.hasOwnProperty("plain") ? json.excerpt.plain : null;
        var category = json.category ? json.category : null;
        var openingHours = json.opening_hours ? EZTable.json(json.opening_hours) : null;
        var priceLevel = json.price_level && (typeof json.price_level == 'number') ? json.price_level : null;
        return new EZVenue(id, name, featured_image, gallery, phone, website, rate, address, coords, category, excerpt, openingHours, priceLevel);
    };
    EZVenue.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var venue = EZVenue.json(arr[i]);
            if (venue)
                ret.push(venue);
        }
        return ret;
    };
    EZVenue.prototype.images = function () {
        return [this.featured_image].concat(this.gallery).filter(function (el) {
            return !!el;
        });
    };
    EZVenue.prototype.related = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'venues/' + _this.id + "/related").then(function (data) {
                resolve(EZVenue.array(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EZVenue.prototype.upcoming = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'venues/' + _this.id + "/calendar").then(function (data) {
                resolve(EZEvent.array(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EZVenue.prototype.reload = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'venues/' + _this.id).then(function (json) {
                resolve(EZVenue.json(json));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return EZVenue;
}());
exports.EZVenue = EZVenue;
var EZImage = /** @class */ (function () {
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
        if (!jsonImage)
            return null;
        if (typeof jsonImage == "string")
            return new EZImage(null, jsonImage, null);
        if (jsonImage.thumb || jsonImage.standard || jsonImage.large)
            return new EZImage(jsonImage.thumb, jsonImage.standard, jsonImage.large);
        if ((!jsonImage.sizes)) {
            var thumb = jsonImage.file;
            return new EZImage(thumb, null, null);
        }
        else {
            var thumb = jsonImage.sizes.thumbnail ? jsonImage.sizes.thumbnail.file : null;
            var standard = jsonImage.sizes.medium ? jsonImage.sizes.medium.file : null;
            var large = jsonImage.sizes.large ? jsonImage.sizes.large.file : null;
            if (thumb || standard || large) {
                return new EZImage(thumb, standard, large);
            }
        }
        return null;
    };
    EZImage.array = function (jsonArray) {
        var ret = [];
        if (!isArray_1.isArray(jsonArray) || jsonArray.length == 0)
            return ret;
        for (var i = 0; i < jsonArray.length; i++) {
            var img = EZImage.json(jsonArray[i]);
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
var EZArtist = /** @class */ (function () {
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
        var name = jsonArtist.name ? jsonArtist.name.plain : null;
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
            var img = EZArtist.json(jsonArray[i]);
            if (img)
                ret.push(img);
        }
        return ret;
    };
    EZArtist.prototype.upcoming = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'artists/' + _this.id + "/calendar").then(function (data) {
                resolve(EZEvent.array(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EZArtist.prototype.reload = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'artists/' + _this.id).then(function (json) {
                resolve(EZArtist.json(json));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return EZArtist;
}());
exports.EZArtist = EZArtist;
var EZTicket = /** @class */ (function () {
    function EZTicket(id, event, price, validFrom, validTo, code) {
        if (!id || !event || !price || !code)
            return null;
        this.id = id;
        this.event = event;
        this.price = price;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.code = code;
    }
    EZTicket.json = function (json) {
        return new EZTicket(json.id, EZEvent.json(json.event), json.price, new Date(json.validFrom), new Date(json.validTo), json.code);
    };
    EZTicket.array = function (jsonArray) {
        var ret = [];
        if (!isArray_1.isArray(jsonArray) || jsonArray.length == 0)
            return ret;
        for (var i = 0; i < jsonArray.length; i++) {
            var t = EZTicket.json(jsonArray[i]);
            if (t)
                ret.push(t);
        }
        return ret;
    };
    return EZTicket;
}());
exports.EZTicket = EZTicket;
var EZSoundTrack = /** @class */ (function () {
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
    EZSoundTrack.prototype.playing = function () {
        return this.isPlaying;
    };
    return EZSoundTrack;
}());
exports.EZSoundTrack = EZSoundTrack;
var EZPrice = /** @class */ (function () {
    function EZPrice(display, price, charges, presale) {
        this.display = display;
        this.price = price;
        this.presale = presale;
        this.charges = charges;
    }
    EZPrice.json = function (jsonPrice) {
        var display = "";
        var price = null;
        var charges = null;
        var presale = null;
        if (typeof jsonPrice == "string") {
            display = jsonPrice;
        }
        else if (jsonPrice && (typeof jsonPrice == 'object')) {
            display = jsonPrice.display;
            price = jsonPrice.price;
            charges = jsonPrice.charges;
            presale = jsonPrice.presale;
        }
        else {
            return null;
        }
        return new EZPrice(display, price, charges, presale);
    };
    EZPrice.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var price = EZPrice.json(arr[i]);
            if (price)
                ret.push(price);
        }
        return ret;
    };
    return EZPrice;
}());
exports.EZPrice = EZPrice;
var EZRate = /** @class */ (function () {
    function EZRate(id, name, description, price) {
        if (id && name && price) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
        }
        else {
            return null;
        }
    }
    EZRate.json = function (json) {
        if (!json)
            return null;
        var id = json.id;
        var name = json.name;
        var price = EZPrice.json(json.price);
        if (id && name && price) {
            return new EZRate(id, name, json.description, price);
        }
        return null;
    };
    EZRate.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var rate = EZRate.json(arr[i]);
            if (rate)
                ret.push(rate);
        }
        return ret;
    };
    return EZRate;
}());
exports.EZRate = EZRate;
var EZTable = /** @class */ (function () {
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
var EZBrand = /** @class */ (function () {
    function EZBrand(id, title, description, logo, background, textPrimaryColor, textContrastColor, content) {
        if (background === void 0) { background = "#ffffff"; }
        if (textPrimaryColor === void 0) { textPrimaryColor = "#000000"; }
        if (textContrastColor === void 0) { textContrastColor = "#ffffff"; }
        if (content === void 0) { content = []; }
        this.id = id;
        this.title = title;
        this.description = description;
        this.logo = logo;
        this.background = background;
        this.textPrimaryColor = textPrimaryColor;
        this.textContrastColor = textContrastColor;
        this.content = content;
    }
    EZBrand.json = function (j) {
        var id = j.id;
        var title = j.title;
        var descr = j.description;
        var logo = j.logo;
        var background = j.background;
        var primary = j.text_primary_color;
        var contrast = j.text_contrast_color;
        var content = EZBrandedContent.array(j.content);
        if (id != null && title != null && logo != null)
            return new EZBrand(id, title, descr, logo, background, primary, contrast, content);
    };
    EZBrand.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var mix = EZBrand.json(arr[i]);
            if (mix)
                ret.push(mix);
        }
        return ret;
    };
    return EZBrand;
}());
exports.EZBrand = EZBrand;
var EZGenericContent = /** @class */ (function () {
    function EZGenericContent(type, content) {
        if (type == null || content == null)
            return null;
        this.content = content;
        this.type = type;
    }
    EZGenericContent.json = function (j) {
        var type = EZMixin.parseType(j.type);
        switch (type) {
            case EZType.Event:
                return new EZGenericContent(type, EZEvent.json(j.content));
            case EZType.Venue:
                return new EZGenericContent(type, EZVenue.json(j.content));
            case EZType.Artist:
                return new EZGenericContent(type, EZArtist.json(j.content));
            case EZType.Article:
                return new EZGenericContent(type, EZArticle.json(j.content));
        }
    };
    EZGenericContent.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var mix = EZGenericContent.json(arr[i]);
            if (mix)
                ret.push(mix);
        }
        return ret;
    };
    return EZGenericContent;
}());
exports.EZGenericContent = EZGenericContent;
var EZBrandedContent = /** @class */ (function (_super) {
    __extends(EZBrandedContent, _super);
    function EZBrandedContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EZBrandedContent;
}(EZGenericContent));
exports.EZBrandedContent = EZBrandedContent;
var EZArticle = /** @class */ (function () {
    function EZArticle(title, category, excerpt, link, featured_image) {
        if (title != null && link != null && featured_image != null) {
            this.title = title;
            this.category = category;
            this.excerpt = excerpt;
            this.link = link;
            this.featured_image = featured_image;
        }
        else {
            return null;
        }
    }
    EZArticle.json = function (j) {
        var title = j.title;
        var category = j.category;
        var excerpt = j.excerpt;
        var link = j.link;
        var fi = EZImage.json(j.featured_image);
        return new EZArticle(title, category, excerpt, link, fi);
    };
    return EZArticle;
}());
exports.EZArticle = EZArticle;
var EZTrigger = /** @class */ (function () {
    function EZTrigger(id, action) {
        this.id = id;
        this.trigger = action;
    }
    return EZTrigger;
}());
exports.EZTrigger = EZTrigger;
var EventManager = /** @class */ (function () {
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
            var dates = _this.date.getFullYear().toString() + "-" + _this.date.getMonth().toString() + "-" + _this.date.getDate().toString();
            var categories = _this.category && _this.category.length > 0 ? "&category=" + _this.category.join("|") : "";
            var coords = _this.coords ? "&coords[lat]=" + _this.coords.lat + "&coords[lng]=" + _this.coords.lng : "";
            _this.page++;
            ZeroPlugin.get(BASE_API_PATH + "events/tree?context=view&_embed=1&page=" + _this.page + "&days=" + _this.perPage + "&start_date=" + dates + "&metro_area=" + _this.city + "&order=asc" + coords + categories)
                .then(function (data) {
                resolve(EZDay.array(data.days));
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
            ZeroPlugin.get(BASE_API_PATH + "events/" + id + "?_embed=1")
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
var VenueManager = /** @class */ (function () {
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
            ZeroPlugin.get(BASE_API_PATH + "locations/" + id + "?_embed=1")
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
var ArtistManager = /** @class */ (function () {
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
var AccountManager = /** @class */ (function () {
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
                    AccountManager.current().then(function (am) {
                        Zero.onLogin(am);
                        resolve(am);
                    })["catch"](function (err) {
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
            ZeroPlugin.updateUser(_this.user.prepare()).then(resolve)["catch"](function (err) {
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
                TriggerManager.current().performLogout();
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
var TriggerManager = /** @class */ (function () {
    function TriggerManager() {
        this.errorTrigger = [];
        this.loginTrigger = [];
        this.logoutTrigger = [];
    }
    TriggerManager.current = function () {
        if (!TriggerManager.instance)
            TriggerManager.instance = new TriggerManager();
        return TriggerManager.instance;
    };
    TriggerManager.prototype.eachError = function (trigger) {
        this.errorTrigger.push(trigger);
    };
    TriggerManager.prototype.eachLogin = function (trigger) {
        this.loginTrigger.push(trigger);
    };
    TriggerManager.prototype.eachLogout = function (trigger) {
        this.logoutTrigger.push(trigger);
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
var TicketManager = /** @class */ (function () {
    function TicketManager() {
    }
    TicketManager.prototype.all = function () {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + "users/me/tickets/").then(function (data) {
                resolve(EZTicket.array(data));
            })["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    TicketManager.instance = null;
    return TicketManager;
}());
exports.TicketManager = TicketManager;
var SearchEngine = /** @class */ (function () {
    function SearchEngine() {
    }
    SearchEngine.recent = function () {
        return new Promise(function (resolve, reject) {
            /*ZeroPlugin.recentResearch().then((res) => {
                resolve(EZMixin.array(res));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });*/
            // TODO:: REMOVE THIS IS FOR TEST, REMOVE IT
            setTimeout(function () {
                resolve([
                    "Mike",
                    "Ciao",
                    "Hola",
                    "aaaaaa",
                    "posizione",
                    "loola paloosa"
                ]);
            }, 500);
        });
    };
    SearchEngine.search = function (q, f) {
        if (f === void 0) { f = [EZType.Artist, EZType.Venue, EZType.Event]; }
        return new Promise(function (resolve, reject) {
            /*let c = f.join("|");
            let s = encodeURIComponent(q);
            ZeroPlugin.get(BASE_API_PATH+"search/"+s+"/?types="+c).then((res) => {
                resolve(EZMixin.array(res))
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });*/
            // TODO:: REMOVE THIS IS FOR TEST, REMOVE IT
            setTimeout(function () {
                if (q == "ciao")
                    return resolve([]);
                resolve([
                    new EZMixin(2, EZType.Event, "Un Evento" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(3, EZType.Venue, "Una Venue" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(4, EZType.Artist, "Un Artista" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(5, EZType.Event, "Un Evento" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(6, EZType.Venue, "Una Venue" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(7, EZType.Artist, "Un Artista" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(8, EZType.Event, "Un Evento" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(11, EZType.Venue, "Una Venue" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(12, EZType.Artist, "Un Artista" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(22, EZType.Event, "Un Evento" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(32, EZType.Venue, "Una Venue" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(42, EZType.Artist, "Un Artista" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(2, EZType.Event, "Un Evento" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(3, EZType.Venue, "Una Venue" + q, "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(4, EZType.Artist, "Un Artista", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(5, EZType.Event, "Un Evento", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(6, EZType.Venue, "Una Venue", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(7, EZType.Artist, "Un Artista", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(8, EZType.Event, "Un Evento", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(11, EZType.Venue, "Una Venue", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(12, EZType.Artist, "Un Artista", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(22, EZType.Event, "Un Evento", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(32, EZType.Venue, "Una Venue", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                    new EZMixin(42, EZType.Artist, "Un Artista", "Excerpt for this test event", new EZImage(null, "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg", null)),
                ]);
            }, 3000);
        });
    };
    SearchEngine.branded = function () {
        return new Promise(function (resolve, reject) {
            /*ZeroPlugin.get(BASE_API_PATH+"branded/?target=app").then((res) => {
                resolve(EZBrand.array(res))
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });*/
            // TODO:: THIS IS FOR TEST, REMOVE IT
            setTimeout(function () {
                resolve(EZBrand.array([
                    {
                        id: 1,
                        title: "Goditi la tua vacanza!",
                        description: "Vivi i tuoi eventi con Aperol.",
                        logo: 'https://www.aperol.com/themes/was-theme/assets/images/logo/logo-aperol.svg',
                        background: "#FAE37C",
                        text_primary_color: "#000000",
                        text_contrast_color: "#ffffff",
                        content: [
                            {
                                type: "event",
                                content: { "id": 42721, "name": { "rendered": "Tom Odell", "plain": "Tom Odell" }, "slug": "tom-odell-2", "content": { "raw": "", "rendered": "", "plain": "" }, "excerpt": { "raw": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\".", "rendered": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\".", "plain": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\"." }, "status": "publish", "regular": false, "start_date": "2017-02-15", "end_date": "2017-02-15", "start_time": "20:30", "end_time": "", "price": "\u20ac 25/22 + d.p.", "post_class": "post-42721 evento type-evento status-publish hentry sezione-musica-concerti citta-milano categoria_evento-concerti", "tour_id": 0, "venue_id": 2805, "categoria_evento": [335], "category": ["musica", "jazz"], "featured_image": { "thumb": "https://picsum.photos/200/300", "standard": "https://picsum.photos/400/600", "large": "https://picsum.photos/600/900" }, "venue_name": "nome del luogo", "venue_coords": { "lat": 45.4555558, "lng": 9.1952502 }, "_links": { "self": [{ "href": "http://192.168.60.113/api/v2/events/42721" }], "collection": [{ "href": "http://192.168.60.113/api/v2/events" }], "venue": [{ "embeddable": true, "href": "http://192.168.60.113/api/v2/locations/2805" }], "attachment": [{ "embeddable": true, "href": "http://192.168.60.113/api/v2/media?parent=42721" }], "taxonomies": [{ "taxonomy": "categoria_evento", "embeddable": true, "href": "http://192.168.60.113/api/v2/taxonomies/categoria_evento?post=42721" }] }, "_embedded": { "venue": [{ "id": 2805, "owner_id": 0, "name": { "rendered": "Alcatraz", "plain": "Alcatraz" }, "slug": "alcatraz", "phone": "+39 0269016352", "website": "http://www.alcatrazmilano.com", "country": "IT", "town": "Milano", "subdivision_1": "25", "subdivision_2": "MI", "address": "Via Valtellina", "civic_number": "25", "coordinates": { "lat": "45.49468900", "lng": "9.18265800" } }], "taxonomies": [{ "name": "Categorie", "slug": "categoria_evento", "rest_base": "categoria_evento", "_links": { "collection": [{ "href": "http://192.168.60.113/api/v2/taxonomies" }], "wp:items": [{ "href": "http://192.168.60.113/api/wp/v2/categoria_evento" }], "curies": [{ "name": "wp", "href": "https://api.w.org/{rel}", "templated": true }] } }] } }
                            },
                            {
                                type: "venue",
                                content: { "id": 2805, "owner_id": 0, "name": { "rendered": "Alcatraz", "plain": "Alcatraz" }, "slug": "alcatraz", "phone": "+39 0269016352", "website": "http://www.alcatrazmilano.com", "country": "IT", "town": "Milano", "subdivision_1": "25", "subdivision_2": "MI", "address": "Via Valtellina", "civic_number": "25", "coordinates": { "lat": "45.49468900", "lng": "9.18265800" } }
                            },
                            {
                                type: "artist",
                                content: {
                                    "id": 79331,
                                    "date": "2017-11-23T11:19:52",
                                    "date_gmt": "2017-11-23T11:19:52",
                                    "modified": "2017-11-23T11:19:52",
                                    "modified_gmt": "2017-11-23T11:19:52",
                                    "slug": "david-guetta",
                                    "status": "publish",
                                    "type": "artista",
                                    "link": "http://192.168.60.113/?artista=david-guetta",
                                    "name": {
                                        "rendered": "David Guetta",
                                        "plain": "David Guetta"
                                    },
                                    "content": {
                                        "rendered": "",
                                        "protected": false
                                    },
                                    "excerpt": {
                                        "rendered": "",
                                        "protected": false
                                    },
                                    "featured_image": {
                                        "large": "http://www.piterpan.it/p/wp-content/uploads/2017/09/14633879.jpg"
                                    },
                                    "template": "",
                                    "category": ['top artist', 'techno'],
                                    "preview_url": "https://p.scdn.co/mp3-preview/3d7ceaf99d866a8a3fdf0b66cb2763006c970650?cid=5d32859f7f30446db02e9aba0b224b89"
                                }
                            },
                            {
                                type: "article",
                                content: {
                                    title: 'Da quattro amici al bar all’evento numero 1 in Europa: intervista a Luigi Brusaferri, da 23 anni il boss della Milano Tattoo Convention',
                                    category: 'intervista',
                                    excerpt: 'INTERVISTA A UNO DEI PADRI FONDATORI DELLA MILANO TATTOO CONVENTION',
                                    featured_image: {
                                        "thumb": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg",
                                        "standard": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg",
                                        "large": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg"
                                    },
                                    link: 'https://zero.eu/persone/luigi-brusaferri/'
                                }
                            }
                        ]
                    },
                    {
                        id: 2,
                        title: "Il gusto delle Sagre",
                        description: "SCOPRI LE SAGRE PIU BELLE",
                        logo: 'https://s3-eu-west-1.amazonaws.com/zeroeu-static-assets/clienti/ramazzotti/ogni-sagra-una-storia/ramazzotti-logo.png',
                        background: "#172F52",
                        text_primary_color: "#ffffff",
                        text_contrast_color: "#000000",
                        content: [
                            {
                                type: "event",
                                content: { "id": 42721, "name": { "rendered": "Tom Odell", "plain": "Tom Odell" }, "slug": "tom-odell-2", "content": { "raw": "", "rendered": "", "plain": "" }, "excerpt": { "raw": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\".", "rendered": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\".", "plain": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\"." }, "status": "publish", "regular": false, "start_date": "2017-02-15", "end_date": "2017-02-15", "start_time": "20:30", "end_time": "", "price": "\u20ac 25/22 + d.p.", "post_class": "post-42721 evento type-evento status-publish hentry sezione-musica-concerti citta-milano categoria_evento-concerti", "tour_id": 0, "venue_id": 2805, "categoria_evento": [335], "category": ["musica", "jazz"], "featured_image": { "thumb": "https://picsum.photos/200/300", "standard": "https://picsum.photos/400/600", "large": "https://picsum.photos/600/900" }, "venue_name": "nome del luogo", "venue_coords": { "lat": 45.4555558, "lng": 9.1952502 }, "_links": { "self": [{ "href": "http://192.168.60.113/api/v2/events/42721" }], "collection": [{ "href": "http://192.168.60.113/api/v2/events" }], "venue": [{ "embeddable": true, "href": "http://192.168.60.113/api/v2/locations/2805" }], "attachment": [{ "embeddable": true, "href": "http://192.168.60.113/api/v2/media?parent=42721" }], "taxonomies": [{ "taxonomy": "categoria_evento", "embeddable": true, "href": "http://192.168.60.113/api/v2/taxonomies/categoria_evento?post=42721" }] }, "_embedded": { "venue": [{ "id": 2805, "owner_id": 0, "name": { "rendered": "Alcatraz", "plain": "Alcatraz" }, "slug": "alcatraz", "phone": "+39 0269016352", "website": "http://www.alcatrazmilano.com", "country": "IT", "town": "Milano", "subdivision_1": "25", "subdivision_2": "MI", "address": "Via Valtellina", "civic_number": "25", "coordinates": { "lat": "45.49468900", "lng": "9.18265800" } }], "taxonomies": [{ "name": "Categorie", "slug": "categoria_evento", "rest_base": "categoria_evento", "_links": { "collection": [{ "href": "http://192.168.60.113/api/v2/taxonomies" }], "wp:items": [{ "href": "http://192.168.60.113/api/wp/v2/categoria_evento" }], "curies": [{ "name": "wp", "href": "https://api.w.org/{rel}", "templated": true }] } }] } }
                            },
                            {
                                type: "venue",
                                content: { "id": 2805, "owner_id": 0, "name": { "rendered": "Alcatraz", "plain": "Alcatraz" }, "slug": "alcatraz", "phone": "+39 0269016352", "website": "http://www.alcatrazmilano.com", "country": "IT", "town": "Milano", "subdivision_1": "25", "subdivision_2": "MI", "address": "Via Valtellina", "civic_number": "25", "coordinates": { "lat": "45.49468900", "lng": "9.18265800" } }
                            },
                            {
                                type: "artist",
                                content: {
                                    "id": 79331,
                                    "date": "2017-11-23T11:19:52",
                                    "date_gmt": "2017-11-23T11:19:52",
                                    "guid": {
                                        "rendered": "http://localdev.zero.eu/?post_type=artista&#038;p=79331"
                                    },
                                    "modified": "2017-11-23T11:19:52",
                                    "modified_gmt": "2017-11-23T11:19:52",
                                    "slug": "david-guetta",
                                    "status": "publish",
                                    "type": "artista",
                                    "link": "http://192.168.60.113/?artista=david-guetta",
                                    "name": {
                                        "rendered": "David Guetta",
                                        "plain": "David Guetta"
                                    },
                                    "content": {
                                        "rendered": "",
                                        "protected": false
                                    },
                                    "excerpt": {
                                        "rendered": "",
                                        "protected": false
                                    },
                                    "featured_media": 0,
                                    "template": "",
                                    "categoria_artista": [],
                                    "preview_url": "https://p.scdn.co/mp3-preview/3d7ceaf99d866a8a3fdf0b66cb2763006c970650?cid=5d32859f7f30446db02e9aba0b224b89"
                                }
                            },
                            {
                                type: "article",
                                content: {
                                    title: 'Da quattro amici al bar all’evento numero 1 in Europa: intervista a Luigi Brusaferri, da 23 anni il boss della Milano Tattoo Convention',
                                    category: 'intervista',
                                    excerpt: 'INTERVISTA A UNO DEI PADRI FONDATORI DELLA MILANO TATTOO CONVENTION',
                                    featured_image: {
                                        "thumb": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg",
                                        "standard": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg",
                                        "large": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg"
                                    },
                                    link: 'https://zero.eu/persone/luigi-brusaferri/'
                                }
                            }
                        ]
                    }
                ]));
            }, 1000);
        });
    };
    SearchEngine.foryou = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(EZGenericContent.array([
                    {
                        type: "event",
                        content: { "id": 42721, "name": { "rendered": "Tom Odell", "plain": "Tom Odell" }, "slug": "tom-odell-2", "content": { "raw": "", "rendered": "", "plain": "" }, "excerpt": { "raw": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\".", "rendered": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\".", "plain": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\"." }, "status": "publish", "regular": false, "start_date": "2017-02-15", "end_date": "2017-02-15", "start_time": "20:30", "end_time": "", "price": "\u20ac 25/22 + d.p.", "post_class": "post-42721 evento type-evento status-publish hentry sezione-musica-concerti citta-milano categoria_evento-concerti", "tour_id": 0, "venue_id": 2805, "categoria_evento": [335], "category": ["musica", "jazz"], "featured_image": { "thumb": "https://picsum.photos/200/300", "standard": "https://picsum.photos/400/600", "large": "https://picsum.photos/600/900" }, "venue_name": "nome del luogo", "venue_coords": { "lat": 45.4555558, "lng": 9.1952502 }, "_links": { "self": [{ "href": "http://192.168.60.113/api/v2/events/42721" }], "collection": [{ "href": "http://192.168.60.113/api/v2/events" }], "venue": [{ "embeddable": true, "href": "http://192.168.60.113/api/v2/locations/2805" }], "attachment": [{ "embeddable": true, "href": "http://192.168.60.113/api/v2/media?parent=42721" }], "taxonomies": [{ "taxonomy": "categoria_evento", "embeddable": true, "href": "http://192.168.60.113/api/v2/taxonomies/categoria_evento?post=42721" }] }, "_embedded": { "venue": [{ "id": 2805, "owner_id": 0, "name": { "rendered": "Alcatraz", "plain": "Alcatraz" }, "slug": "alcatraz", "phone": "+39 0269016352", "website": "http://www.alcatrazmilano.com", "country": "IT", "town": "Milano", "subdivision_1": "25", "subdivision_2": "MI", "address": "Via Valtellina", "civic_number": "25", "coordinates": { "lat": "45.49468900", "lng": "9.18265800" } }], "taxonomies": [{ "name": "Categorie", "slug": "categoria_evento", "rest_base": "categoria_evento", "_links": { "collection": [{ "href": "http://192.168.60.113/api/v2/taxonomies" }], "wp:items": [{ "href": "http://192.168.60.113/api/wp/v2/categoria_evento" }], "curies": [{ "name": "wp", "href": "https://api.w.org/{rel}", "templated": true }] } }] } }
                    },
                    {
                        type: "venue",
                        content: { "id": 2805, "owner_id": 0, "name": { "rendered": "Alcatraz", "plain": "Alcatraz" }, "slug": "alcatraz", "phone": "+39 0269016352", "website": "http://www.alcatrazmilano.com", "country": "IT", "town": "Milano", "subdivision_1": "25", "subdivision_2": "MI", "address": "Via Valtellina", "civic_number": "25", "coordinates": { "lat": "45.49468900", "lng": "9.18265800" } }
                    },
                    {
                        type: "artist",
                        content: {
                            "id": 79331,
                            "date": "2017-11-23T11:19:52",
                            "date_gmt": "2017-11-23T11:19:52",
                            "modified": "2017-11-23T11:19:52",
                            "modified_gmt": "2017-11-23T11:19:52",
                            "slug": "david-guetta",
                            "status": "publish",
                            "type": "artista",
                            "link": "http://192.168.60.113/?artista=david-guetta",
                            "name": {
                                "rendered": "David Guetta",
                                "plain": "David Guetta"
                            },
                            "content": {
                                "rendered": "",
                                "protected": false
                            },
                            "excerpt": {
                                "rendered": "",
                                "protected": false
                            },
                            "featured_image": {
                                "large": "http://www.piterpan.it/p/wp-content/uploads/2017/09/14633879.jpg"
                            },
                            "template": "",
                            "category": ['top artist', 'techno'],
                            "preview_url": "https://p.scdn.co/mp3-preview/3d7ceaf99d866a8a3fdf0b66cb2763006c970650?cid=5d32859f7f30446db02e9aba0b224b89"
                        }
                    },
                    {
                        type: "article",
                        content: {
                            title: 'Da quattro amici al bar all’evento numero 1 in Europa: intervista a Luigi Brusaferri, da 23 anni il boss della Milano Tattoo Convention',
                            category: 'intervista',
                            excerpt: 'INTERVISTA A UNO DEI PADRI FONDATORI DELLA MILANO TATTOO CONVENTION',
                            featured_image: {
                                "thumb": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg",
                                "standard": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg",
                                "large": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg"
                            },
                            link: 'https://zero.eu/persone/luigi-brusaferri/'
                        }
                    },
                    {
                        type: "event",
                        content: { "id": 42721, "name": { "rendered": "Tom Odell", "plain": "Tom Odell" }, "slug": "tom-odell-2", "content": { "raw": "", "rendered": "", "plain": "" }, "excerpt": { "raw": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\".", "rendered": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\".", "plain": "Il cantautore britannico in concerto con brani dal nuovo album \"Wrong Crowd\"." }, "status": "publish", "regular": false, "start_date": "2017-02-15", "end_date": "2017-02-15", "start_time": "20:30", "end_time": "", "price": "\u20ac 25/22 + d.p.", "post_class": "post-42721 evento type-evento status-publish hentry sezione-musica-concerti citta-milano categoria_evento-concerti", "tour_id": 0, "venue_id": 2805, "categoria_evento": [335], "category": ["musica", "jazz"], "featured_image": { "thumb": "https://picsum.photos/200/300", "standard": "https://picsum.photos/400/600", "large": "https://picsum.photos/600/900" }, "venue_name": "nome del luogo", "venue_coords": { "lat": 45.4555558, "lng": 9.1952502 }, "_links": { "self": [{ "href": "http://192.168.60.113/api/v2/events/42721" }], "collection": [{ "href": "http://192.168.60.113/api/v2/events" }], "venue": [{ "embeddable": true, "href": "http://192.168.60.113/api/v2/locations/2805" }], "attachment": [{ "embeddable": true, "href": "http://192.168.60.113/api/v2/media?parent=42721" }], "taxonomies": [{ "taxonomy": "categoria_evento", "embeddable": true, "href": "http://192.168.60.113/api/v2/taxonomies/categoria_evento?post=42721" }] }, "_embedded": { "venue": [{ "id": 2805, "owner_id": 0, "name": { "rendered": "Alcatraz", "plain": "Alcatraz" }, "slug": "alcatraz", "phone": "+39 0269016352", "website": "http://www.alcatrazmilano.com", "country": "IT", "town": "Milano", "subdivision_1": "25", "subdivision_2": "MI", "address": "Via Valtellina", "civic_number": "25", "coordinates": { "lat": "45.49468900", "lng": "9.18265800" } }], "taxonomies": [{ "name": "Categorie", "slug": "categoria_evento", "rest_base": "categoria_evento", "_links": { "collection": [{ "href": "http://192.168.60.113/api/v2/taxonomies" }], "wp:items": [{ "href": "http://192.168.60.113/api/wp/v2/categoria_evento" }], "curies": [{ "name": "wp", "href": "https://api.w.org/{rel}", "templated": true }] } }] } }
                    },
                    {
                        type: "venue",
                        content: { "id": 2805, "owner_id": 0, "name": { "rendered": "Alcatraz", "plain": "Alcatraz" }, "slug": "alcatraz", "phone": "+39 0269016352", "website": "http://www.alcatrazmilano.com", "country": "IT", "town": "Milano", "subdivision_1": "25", "subdivision_2": "MI", "address": "Via Valtellina", "civic_number": "25", "coordinates": { "lat": "45.49468900", "lng": "9.18265800" } }
                    },
                    {
                        type: "artist",
                        content: {
                            "id": 79331,
                            "date": "2017-11-23T11:19:52",
                            "date_gmt": "2017-11-23T11:19:52",
                            "modified": "2017-11-23T11:19:52",
                            "modified_gmt": "2017-11-23T11:19:52",
                            "slug": "david-guetta",
                            "status": "publish",
                            "type": "artista",
                            "link": "http://192.168.60.113/?artista=david-guetta",
                            "name": {
                                "rendered": "David Guetta",
                                "plain": "David Guetta"
                            },
                            "content": {
                                "rendered": "",
                                "protected": false
                            },
                            "excerpt": {
                                "rendered": "",
                                "protected": false
                            },
                            "featured_image": {
                                "large": "http://www.piterpan.it/p/wp-content/uploads/2017/09/14633879.jpg"
                            },
                            "template": "",
                            "category": ['top artist', 'techno'],
                            "preview_url": "https://p.scdn.co/mp3-preview/3d7ceaf99d866a8a3fdf0b66cb2763006c970650?cid=5d32859f7f30446db02e9aba0b224b89"
                        }
                    },
                    {
                        type: "article",
                        content: {
                            title: 'Da quattro amici al bar all’evento numero 1 in Europa: intervista a Luigi Brusaferri, da 23 anni il boss della Milano Tattoo Convention',
                            category: 'intervista',
                            excerpt: 'INTERVISTA A UNO DEI PADRI FONDATORI DELLA MILANO TATTOO CONVENTION',
                            featured_image: {
                                "thumb": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg",
                                "standard": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg",
                                "large": "https://zero.eu/content/uploads/2018/01/gigibrusaferri_BN-e1516970146352.jpg"
                            },
                            link: 'https://zero.eu/persone/luigi-brusaferri/'
                        }
                    }
                ]));
            }, 3000);
            //todo: implement foryou;
        });
    };
    return SearchEngine;
}());
exports.SearchEngine = SearchEngine;
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
var Zero = /** @class */ (function () {
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
        TriggerManager.current().eachLogin(action);
    };
    Zero.registerErrorAction = function (action) {
        TriggerManager.current().eachError(action);
    };
    Zero.registerLogoutAction = function (action) {
        TriggerManager.current().eachLogout(action);
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
            ZeroPlugin.post(BASE_API_PATH + "support/issue", { subject: subject, message: message }).then(resolve)["catch"](function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return Zero;
}());
exports.Zero = Zero;
//# sourceMappingURL=index.js.map