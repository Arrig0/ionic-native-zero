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
Object.defineProperty(exports, "__esModule", { value: true });
var media_1 = require("@ionic-native/media");
var isArray_1 = require("rxjs/util/isArray");
var API_KEY = 'Amichetti_come_Kim_Jong-un';
var BASE_API_PATH = "https://dev.zero.eu/api/v2/";
var APP_VERSION = "v1.0.0";
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
        console.log("ezerror:::" + JSON.stringify(reason));
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
var EZUser = (function () {
    function EZUser(id, first_name, last_name, email, profile_image, target_city, enable_push_notifications, enable_email_notifications, enable_newsletter, is_connected_to_facebook) {
        if (target_city === void 0) { target_city = 'milano'; }
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
        this.target_city = target_city;
        this.enable_push_notifications = enable_push_notifications;
        this.enable_email_notifications = enable_email_notifications;
        this.enable_newsletter = enable_newsletter;
        this.is_connected_to_facebook = is_connected_to_facebook;
    }
    EZUser.json = function (json) {
        return new EZUser(json.id, json.first_name, json.last_name, json.email, EZImage.json(json.profile_image), json.tracked_metro_area, json.enable_push_notifications, json.enable_email_notifications, json.enable_newsletter, json.is_connected_to_facebook);
    };
    EZUser.prototype.preferences = function () {
        return { enable_push_notifications: this.enable_push_notifications, enable_email_notifications: this.enable_email_notifications, enable_newsletter: this.enable_newsletter, is_connected_to_facebook: this.is_connected_to_facebook };
    };
    EZUser.prototype.info = function () {
        return { id: this.id, first_name: this.first_name, last_name: this.last_name, email: this.email, target_city: this.target_city };
    };
    EZUser.prototype.prepare = function () {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            profile_image: this.profile_image ? this.profile_image.getLarge() : null,
            target_city: this.target_city ? this.target_city : 'milano',
            enable_push_notifications: this.enable_push_notifications,
            enable_email_notifications: this.enable_email_notifications,
            enable_newsletter: this.enable_newsletter,
            is_connected_to_facebook: this.is_connected_to_facebook,
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
var EZMixin = (function () {
    function EZMixin(id, type, title, excerpt, featured_image) {
        if (id && type && title) {
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
        console.log("STRINGIFY::::" + JSON.stringify(json));
        console.log("NO_STRINGIFY::::" + json);
        if (!json)
            return null;
        var id = json.id;
        var type = EZMixin.parseType(json.type);
        var title = json.title ? (json.title.plain ? json.title.plain : json.title) : null;
        var excerpt = json.excerpt ? (json.excerpt.plain ? json.excerpt.plain : json.excerpt) : null;
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
var EZDate = (function () {
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
var EZEvent = (function () {
    function EZEvent(id, name, startDate, endDate, startTime, endTime, price, excerpt, content, category, featured_image, gallery, venue, artists, saleable) {
        if (category === void 0) { category = []; }
        if (gallery === void 0) { gallery = []; }
        if (artists === void 0) { artists = []; }
        if (saleable === void 0) { saleable = false; }
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.price = price;
        this.excerpt = excerpt;
        this.content = content;
        this.category = category;
        this.featured_image = featured_image;
        this.gallery = gallery;
        this.artists = artists;
        this.venue = venue;
        this.saleable = saleable;
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
        var content = jsonEvent.content && jsonEvent.content.hasOwnProperty("plain") ? jsonEvent.content.plain : null;
        var category = jsonEvent.category && isArray_1.isArray(jsonEvent.category) ? jsonEvent.category : [];
        var featured_image = jsonEvent.featured_image ? EZImage.json(jsonEvent.featured_image) : null;
        var gallery = jsonEvent.gallery ? EZImage.array(jsonEvent.gallery) : null;
        var artists = jsonEvent._embedded && jsonEvent._embedded.artists && jsonEvent._embedded.artists.length > 0 ? EZArtist.array(jsonEvent._embedded.artists) : [];
        var venue = (jsonEvent._embedded && jsonEvent._embedded.venue && jsonEvent._embedded.venue.length > 0) ? EZVenue.json(jsonEvent._embedded.venue[0]) : (jsonEvent.venue_id && jsonEvent.venue_name && jsonEvent.venue_coords ? EZVenue.json({ id: jsonEvent.venue_id, name: { plain: jsonEvent.venue_name }, coordinates: jsonEvent.venue_coords }) : null);
        var saleable = jsonEvent.saleable ? jsonEvent.saleable : false;
        if (!id || !name || !startDate || !venue)
            return null;
        return new EZEvent(id, name, startDate, endDate, startTime, endTime, price, excerpt, content, category, featured_image, gallery, venue, artists, saleable);
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
            ZeroPlugin.get(BASE_API_PATH + 'events/' + _this.id + "/related?format=object").then(function (data) {
                resolve(EZEvent.array(data.data));
            }).catch(function (err) {
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
            }).catch(function (err) {
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
            }).catch(function (err) {
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
                                }).catch(function (err) {
                                    reject(new EZError(500, "Il pagamento non è andato a buon fine."));
                                });
                            }
                        });
                    }, reject);
                }
                else {
                    reject(new EZError(500, "Impossibile ottenere un token per il pagamento."));
                }
            }).catch(function (err) {
                reject(new EZError(500, "Impossibile ottenere un token per il pagamento."));
            });
        });
    };
    return EZEvent;
}());
exports.EZEvent = EZEvent;
var EZVenue = (function () {
    function EZVenue(id, name, featured_image, gallery, phone, website, rate, address, coords, category, excerpt, content, openingHours, priceLevel) {
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
        this.content = content;
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
        var content = json.content && json.content.hasOwnProperty("plain") ? json.content.plain : null;
        var category = json.category ? json.category : null;
        var openingHours = json.opening_hours ? EZTable.json(json.opening_hours) : null;
        var priceLevel = json.price_level && (typeof json.price_level == 'number') ? json.price_level : null;
        return new EZVenue(id, name, featured_image, gallery, phone, website, rate, address, coords, category, excerpt, content, openingHours, priceLevel);
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
            ZeroPlugin.get(BASE_API_PATH + 'locations/' + _this.id + "/related?format=object").then(function (data) {
                resolve(EZVenue.array(data.data));
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EZVenue.prototype.upcoming = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'locations/' + _this.id + "/calendar?format=object").then(function (data) {
                resolve(EZEvent.array(data.data));
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    EZVenue.prototype.reload = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + 'locations/' + _this.id).then(function (json) {
                resolve(EZVenue.json(json));
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
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
var EZArtist = (function () {
    function EZArtist(id, name, featured_image, gallery, preview, category, excerpt, content) {
        if (gallery === void 0) { gallery = []; }
        if (category === void 0) { category = []; }
        this.id = id;
        this.name = name;
        this.featured_image = featured_image;
        this.gallery = gallery;
        this.preview = preview;
        this.category = category;
        this.excerpt = excerpt;
        this.content = content;
    }
    EZArtist.json = function (jsonArtist) {
        var id = jsonArtist.id;
        var name = jsonArtist.name ? jsonArtist.name.plain : null;
        var featured_image = EZImage.json(jsonArtist.featured_image);
        var gallery = EZImage.array(jsonArtist.gallery);
        var preview = new EZSoundTrack(jsonArtist.preview_url);
        var category = isArray_1.isArray(jsonArtist.category) ? jsonArtist.category : [];
        var excerpt = jsonArtist.excerpt && jsonArtist.excerpt.hasOwnProperty("plain") ? jsonArtist.excerpt.plain : null;
        var content = jsonArtist.content && jsonArtist.content.hasOwnProperty("plain") ? jsonArtist.content.plain : null;
        if (!id || !name)
            return null;
        return new EZArtist(id, name, featured_image, gallery, preview, category, excerpt, content);
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
            ZeroPlugin.get(BASE_API_PATH + 'artists/' + _this.id + "/calendar?format=object").then(function (data) {
                resolve(EZEvent.array(data.data));
            }).catch(function (err) {
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
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return EZArtist;
}());
exports.EZArtist = EZArtist;
var EZTicket = (function () {
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
    EZSoundTrack.prototype.playing = function () {
        return this.isPlaying;
    };
    return EZSoundTrack;
}());
exports.EZSoundTrack = EZSoundTrack;
var EZPrice = (function () {
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
var EZRate = (function () {
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
var EZBrand = (function () {
    function EZBrand(id, name, title, description, logo, link, background, textPrimaryColor, textContrastColor, content) {
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
        this.link = link;
        this.name = name;
        this.content = content;
    }
    EZBrand.json = function (j) {
        var id = j.id;
        var name = j.name;
        var title = j.title;
        var descr = j.description;
        var logo = j.logo;
        var background = j.background;
        var primary = j.text_primary_color;
        var contrast = j.text_contrast_color;
        var link = j.link;
        var content = EZBrandedContent.array(j.contents);
        if (id != null && title != null && logo != null)
            return new EZBrand(id, name, title, descr, logo, link, background, primary, contrast, content);
        return null;
    };
    EZBrand.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var mix = EZBrand.json(arr[i]);
            if (mix && mix != {})
                ret.push(mix);
        }
        return ret;
    };
    return EZBrand;
}());
exports.EZBrand = EZBrand;
var EZGenericContent = (function () {
    function EZGenericContent(type, content) {
        if (type == null || content == null)
            return null;
        this.content = content;
        this.type = type;
    }
    EZGenericContent.json = function (j) {
        var type = EZMixin.parseType(j.type);
        var ret = null;
        switch (type) {
            case EZType.Event:
                ret = new EZGenericContent(type, EZEvent.json(j.content));
                break;
            case EZType.Venue:
                ret = new EZGenericContent(type, EZVenue.json(j.content));
                break;
            case EZType.Artist:
                ret = new EZGenericContent(type, EZArtist.json(j.content));
                break;
            case EZType.Article:
                ret = new EZGenericContent(type, EZArticle.json(j.content));
                break;
        }
        if (ret)
            return ret;
        return null;
    };
    EZGenericContent.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var mix = EZGenericContent.json(arr[i]);
            if (mix && mix != {})
                ret.push(mix);
        }
        return ret;
    };
    return EZGenericContent;
}());
exports.EZGenericContent = EZGenericContent;
var EZBrandedContent = (function (_super) {
    __extends(EZBrandedContent, _super);
    function EZBrandedContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EZBrandedContent;
}(EZGenericContent));
exports.EZBrandedContent = EZBrandedContent;
var EZArticle = (function () {
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
            var dates = _this.date.getFullYear().toString() + "-" + (_this.date.getMonth() + 1).toString() + "-" + _this.date.getDate().toString();
            var categories = _this.category && _this.category.length > 0 ? "&category=" + _this.category.join("|") : "";
            var coords = _this.coords ? "&coords[lat]=" + _this.coords.lat + "&coords[lng]=" + _this.coords.lng : "";
            _this.page++;
            ZeroPlugin.get(BASE_API_PATH + "events/tree?context=view&page=" + _this.page + "&days=" + _this.perPage + "&start_date=" + dates + "&metro_area=" + _this.city + "&order=asc" + coords + categories)
                .then(function (data) {
                    resolve(EZDay.array(data.days));
                }).catch(function (err) {
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
                }).catch(function (err) {
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
                }).catch(function (err) {
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
                }).catch(function (err) {
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
                }).catch(function (err) {
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
            ZeroPlugin.get(BASE_API_PATH + "artists/" + id + "?_embed=1")
                .then(function (data) {
                    resolve(EZArtist.json(data));
                }).catch(function (err) {
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
                }).catch(function (err) {
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
                    }).catch(function (err) {
                        Zero.onError(EZError.fromString(err));
                        reject(EZError.fromString(err));
                    });
                }
                else {
                    reject(new EZError(401, "Login Failed."));
                }
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.signup = function (first_name, last_name, email) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.signup(first_name, last_name, email).then(resolve).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.setPassword = function (key, login, password) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.setPassword(key, login, password).then(resolve).catch(function (err) {
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
            ZeroPlugin.updateUser(_this.user.prepare()).then(resolve).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    AccountManager.prototype.isLogged = function () {
        return new Promise(function (resolve, reject) {
            return ZeroPlugin.checkLogin().then(resolve).catch(function (err) {
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
            }).catch(function (err) {
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
            }).catch(function (err) {
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
            }).catch(function (err) {
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
            }).catch(function (err) {
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
var TicketManager = (function () {
    function TicketManager() {
    }
    TicketManager.prototype.all = function () {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + "users/me/tickets/").then(function (data) {
                resolve(EZTicket.array(data));
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    TicketManager.instance = null;
    return TicketManager;
}());
exports.TicketManager = TicketManager;
var SearchEngine = (function () {
    function SearchEngine() {
    }
    SearchEngine.save = function (search) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.saveRecentResearch(search).then(function () {
                resolve();
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    SearchEngine.recent = function () {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.recentResearch().then(function (res) {
                console.log(res);
                resolve(EZMixin.array(res.map(function (el) {
                    return JSON.parse(el);
                })).filter(function (el) {
                    return el != null && el != {};
                }));
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    SearchEngine.search = function (q, f) {
        if (f === void 0) { f = [EZType.Artist, EZType.Venue, EZType.Event]; }
        return new Promise(function (resolve, reject) {
            var c = f.join("|");
            var s = encodeURIComponent(q.replace("/", "").replace("\\", "")).replace("%20", "+");
            ZeroPlugin.get(BASE_API_PATH + "search/" + s + "/?types=" + c + "&format=object").then(function (res) {
                resolve(EZMixin.array(res.data));
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    SearchEngine.branded = function () {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + "app/sponsored/?target=app&format=object").then(function (res) {
                resolve(EZBrand.array(res.data));
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    SearchEngine.foryou = function () {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.get(BASE_API_PATH + "events/hints/?format=object").then(function (res) {
                resolve(EZGenericContent.array(res.data));
            }).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return SearchEngine;
}());
exports.SearchEngine = SearchEngine;
var EZCity = (function () {
    function EZCity(name, slug, center, filters) {
        this.name = name;
        this.slug = slug;
        this.center = center;
        this.filters = filters;
        if (!name || !slug || !center)
            return null;
    }
    EZCity.json = function (j) {
        return new EZCity(j.name, j.slug, j.coordinates, EZFilter.array(j.filters));
    };
    EZCity.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var mix = EZCity.json(arr[i]);
            if (mix)
                ret.push(mix);
        }
        return ret;
    };
    return EZCity;
}());
exports.EZCity = EZCity;
var EZFilter = (function () {
    function EZFilter(filter, slug, selected) {
        if (selected === void 0) { selected = false; }
        this.selected = false;
        if (!filter || !slug)
            return null;
        this.filter = filter;
        this.slug = slug;
        this.selected = selected;
    }
    EZFilter.json = function (j) {
        return new EZFilter(j.name, j.slug, false);
    };
    EZFilter.array = function (arr) {
        var ret = [];
        if (!isArray_1.isArray(arr) || arr.length == 0)
            return ret;
        for (var i = 0; i < arr.length; i++) {
            var mix = EZFilter.json(arr[i]);
            if (mix)
                ret.push(mix);
        }
        return ret;
    };
    return EZFilter;
}());
exports.EZFilter = EZFilter;
var EZConfiguration = (function () {
    function EZConfiguration(mantenanceMode, needsUpdate, ticketsEnabled, cities) {
        if (mantenanceMode === void 0) { mantenanceMode = false; }
        if (needsUpdate === void 0) { needsUpdate = false; }
        if (ticketsEnabled === void 0) { ticketsEnabled = false; }
        if (cities === void 0) { cities = []; }
        this.maintenanceMode = mantenanceMode;
        this.needsUpdate = needsUpdate;
        this.ticketsEnabled = ticketsEnabled;
        this.cities = cities;
    }
    EZConfiguration.init = function (json) {
        var maintenanceMode = json.maintenance_mode;
        var needsUpdate = json.needs_update;
        var ticketsEnabled = json.tickets_enabled;
        var cities = EZCity.array(json.metro_areas);
        EZConfiguration.instance = new EZConfiguration(maintenanceMode, needsUpdate, ticketsEnabled, cities);
        return EZConfiguration.instance != null;
    };
    EZConfiguration.current = function () {
        return EZConfiguration.instance;
    };
    EZConfiguration.instance = null;
    return EZConfiguration;
}());
exports.EZConfiguration = EZConfiguration;
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
    Zero.init = function (clientID, clientSecret, platform) {
        return new Promise(function (resolve, reject) {
            ZeroPlugin.init(clientID, clientSecret).then(function () {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', BASE_API_PATH + "app/settings?apikey=" + API_KEY + "&app_version=" + APP_VERSION + "&platform=" + platform);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        if (EZConfiguration.init(JSON.parse(xhr.responseText))) {
                            return resolve();
                        }
                        else {
                            return reject(new EZError(503, "Unexpected Response"));
                        }
                    }
                    else {
                        return reject(new EZError(xhr.status, "FATAL_ERROR"));
                    }
                };
                xhr.addEventListener("error", function (err) {
                    return reject(new EZError(xhr.status, "FATAL_ERROR"));
                });
                xhr.send();
            }).catch(reject);
        });
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
            ZeroPlugin.post(BASE_API_PATH + "support/issue", { subject: subject, message: message }).then(resolve).catch(function (err) {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    };
    return Zero;
}());
exports.Zero = Zero;
//# sourceMappingURL=index.js.map