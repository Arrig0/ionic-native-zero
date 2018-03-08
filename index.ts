import { Media, MediaObject } from '@ionic-native/media';
import {isArray} from "rxjs/util/isArray";

declare var ZeroPlugin: any;
declare var BraintreePlugin;

const API_KEY: string = 'Amichetti_come_Kim_Jong-un';
const BASE_API_PATH: string = "http://192.168.60.113/api/v2/";
const APP_VERSION: string = "v1.0.0";
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


export class EZError extends Error {
    readonly code: number;
    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }

    public static fromString(reason: string, separator: string = ':'): EZError {
        console.log("ezerror:::"+JSON.stringify(reason))
        if(!reason || !(typeof reason == 'string')) return new EZError(500, "Generic Error");
        let err = reason.split(separator);
        if(err.length == 2){
            let code = err[0];
            let msg = err[1];
            if(!isNaN(parseInt(code))) {
                return new EZError(parseInt(code), msg);
            } else {
                if(!isNaN(parseInt(msg))) {
                    return new EZError(parseInt(msg), code);
                } else {
                    return new EZError(500, reason);
                }
            }
        } else {
            return new EZError(500, reason);
        }

    }
}

export class EZUser {
    public id: number;
    public first_name: string;
    public last_name: string;
    public email: string;
    public profile_image: EZImage | null;
    public enable_push_notifications: boolean = false;
    public enable_email_notifications: boolean = false;
    public enable_newsletter: boolean = false;
    public is_connected_to_facebook: boolean = false;

    constructor(id: number, first_name: string, last_name: string, email: string, profile_image: EZImage | null, enable_push_notifications: boolean = false, enable_email_notifications: boolean = false, enable_newsletter: boolean = false, is_connected_to_facebook: boolean = false) {

        if( !id || !first_name || !last_name || !email )
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

    public static json(json: any): EZUser | null {
        return new EZUser(json.id, json.first_name, json.last_name, json.email, EZImage.json(json.profile_image), json.enable_push_notifications, json.enable_email_notifications, json.enable_newsletter, json.is_connected_to_facebook);
    }

    public preferences() : { enable_push_notifications: boolean, enable_email_notifications: boolean, enable_newsletter: boolean, is_connected_to_facebook: boolean } {
        return { enable_push_notifications: this.enable_push_notifications, enable_email_notifications: this.enable_email_notifications, enable_newsletter: this.enable_newsletter, is_connected_to_facebook: this.is_connected_to_facebook };
    }

    public info(): { id: number, first_name: string, last_name: string, email: string } {
        return { id: this.id, first_name: this.first_name, last_name: this.last_name, email: this.email };
    }

    public prepare() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            profile_image: this.profile_image ? this.profile_image.getLarge() : null,
            enable_push_notifications: this.enable_push_notifications,
            enable_email_notifications: this.enable_email_notifications,
            enable_newsletter: this.enable_newsletter,
            is_connected_to_facebook: this.is_connected_to_facebook,
        }
    }
}

export enum EZType {
    Event = "event",
    Venue = "venue",
    Artist = "artist",
    Article = "article"
}

export class EZMixin {
    readonly id: number;
    readonly type: EZType;
    readonly title: string;
    readonly excerpt: string;
    readonly featured_image: EZImage;

    constructor(id: number, type: EZType, title: string, excerpt: string, featured_image: EZImage) {
        if(id && type && title) {
            this.id = id;
            this.type = type;
            this.title = title;
            this.excerpt = excerpt;
            this.featured_image = featured_image;
        } else {
            return null;
        }
    }

    static json( json: any ): EZMixin | null {
        console.log("STRINGIFY::::"+JSON.stringify(json));
        console.log("NO_STRINGIFY::::"+json);
        if(!json)
            return null;

        let id = json.id;
        let type = EZMixin.parseType(json.type);
        let title = json.title ? (json.title.plain ? json.title.plain : json.title) : null;
        let excerpt = json.excerpt ? (json.excerpt.plain ? json.excerpt.plain : json.excerpt) : null;
        let image = EZImage.json(json.featured_image);

        return new EZMixin(id, type, title, excerpt, image);
    }

    static array(jsonArray: any[]): EZMixin[] {
        let ret = [];
        if(!isArray(jsonArray) || jsonArray.length == 0) return ret;
        for(let i = 0; i < jsonArray.length; i++) {
            let mix = EZMixin.json(jsonArray[i]);
            if(mix) ret.push(mix);
        }
        return ret;
    }

    public static parseType(val: string): EZType | null {
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
    }

    public concrete() : Promise<EZEvent> | Promise<EZVenue> | Promise<EZArtist> {
        switch (this.type) {
            case EZType.Event:
                return EventManager.get(this.id);
            case EZType.Venue:
                return VenueManager.get(this.id);
            case EZType.Artist:
                return ArtistManager.get(this.id);
        }
    }
}

export class EZDate {
    private date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    public friendly(): string {
        let today = new Date();
        let ddays = this.date.getDate() - today.getDate();
        if( this.date.getMonth() == today.getMonth() && this.date.getFullYear() == today.getFullYear()) {
            if(ddays == 0) {
                return "Oggi"
            } else if(ddays == 1) {
                return "Domani"
            } else {
                return this.date.toLocaleDateString("it-IT", { weekday: 'long', month: 'long', day: 'numeric' })
            }
        } else {
            return this.date.toLocaleDateString("it-IT", { weekday: 'long', month: 'long', day: 'numeric' })
        }
    }
}

export class EZDay {
    public date: Date;
    public events: EZEvent[];

    constructor(date: Date, events: EZEvent[]) {
        this.date = date;
        this.events = events;
    }

    public static json(json: any): EZDay {
        return new EZDay(new Date(json.date), EZEvent.array(json.events));
    }

    public static array(arr: any[]): EZDay[] {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let ev = EZDay.json(arr[i]);
            if(ev) ret.push(ev);
        }
        return ret;
    }

    public friendly(): string {
        return (new EZDate(this.date)).friendly()
    }
}

export class EZEvent {
    readonly id: number;
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly startTime: Date | null;
    readonly endTime: Date | null;
    readonly price: EZPrice | null;
    readonly excerpt: string | null;
    readonly category: string[];
    readonly featured_image: EZImage | null;
    readonly gallery: EZImage[];
    readonly artists: EZArtist[];
    readonly venue: EZVenue | null;

    constructor(id: number, name: string, startDate: Date, endDate: Date, startTime: Date | null, endTime: Date | null, price: EZPrice | null, excerpt: string, category: string[] = [], featured_image: EZImage | null, gallery: EZImage[] = [], venue: EZVenue | null, artists: EZArtist[] = []) {
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

    static json(jsonEvent: any): EZEvent | null {
        let id = jsonEvent.id;
        let name = jsonEvent.name ? jsonEvent.name.plain : null;
        let startDate = jsonEvent.start_date ? new Date(jsonEvent.start_date) : null;
        let endDate = jsonEvent.end_date ? new Date(jsonEvent.end_date) : null;
        let startTime = jsonEvent.start_time ? new Date((new Date()).toDateString() + " " + jsonEvent.start_time) : null;
        let endTime = jsonEvent.end_time ? new Date((new Date()).toDateString() + " " + jsonEvent.end_time) : null;
        let price = jsonEvent.price ? EZPrice.json(jsonEvent.price) : null;
        let excerpt = jsonEvent.excerpt && jsonEvent.excerpt.hasOwnProperty("plain") ? jsonEvent.excerpt.plain : null;
        let category = jsonEvent.category && isArray(jsonEvent.category) ? jsonEvent.category : [];
        let featured_image = jsonEvent.featured_image ? EZImage.json(jsonEvent.featured_image) : null;
        let gallery = jsonEvent.gallery ? EZImage.array(jsonEvent.gallery) : null;
        let artists = jsonEvent._embedded && jsonEvent._embedded.artists && jsonEvent._embedded.artists.length > 0 ? EZArtist.array(jsonEvent._embedded.artists) : [];
        let venue = (jsonEvent._embedded && jsonEvent._embedded.venue && jsonEvent._embedded.venue.length > 0) ? EZVenue.json(jsonEvent._embedded.venue[0]): (jsonEvent.venue_id && jsonEvent.venue_name && jsonEvent.venue_coords ? EZVenue.json({id: jsonEvent.venue_id, name: { plain: jsonEvent.venue_name }, coordinates: jsonEvent.venue_coords}) : null);

        if( !id || !name || !startDate || !venue ) return null;

        return new EZEvent(id, name, startDate, endDate, startTime, endTime, price, excerpt, category, featured_image, gallery, venue, artists);
    }

    static array(arr: any[]): EZEvent[] {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let ev = EZEvent.json(arr[i]);
            if(ev) ret.push(ev);
        }
        return ret;
    }

    images(): EZImage[] {
        return [this.featured_image].concat(this.gallery).filter((el) => {
            return !!el
        })
    }

    related(): Promise<EZEvent[]> {
        return new Promise<EZEvent[]>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + 'events/' + this.id + "/related?format=object").then((data) => {
                resolve(EZEvent.array(data.data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

    reload(): Promise<EZEvent> {
        return new Promise<EZEvent>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + 'events/' + this.id).then((json) => {
                resolve(EZEvent.json(json));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

    pricing(): Promise<{availability: number, currency: EZCurrency, rates: EZRate[]}> {
        return new Promise<{availability: number, currency: EZCurrency, rates: EZRate[]}>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + 'events/'+this.id+'/tickets/pricing').then((json) => {
                resolve({
                    availability: json.availability,
                    currency: json.currency,
                    rates: EZRate.array(json.rates)
                });
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        })
    }

    purchase(rates: {rate: EZRate, quantity: number}[]): Promise<void> {
        let that = this;
        return new Promise<void>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + "payments/token").then((data) => {
                let token = data.token;
                if(token != null && token != "") {
                    BraintreePlugin.initialize(
                        token,
                        () => {
                            let s = 0;
                            for(var i = 0; i < rates.length; i++) {
                                let el = rates[i];
                                if(el.rate == null || el.rate.price == null)
                                    return reject(new EZError(500, "Il pagamento non è andato a buon fine."));
                                let price = el.rate.price.price != null ? el.rate.price.price : 0;
                                let presale = el.rate.price.presale != null ? el.rate.price.presale : 0;
                                let charges = el.rate.price.charges != null ? el.rate.price.charges : 0;
                                s += el.quantity * (price + presale + charges);
                            }
                            let options = {
                                amount: s,
                                primaryDescription: that.name + " @ " + that.venue.name + " - " + (new EZDate(that.startDate)).friendly()
                            };
                            BraintreePlugin.presentDropInPaymentUI(options, function (result) {
                                if (result.userCancelled) {
                                    reject(new EZError(403,"User cancel payment"));
                                }
                                else if(result.nonce != null && result.nonce != "") {
                                    let ratesParam = rates.map((el, index) => {
                                        return "rates["+index+"]['id']="+el.rate.id+"&rates["+index+"]['quantity']="+el.quantity;
                                    }).join("&");
                                    console.log(ratesParam);
                                    ZeroPlugin.get(BASE_API_PATH + "cart/expresscheckout"+"/?payment_nonce="+result.nonce+"&"+ratesParam).then((response) => {
                                        console.log(JSON.stringify(response));
                                        if(response.status) {
                                            resolve();
                                        } else {
                                            reject(new EZError(500, "Il pagamento non è andato a buon fine."));
                                        }
                                    }).catch(err => {
                                        reject(new EZError(500, "Il pagamento non è andato a buon fine."));
                                    });
                                }
                            });
                        },
                        reject
                    );
                } else {
                    reject(new EZError(500, "Impossibile ottenere un token per il pagamento."));
                }
            }).catch(err => {
                reject(new EZError(500, "Impossibile ottenere un token per il pagamento."));
            });
        });
    }
}

export class EZVenue {
    readonly id: number;
    readonly name: string;
    readonly featured_image: EZImage | null;
    readonly gallery: EZImage[] = [];
    readonly phone: string | null;
    readonly website: string | null;
    readonly rate: number | null;
    readonly address: string | null;
    readonly coords: { lat: number, lng: number } | null;
    readonly category: string[] = [];
    readonly excerpt: string | null;
    readonly openingHours: EZTable | null;
    readonly priceLevel: number | null;

    constructor(id: number, name: string, featured_image: EZImage | null, gallery: EZImage[] = [], phone: string | null, website: string | null, rate: number | null, address: string | null, coords: { lat: number, lng: number } | null, category: string[] = [], excerpt: string | null, openingHours: EZTable | null, priceLevel: number | null) {
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

        if( !id || !name || !coords ) return null;
    }

    static json(json: any): EZVenue | null {
        let id = json.id;
        let name = json.name ? json.name.plain : json.name;
        let featured_image = json.featured_image ? EZImage.json(json.featured_image) : null;
        let gallery = json.gallery && isArray(json.gallery) ? EZImage.array(json.gallery) : null;
        let phone = json.phone ? json.phone : null;
        let website = json.website ? json.website : null;
        let rate = json.ratings && (typeof json.ratings == 'number') ? json.ratings : null;
        let address = json.full_address ? json.full_address: null;
        let coords = json.coordinates && json.coordinates.hasOwnProperty('lat') && json.coordinates.hasOwnProperty('lng') ? json.coordinates : null;
        let excerpt = json.excerpt && json.excerpt.hasOwnProperty("plain") ? json.excerpt.plain : null;
        let category = json.category ? json.category : null;
        let openingHours = json.opening_hours ? EZTable.json(json.opening_hours) : null;
        let priceLevel = json.price_level && (typeof json.price_level == 'number') ? json.price_level : null;

        return new EZVenue(id, name, featured_image, gallery, phone, website, rate, address, coords, category, excerpt, openingHours, priceLevel);
    }

    static array(arr: any[]): EZVenue[] {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let venue = EZVenue.json(arr[i]);
            if(venue) ret.push(venue);
        }
        return ret;
    }

    images(): EZImage[] {
        return [this.featured_image].concat(this.gallery).filter((el) => {
            return !!el
        })
    }

    related(): Promise<EZVenue[]> {
        return new Promise<EZVenue[]>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + 'locations/' + this.id + "/related?format=object").then((data) => {
                resolve(EZVenue.array(data.data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

    upcoming(): Promise<EZEvent[]> {
        return new Promise<EZEvent[]>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + 'locations/' + this.id + "/calendar?format=object").then((data) => {
                resolve(EZEvent.array(data.data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }
    
    reload(): Promise<EZVenue> {
        return new Promise<EZVenue>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + 'locations/' + this.id).then((json) => {
                resolve(EZVenue.json(json));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

}

export class EZImage {
    private thumb: string | null;
    private standard: string | null;
    private large: string | null;

    constructor(thumb: string | null, standard: string | null, large: string | null) {
        if(thumb || standard || large) {
            this.thumb = thumb;
            this.standard = standard;
            this.large = large;
        } else {
            return null;
        }
    }

    static json(jsonImage: any): EZImage | null {
        if(!jsonImage) return null;
        if(typeof jsonImage == "string") return new EZImage(null, jsonImage, null);
        if(jsonImage.thumb || jsonImage.standard || jsonImage.large) return new EZImage(jsonImage.thumb, jsonImage.standard, jsonImage.large);
        if((!jsonImage.sizes)) {
            let thumb = jsonImage.file;
            return new EZImage(thumb, null, null);
        } else {
            let thumb = jsonImage.sizes.thumbnail ? jsonImage.sizes.thumbnail.file : null;
            let standard = jsonImage.sizes.medium ? jsonImage.sizes.medium.file: null;
            let large = jsonImage.sizes.large ? jsonImage.sizes.large.file : null;
            if(thumb || standard || large) {
                return new EZImage(thumb, standard, large);
            }
        }
        return null;
    }

    static array(jsonArray: any[]): EZImage[] {
        let ret = [];
        if(!isArray(jsonArray) || jsonArray.length == 0) return ret;
        for(let i = 0; i < jsonArray.length; i++) {
            let img = EZImage.json(jsonArray[i]);
            if(img) ret.push(img);
        }
        return ret;
    }

    private fallBack(startFrom: string = 'large'): string | null {
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
    }

    public getLarge(): string | null {
        return this.large ? this.large : this.fallBack('large');
    }

    public getStandard(): string | null {
        return this.standard ? this.standard : this.fallBack('standard');
    }

    public getThumb(): string | null {
        return this.thumb ? this.thumb : this.fallBack('thumb');
    }
}

export class EZArtist {
    readonly id: number;
    readonly name: string;
    readonly featured_image: EZImage | null;
    readonly gallery: EZImage[];
    readonly preview: EZSoundTrack | null;
    readonly category: string[];
    readonly excerpt: string | null;

    constructor(id: number, name: string, featured_image: EZImage | null, gallery: EZImage[] = [], preview: EZSoundTrack | null, category: string[] = [], excerpt: string | null) {
        this.id = id;
        this.name = name;
        this.featured_image = featured_image;
        this.gallery = gallery;
        this.preview = preview;
        this.category = category;
        this.excerpt = excerpt;
    }

    static json(jsonArtist: any): EZArtist | null {
        let id = jsonArtist.id;
        let name = jsonArtist.name ? jsonArtist.name.plain : null;
        let featured_image = EZImage.json(jsonArtist.featured_image);
        let gallery = EZImage.array(jsonArtist.gallery);
        let preview = new EZSoundTrack(jsonArtist.preview_url);
        let category = isArray(jsonArtist.category) ? jsonArtist.category: [];
        let excerpt = jsonArtist.excerpt && jsonArtist.excerpt.hasOwnProperty("plain") ? jsonArtist.excerpt.plain : null;

        if( !id || !name ) return null;
        return new EZArtist(id, name, featured_image, gallery, preview, category, excerpt);
    }

    static array(jsonArray: any[]): EZArtist[] {
        let ret = [];
        if(!isArray(jsonArray) || jsonArray.length == 0) return ret;
        for(let i = 0; i < jsonArray.length; i++) {
            let img = EZArtist.json(jsonArray[i]);
            if(img) ret.push(img);
        }
        return ret;
    }


    upcoming(): Promise<EZEvent[]> {
        return new Promise<EZEvent[]>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + 'artists/' + this.id + "/calendar?format=object").then((data) => {
                resolve(EZEvent.array(data.data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

    reload(): Promise<EZArtist> {
        return new Promise<EZArtist>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + 'artists/' + this.id).then((json) => {
                resolve(EZArtist.json(json));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

}

export class EZTicket {
    readonly id: number;
    readonly event: EZEvent;
    readonly price: string;
    readonly validFrom: Date;
    readonly validTo: Date;
    readonly code: string;

    constructor(id: number | null, event: EZEvent | null, price: string | null, validFrom: Date | null, validTo: Date | null, code: string | null) {
        if( !id || !event || !price || !code ) return null;
        this.id = id;
        this.event = event;
        this.price = price;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.code = code;
    }

    public static json(json: any): EZTicket | null {
        return new EZTicket(json.id, EZEvent.json(json.event), json.price, new Date(json.validFrom), new Date(json.validTo), json.code);
    }

    public static array(jsonArray: any): EZTicket[] {
        let ret = [];
        if(!isArray(jsonArray) || jsonArray.length == 0) return ret;
        for(let i = 0; i < jsonArray.length; i++) {
            let t = EZTicket.json(jsonArray[i]);
            if(t) ret.push(t);
        }
        return ret;
    }
}

export class EZSoundTrack {

    private url: string;
    private isPlaying: boolean = false;
    private media: MediaObject = null;
    private disable: boolean = false;

    constructor(url: string) {
        if(!url) return null;
        let that = this;
        this.url = url;
        this.media = (new Media()).create(this.url);
        this.media.onStatusUpdate.subscribe((status) => {
            that.disable = false;
            if(status == 1 || status == 2) {
                that.isPlaying = true;
            } else if(status == 3 || status == 4) {
                that.isPlaying = false;
            }
        });
        this.media.onError.subscribe((error)=> {
            that.isPlaying = false;
            that.disable = false;
            Zero.onError(new EZError(9, "EZSoundTrack error: "+error))
        });
    }

    play() {
        if(this.disable) return;
        this.disable = true;
        this.media.play();
    }

    stop() {
        if(this.disable) return;
        this.disable = true;
        this.media.stop();
    }

    toggle() {
        if(this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }

    playing(): boolean {
        return this.isPlaying;
    }
}

export class EZPrice {
    readonly display: string;
    readonly price: number;
    readonly charges: number;
    readonly presale: number;

    constructor(display: string | null, price: number | null, charges: number | null, presale: number | null) {
        this.display = display;
        this.price = price;
        this.presale = presale;
        this.charges = charges;
    }

    static json(jsonPrice: any): EZPrice | null {
        let display = "";
        let price = null;
        let charges = null;
        let presale = null;

        if(typeof jsonPrice == "string") {
            display = jsonPrice;
        } else if( jsonPrice && (typeof jsonPrice == 'object') ) {
            display = jsonPrice.display;
            price = jsonPrice.price;
            charges = jsonPrice.charges;
            presale = jsonPrice.presale;
        } else {
            return null;
        }
        return new EZPrice(display, price, charges, presale);
    }

    static array(arr: any[]): EZPrice[] {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let price = EZPrice.json(arr[i]);
            if(price) ret.push(price);
        }
        return ret;
    }
}

export class EZRate {
    readonly id: number;
    readonly name: string;
    readonly description: string | null;
    readonly price: EZPrice

    constructor(id: number, name: string, description: string, price: EZPrice) {
        if(id && name && price) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
        } else {
            return null;
        }
    }

    static json(json: any): EZRate {
        if(!json) return null;
        let id = json.id;
        let name = json.name;
        let price = EZPrice.json(json.price);
        if(id && name && price) {
            return new EZRate(id, name, json.description, price);
        }
        return null;
    }

    static array(arr: any[]): EZRate[] {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let rate = EZRate.json(arr[i]);
            if(rate) ret.push(rate);
        }
        return ret;
    }
}

export class EZTable {
    readonly dict: EZDictionary[] | null;

    constructor(dict: EZDictionary[]) {
        this.dict = dict;
    }

    static json(json: any[]): EZTable | null {
        if(!isArray(json)) return null;
        let dict = [];
        for(let i = 0; i < json.length; i++) {
            let el = json[i];
            let name = el.name;
            let value = el.value;
            if(name && value) {
                dict.push({name: name, value: value});
            }
        }
        if(dict.length == 0) return null;
        return new EZTable(dict);
    }
}

export class EZBrand {
    readonly id: number;
    readonly name: string;
    readonly title: string;
    readonly description: string;
    readonly logo: string;
    readonly link: string;
    readonly background: string;
    readonly textPrimaryColor: string;
    readonly textContrastColor: string;
    readonly content: EZBrandedContent[];

    constructor(id: number, name: string, title: string, description: string, logo: string, link: string, background: string = "#ffffff", textPrimaryColor: string = "#000000", textContrastColor: string = "#ffffff", content: EZBrandedContent[] = []) {
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

    static json(j: any): EZBrand {
        let id = j.id;
        let name = j.name;
        let title = j.title;
        let descr = j.description;
        let logo = j.logo;
        let background = j.background;
        let primary = j.text_primary_color;
        let contrast = j.text_contrast_color;
        let link = j.link;
        let content = EZBrandedContent.array(j.contents);
        if(id != null && title != null && logo != null) return new EZBrand(id, name, title, descr, logo, link, background, primary, contrast, content);
        return null;
    }

    static array(arr: any[]): EZBrand[] {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let mix = EZBrand.json(arr[i]);
            if(mix && mix != {}) ret.push(mix);
        }
        return ret;
    }

}

export class EZGenericContent {
    readonly type: EZType;
    readonly content: EZEvent | EZVenue | EZArtist | EZArticle;

    constructor(type: EZType, content: EZEvent | EZVenue | EZArtist | EZArticle) {
        if(type == null || content == null) return null;
        this.content = content;
        this.type = type;
    }

    static json(j: any): EZGenericContent {
        let type = EZMixin.parseType(j.type);
        let ret = null;
        switch(type) {
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
        if(ret) return ret;
        return null;
    }
    
    static array(arr: any[]): EZGenericContent[] {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let mix = EZGenericContent.json(arr[i]);
            if(mix && mix != {}) ret.push(mix);
        }
        return ret;
    }

}

export class EZBrandedContent extends EZGenericContent {}

export class EZArticle {
    readonly title: string;
    readonly category: string;
    readonly excerpt: string;
    readonly link: string;
    readonly featured_image: EZImage;

    constructor(title: string, category: string, excerpt: string, link: string, featured_image: EZImage) {
        if(title != null && link != null && featured_image != null) {
            this.title = title;
            this.category = category;
            this.excerpt = excerpt;
            this.link = link;
            this.featured_image = featured_image;
        } else {
            return null;
        }
    }

    static json(j: any): EZArticle {
        let title = j.title;
        let category = j.category;
        let excerpt = j.excerpt;
        let link = j.link;
        let fi = EZImage.json(j.featured_image);
        return new EZArticle(title, category, excerpt, link, fi);
    }
}


export interface EZDictionary {
    name: string;
    value: any;
}

export interface EZCurrency {
    iso_code: string
    symbol: string
}

export class EZTrigger<T> {
    id: string;
    trigger: (param?: T) => void;

    constructor(id: string, action: (param?: T) => void) {
        this.id = id;
        this.trigger = action;
    }
}

export class EventManager {
    private page: number;
    readonly perPage: number;
    readonly city: string;
    readonly category: string[];
    readonly date: Date;
    readonly coords: {lat: number, lng: number} | null;

    constructor(perPage: number = 1, city: string = "null", date: Date = new Date(), coords: {lat: number, lng: number} | null = null, category: string[]) {
        this.page = 0;
        this.perPage = perPage;
        this.city = city;
        this.date = date;
        this.coords = coords;
        this.category = category;
    }

    next(): Promise<EZDay[]> {
        return new Promise<EZDay[]>((resolve, reject) => {
            let dates = this.date.getFullYear().toString()+"-"+(this.date.getMonth() +1 ).toString()+"-"+this.date.getDate().toString();
            let categories = this.category && this.category.length > 0 ? "&category=" + this.category.join("|") : "";
            let coords = this.coords ? "&coords[lat]="+this.coords.lat+"&coords[lng]="+this.coords.lng : "";
            this.page ++;
            ZeroPlugin.get(BASE_API_PATH + "events/tree?context=view&_embed=1&page="+this.page+"&days="+this.perPage+"&start_date="+dates+"&metro_area="+this.city+"&order=asc"+coords+categories)
            .then((data)=>{
                resolve(EZDay.array(data.days));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    reset() {
        this.page = 0;
    }

    static get(id: number): Promise<EZEvent> {
        return new Promise<EZEvent>((resolve, reject) =>{
            ZeroPlugin.get(BASE_API_PATH + "events/"+id+"?_embed=1")
            .then((data)=>{
                resolve(EZEvent.json(data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }
}

export class VenueManager {
    private page: number;
    readonly perPage: number;
    readonly city: string;
    readonly category: string[];
    readonly date: Date;
    readonly coords: {lat: number, lng: number} | null;

    constructor(perPage: number = 30, city: string = "null", date: Date = new Date(), coords: {lat: number, lng: number} | null = null, category: string[]) {
        this.page = 0;
        this.perPage = perPage;
        this.city = city;
        this.date = date;
        this.coords = coords;
        this.category = category;
    }

    next(): Promise<EZVenue[]> {
        return new Promise<EZVenue[]>((resolve, reject) => {
            let dates = this.date.getFullYear().toString()+"-"+this.date.getMonth().toString()+"-"+this.date.getDay().toString();
            let categories = this.category && this.category.length > 0 ? "&category=" + this.category.join("|") : "";
            let coords = this.coords ? "&coords[lat]="+this.coords.lat+"&coords[lng]="+this.coords.lng : "";
            this.page ++;
            ZeroPlugin.get(BASE_API_PATH + "locations?context=view&page="+this.page+"&per_page="+this.perPage+"&start_date="+dates+"&metro_area="+this.city+"&order=asc"+coords+categories)
            .then((data)=>{
                resolve(EZVenue.array(data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    reset() {
        this.page = 0;
    }

    static get(id: number): Promise<EZVenue> {
        return new Promise<EZVenue>((resolve, reject) =>{
            ZeroPlugin.get(BASE_API_PATH + "locations/"+id+"?_embed=1")
            .then((data)=>{
                    resolve(EZVenue.json(data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }
}

export class ArtistManager {
    private page: number;
    readonly perPage: number;
    readonly category: string[];

    constructor(perPage: number = 30, category: string[]) {
        this.page = 0;
        this.perPage = perPage;
        this.category = category;
    }

    next(): Promise<EZArtist[]> {
        return new Promise<EZArtist[]>((resolve, reject) => {
            let categories = this.category && this.category.length > 0 ? "&category=" + this.category.join("|") : "";
            this.page ++;
            ZeroPlugin.get(BASE_API_PATH + "artists?context=view&page="+this.page+"&per_page="+this.perPage+"&order=asc"+categories)
            .then((data)=>{
                resolve(EZArtist.array(data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    reset() {
        this.page = 0;
    }

    static get(id: number): Promise<EZArtist> {
        return new Promise<EZArtist>((resolve, reject) =>{
            ZeroPlugin.get(BASE_API_PATH + "artists/"+id+"&_embed=1")
            .then((data)=>{
                resolve(EZArtist.json(data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }
}

export class AccountManager {

    private static instance: AccountManager;

    public static current(): Promise<AccountManager> {
        return new Promise<AccountManager>((resolve, reject) => {
            if(AccountManager.instance){
                resolve(AccountManager.instance);
            } else {
                ZeroPlugin.userInfo().then((user) => {
                    let u = EZUser.json(user);
                    if(u) {
                        AccountManager.instance = new AccountManager(u);
                        resolve(AccountManager.instance);
                    } else {
                        reject(new EZError(500, "Not users found."));
                    }
                }).catch((err) => {
                    Zero.onError(EZError.fromString(err));
                    reject(EZError.fromString(err))
                });
            }
        })
    }

    public static login(grant: string, credentials: string): Promise<AccountManager> {
        return new Promise<AccountManager>((resolve, reject) => {
            ZeroPlugin.login(grant, credentials).then((result: boolean) => {
                if(result) {
                    AccountManager.current().then(am => {
                        Zero.onLogin(am);
                        resolve(am)
                    }).catch((err) => {
                        Zero.onError(EZError.fromString(err));
                        reject(EZError.fromString(err))
                    });
                } else {
                    reject(new EZError(401, "Login Failed."));
                }
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    public static signup(first_name: string, last_name: string, email: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ZeroPlugin.signup(first_name, last_name, email).then(resolve).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

    public static setPassword(key: string, login: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ZeroPlugin.setPassword(key, login, password).then(resolve).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    private user: EZUser;

    constructor(user: EZUser) {
        this.user = user;
    }

    public currentUser(): EZUser {
        return this.user;
    }

    public edit(user: EZUser): AccountManager {
        this.user = user;
        return this;
    }

    public commit(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ZeroPlugin.updateUser(this.user.prepare()).then(resolve).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    public isLogged(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            return ZeroPlugin.checkLogin().then(resolve).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    public editImage(base64: string): Promise<EZImage> {
        let that = this;
        return new Promise<EZImage>((resolve, reject) => {
            ZeroPlugin.post(BASE_API_PATH + 'users/me/profileImage', { data: base64 }).then((res) => {
                let img = EZImage.json(res);
                if(!img)
                    reject(new EZError(500, "Unexpected Response."));
                that.user.profile_image = img;
                resolve(img);
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    public connectToFacebook(token): Promise<void> {
        let that = this;
        return new Promise<void>(function(resolve, reject) {
            ZeroPlugin.post(BASE_API_PATH + 'users/me/facebook', { token: token }).then(function(data) {
                that.user.is_connected_to_facebook = true;
                resolve();
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    public disconnectFromFacebook(): Promise<void> {
        let that = this;
        return new Promise<void>(function(resolve, reject) {
            ZeroPlugin.post(BASE_API_PATH + 'users/me/facebook?_method=DELETE', {}).then((data) => {
                that.user.is_connected_to_facebook = false;
                resolve();
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }


    public logout(): Promise<void> {
        let that = this;
        return new Promise<void>((resolve, reject) => {
            ZeroPlugin.logout().then(() => {
                AccountManager.instance = null;
                that.user = null;
                TriggerManager.current().performLogout();
                resolve();
            }).catch((err) => {
                Zero.onError(err);
                reject(err)
            });
        });
    }

}

export class TriggerManager {

    private static instance: TriggerManager =  null;

    public static current(): TriggerManager {
        if( !TriggerManager.instance )
            TriggerManager.instance = new TriggerManager();
        return TriggerManager.instance;
    }

    private errorTrigger: EZTrigger<EZError>[] = [];
    private loginTrigger: EZTrigger<AccountManager>[] = [];
    private logoutTrigger: EZTrigger<void>[] = [];

    private constructor() {}

    eachError( trigger: EZTrigger<EZError> ) {
        this.errorTrigger.push(trigger);
    }
    eachLogin( trigger: EZTrigger<AccountManager> ) {
        this.loginTrigger.push(trigger);
    }
    eachLogout( trigger: EZTrigger<void> ) {
        this.logoutTrigger.push(trigger);
    }

    remove(id: string) {
        this.errorTrigger = this.errorTrigger.filter((t) => {
            return t.id != id;
        });

        this.loginTrigger = this.loginTrigger.filter((t) => {
            return t.id != id;
        });

        this.logoutTrigger = this.logoutTrigger.filter((t) => {
            return t.id != id;
        });
    }

    clean() {
        this.errorTrigger = [];
        this.loginTrigger = [];
        this.logoutTrigger = [];
    }

    catchError(error: EZError) {
        this.errorTrigger.forEach((trigger) => {
            trigger.trigger(error);
        });
    }

    performLogin(am: AccountManager) {
        this.loginTrigger.forEach((trigger) => {
            trigger.trigger(am);
        });
    }

    performLogout() {
        this.logoutTrigger.forEach((trigger) => {
            trigger.trigger();
        });
    }

}

export class TicketManager {

    private static instance: TicketManager = null;

    public all(): Promise<EZTicket[]> {
        return new Promise<EZTicket[]>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH+"users/me/tickets/").then((data) => {
                resolve(EZTicket.array(data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }
}

export class SearchEngine {

    public static save(search: EZMixin): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ZeroPlugin.saveRecentResearch(search).then(() => {
                resolve();
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            })
        });
    }

    public static recent(): Promise<EZMixin[]> {
        return new Promise<EZMixin[]>((resolve, reject) => {
            ZeroPlugin.recentResearch().then((res) => {
                console.log(res);
                resolve(EZMixin.array(res.map(el => {
                    return JSON.parse(el);
                })).filter((el) => {
                    return el != null && el != {};
                }));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

    public static search(q: string, f: EZType[] = [EZType.Artist, EZType.Venue, EZType.Event]): Promise<EZMixin[]> {
        return new Promise<EZMixin[]>((resolve, reject) => {
            let c = f.join("|");
            let s = encodeURIComponent(q.replace("/", "").replace("\\", "")).replace("%20", "+");
            ZeroPlugin.get(BASE_API_PATH+"search/"+s+"/?types="+c+"&format=object").then((res) => {
                resolve(EZMixin.array(res.data))
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

    public static branded(): Promise<EZBrand[]> {
        return new Promise<EZBrand[]>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH+"app/sponsored/?target=app&format=object").then((res) => {
                resolve(EZBrand.array(res.data))
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }

    public static foryou(): Promise<EZGenericContent[]> {
        return new Promise<EZGenericContent[]>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH+"events/hints/?format=object").then((res) => {
                resolve(EZGenericContent.array(res.data));
            }).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err));
            });
        });
    }
}


export class EZCity {
    readonly name: string;
    readonly slug: string;
    readonly center: { lat: number, lng: number };
    readonly filters: EZFilter[];

    public constructor(name: string, slug: string, center: { lat: number, lng: number }, filters: EZFilter[]) {
        this.name = name;
        this.slug = slug;
        this.center = center;
        this.filters = filters;
        if(!name || !slug || !center) return null;
    }

    public static json(j: any): EZCity {
        return new EZCity(j.name, j.slug, j.coordinates, EZFilter.array(j.filters));
    }

    public static array(arr: any[]) {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let mix = EZCity.json(arr[i]);
            if(mix) ret.push(mix);
        }
        return ret;
    }

}

export class EZFilter {
    readonly filter: string;
    readonly slug: string;
    public selected: boolean = false;

    public constructor(filter: string, slug: string, selected: boolean = false) {
        if(!filter || !slug) return null;
        this.filter = filter;
        this.slug = slug;
        this.selected = selected;
    }

    public static json(j: any): EZFilter {
        return new EZFilter(j.name, j.slug,false);
    }

    public static array(arr: any[]): EZFilter[] {
        let ret = [];
        if(!isArray(arr) || arr.length == 0) return ret;
        for(let i = 0; i < arr.length; i++) {
            let mix = EZFilter.json(arr[i]);
            if(mix) ret.push(mix);
        }
        return ret;
    }
}


export class EZConfiguration {

    readonly maintenanceMode: boolean;
    readonly needsUpdate: boolean;
    readonly cities: EZCity[];

    private constructor(mantenanceMode: boolean = false, needsUpdate: boolean = false, cities: EZCity[] = []) {
        this.maintenanceMode = mantenanceMode;
        this.needsUpdate = needsUpdate;
        this.cities = cities;
    }

    private static instance: EZConfiguration = null;

    public static init(json: any): boolean {
        let maintenanceMode = json.maintenance_mode;
        let needsUpdate = json.needs_update;
        let cities = EZCity.array(json.metro_areas);
        EZConfiguration.instance = new EZConfiguration(maintenanceMode, needsUpdate, cities);
        return EZConfiguration.instance != null;
    }

    public static current(): EZConfiguration {
        return EZConfiguration.instance;
    }
}


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


export class Zero {

    //TRIGGER
    /*private onLogoutAction;

    private onFirstAccessAction;

    private onLoginAction;

    private onErrorAction;*/

    public static init(clientID: string, clientSecret: string, platform: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ZeroPlugin.init(clientID, clientSecret).then(() => {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', BASE_API_PATH+"app/settings?apikey="+API_KEY+"&app_version="+APP_VERSION+"&platform="+platform);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        if(EZConfiguration.init(JSON.parse(xhr.responseText))) {
                            return resolve();
                        } else {
                            return reject(new EZError(503, "Unexpected Response"));
                        }
                    }
                    else {
                        return reject(new EZError(xhr.status, "FATAL_ERROR"));
                    }
                };
                xhr.send();
            }).catch(reject);
        })
    }

    public static registerLoginAction(action: EZTrigger<AccountManager>) {
        TriggerManager.current().eachLogin(action);
    }

    public static registerErrorAction(action: EZTrigger<EZError>) {
        TriggerManager.current().eachError(action);
    }

    public static registerLogoutAction(action: EZTrigger<void>) {
        TriggerManager.current().eachLogout(action);
    }

    public static onError(e: EZError) {
        TriggerManager.current().catchError(e);
    }

    public static onLogin(account: AccountManager) {
        TriggerManager.current().performLogin(account);
    }

    public static onLogout() {
        TriggerManager.current().performLogout();
    }

    public static openSupportTicket(subject: string, message: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ZeroPlugin.post(BASE_API_PATH + "support/issue", { subject: subject, message: message }).then(resolve).catch((err) => {
                Zero.onError(EZError.fromString(err));
                reject(EZError.fromString(err))
            });
        });
    }

    //SEARCH
    /*search = function(q: string): Promise<SearchResult> {
        return new Promise<SearchResult>((resolve, reject) => {
            ZeroPlugin.get(BASE_API_PATH + "search/?q=" + encodeURIComponent(q))
            .then((data) => {
                resolve({
                    events: data["events"].map((el, index) => {
                            return ZeroClass.parseEvent(el);
                        }),
                    venues: data["venues"].map((el, index) => {
                            return ZeroClass.parseVenue(el);
                        }),
                    artists: data["artists"].map((el, index) => {
                            return ZeroClass.parseArtist(el);
                        })
                });
            }).catch(reject);
        });
    }*/

    //CONFIG
    /*config = {
        onLogout: function(action) {
            this.onLogoutAction = action;
            ZeroPlugin.onLogoutAction = action;
        },

        onLogin: function(action) {
            this.onLoginAction = action;
            ZeroPlugin.onLoginAction = action;
        },

        onFirstAccess: function(action) {
            this.onFirstAccessAction = action;
            ZeroPlugin.onFirstAccessAction = action;
        },

        onError: function(action) {
            this.onErrorAction = action;
            ZeroPlugin.onErrorAction = action;
        }
    }

    call = {
        onError: function(code, message) {
            if(this.onErrorAction) {
                this.onErrorAction(code, message);
            } else if(ZeroPlugin.onErrorAction) {
                ZeroPlugin.onErrorAction(code, message);
            }
        }
    }*/

    //USER
    /*user = {

        create: function(first_name: string, last_name: string, email: string){
            return new Promise<void>((resolve, reject) => {
                return ZeroPlugin.signup(first_name, last_name, email).then(resolve).catch(reject);
            });
        },

        setPassword: function(key: string, login: string, password: string){
            return new Promise<void>((resolve, reject) => {
                return ZeroPlugin.setPassword(key, login, password).then(resolve).catch(reject);
            });
        },
        
        isLogged: function(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                return ZeroPlugin.checkLogin().then(resolve).catch(reject);
            });
        },

        info: function(): Promise<UserInfo> {
            return new Promise<UserInfo>(function(resolve, reject) {
                ZeroPlugin.userInfo().then(resolve).catch(reject);
            });
        },

        update: function(user: UserInfo): Promise<void> {
            return new Promise<void>(function(resolve, reject) {
                ZeroPlugin.updateUser(user).then(resolve).catch(reject);
            });
        },

        setProfileImage: function(base64): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                ZeroPlugin.post(BASE_API_PATH + 'users/me/profileImage', { data: base64 }).then(function(res) {
                    resolve(res.file);
                }).catch(reject);
            });
        },

        login: function(grant: string, credential: string): Promise<boolean> {
            return new Promise<boolean>(function(resolve, reject) {
                ZeroPlugin.login(grant, credential).then(function(result: boolean) {
                    if(result) {
                        resolve(true);
                    } else {
                        reject("Error");
                    }
                }).catch(function(error) {
                    reject(error);
                });
            });
        },

        logout: function(): Promise<void> {
            return new Promise<void>(function(resolve, reject) {
                ZeroPlugin.logout().then(function() {
                    resolve();
                }).catch(function(error) {
                    reject(error);
                });
            });
        },

        connectToFacebook: function(token): Promise<void> {
            return new Promise<void>(function(resolve, reject) {
                ZeroPlugin.post(BASE_API_PATH + 'users/me/facebook', { token: token }).then(function(data) {
                    resolve();
                }).catch(function(error) {
                    reject(error);
                });
            });
        },

        disconnectFromFacebook: function(): Promise<void> {
            return new Promise<void>(function(resolve, reject) {
                ZeroPlugin.post(BASE_API_PATH + 'users/me/facebook?_method=DELETE', {}).then(function(data) {
                    resolve();
                }).catch(function(error) {
                    reject(error);
                });
            });
        }
    }*/

    //SUPPORT
    /*support = {
        send: function(subject, message) {
            return new Promise<void>((resolve, reject) => {
                ZeroPlugin.post(BASE_API_PATH + "support/", { subject: subject, message: message }).then(resolve).catch(reject);
            });
        }
    }*/

    //EVENTS
    /*events = {

        all: function(page: number = 1, city: string = "milano", startDate: Date = new Date()): Promise<any> {
            return new Promise<any>(function(resolve, reject) {
                let dateString = startDate.getFullYear().toString()+"-"+startDate.getMonth().toString()+"-"+startDate.getDay().toString();
                ZeroPlugin.get(BASE_API_PATH + "events/tree?context=view&page=1&per_page=30&start_date=2017-05-29&metro_area=milano&coords=lat%3A23%2Clng%3A45&order=asc")
                .then((data)=>{
                    resolve(data);
                }).catch(reject);
            });
        },

        byId: function(id: string): Promise<EventInterface> {
            return new Promise<EventInterface>((resolve, reject)=>{
                ZeroPlugin.get(BASE_API_PATH + "events/"+id)
                .then((el)=>{
                    resolve(ZeroClass.parseEvent(el));
                }).catch(reject);
            });
        },

        search: function(q: string): Promise<EventInterface[]> {
            return new Promise<EventInterface[]>((resolve, reject)=>{
                ZeroPlugin.get(BASE_API_PATH + "events/search/?q="+encodeURIComponent(q))
                .then((data)=>{
                    resolve(data.map((el, index)=>{
                        return ZeroClass.parseEvent(el);
                    }));
                }).catch(reject);
            });
        },

        prices: function(e: EventInterface): Promise<Sector[]> {
            return new Promise<Sector[]>((resolve, reject) => {
                ZeroPlugin.get(BASE_API_PATH + "events/" + e.id + "/prices")
                .then((data) => {
                    return data.map((el, index) => {
                        return {
                            id: el["id"],
                            description: el["description"],
                            prices: el["rates"].map((p, index) => {
                                return {
                                    id: p["id"],
                                    description: p["description"],
                                    availability: p["availability"],
                                    net: p["price"],
                                    presale: p["presale"],
                                    commission: p["commission"]
                                }
                            }) as Price[]
                        }
                    }) as Sector[];
                }).catch(reject);
            });
        },

        purchase: function(e: EventInterface, sector: Sector, price: Price, quantity: number): Promise<Ticket[]> {
            return new Promise<Ticket[]>((resolve, reject) => {
                ZeroPlugin.get(BASE_API_PATH + "payments/token").then((data) => {
                    let token = data["token"];
                    if(token != null && token != "") {
                        BraintreePlugin.initialize(
                            token, 
                            () => {
                                var options = {
                                    amount: quantity * (price.net + price.presale + price.commission),
                                    primaryDescription: e.title + " @ " + e.venue.name + " - " + e.info.startTime.toDateString
                                };
                                BraintreePlugin.presentDropInPaymentUI(options, function (result) {
                                    if (result.userCancelled) {
                                        reject(new Error("User cancel payment"));
                                    }
                                    else if(result.nonce != null && result.nonce != "") {
                                        ZeroPlugin.post(BASE_API_PATH + "payments/checkout", { event: e.id, sector: sector.id, price: price.id, quantity: quantity, payment_nonce: result.nonce, amount: options.amount })
                                        .then((response) => {
                                            alert(JSON.stringify(response));
                                            let status = response["isSuccess"];
                                            if(status) {
                                                resolve(response["tickets"].map((t, index) => {
                                                    return ZeroClass.parseTicket(t);
                                                }) as Ticket[]);

                                            } else {
                                                reject(new Error(response["error"]));
                                            }
                                        }).catch(reject);
                                    }
                                });
                            },
                            reject
                        );
                    } else {
                        reject(new Error("ERROR: invalid token for payment"));
                    }
                }).catch(reject);
            });
        }
        
    }*/

    //VENUE
    /*venues = {
        
        all: function(page: number): Promise<Venue[]> {
            return new Promise<Venue[]>((resolve, reject)=>{
                ZeroPlugin.get(BASE_API_PATH + "venues/?page="+page)
                .then((data)=>{
                    resolve(data.map((el, index)=>{
                        return ZeroClass.parseVenue(el);
                    }));
                }).catch(reject);
            });
        },

        byId: function(id: string): Promise<Venue> {
            return new Promise<Venue>((resolve, reject)=>{
                ZeroPlugin.get(BASE_API_PATH + "venues/"+id)
                .then((el)=>{
                    resolve(ZeroClass.parseVenue(el));
                }).catch(reject);
            });
        },

        search: function(q: string): Promise<Venue[]> {
            return new Promise<Venue[]>((resolve, reject)=>{
                ZeroPlugin.get(BASE_API_PATH + "venues/?q="+q)
                .then((data)=>{
                    resolve(data.map((el, index)=>{
                        return ZeroClass.parseVenue(el);
                    }));
                }).catch(reject);
            });
        }


    }*/

    //TICKET
    /*tickets = {
        all: function(): Promise<Ticket[]> {
            return new Promise<Ticket[]>((resolve, reject) => {
                ZeroPlugin.get(BASE_API_PATH + "tickets/").then((data) => {
                    resolve(data.map((el, index) => {
                        return ZeroClass.parseTicket(el);
                    }) as Ticket[]);
                }).catch(reject);
            });
        }
    }*/

    //ARTIST
    /*artists = {
        search: function(q: string): Promise<Artist[]> {
            return new Promise<Artist[]>((resolve, reject) => {
                ZeroPlugin.get(BASE_API_PATH + "artists/?q="+encodeURIComponent(q)).then((data) => {
                    resolve(data.map((el, index) => {
                        return ZeroClass.parseArtist(el);
                    }) as Artist[]);
                }).catch(reject);
            });
        },

        byId: function(id: string): Promise<Artist> {
            return new Promise<Artist>((resolve, reject) => {
                ZeroPlugin.get(BASE_API_PATH + "artists/" + id).then((el) => {
                    resolve(ZeroClass.parseArtist(el));
                }).catch(reject);
            });
        }
    }*/

    //ACTIVITY
    /*activity = {
        all: function(): Promise<Activity[]> {
            return new Promise<Activity[]>(function(resolve, reject) {
                ZeroPlugin.get(BASE_API_PATH + "activity/").then(function(data: any) {
                    resolve(data.map(function(el, index) {
                        return {
                            type: el["type"],
                            subtype: el["subtype"],
                            target: {
                                id: el["targetID"],
                                title: el["targetTitle"],
                                image: el["targetImage"]
                            } as ElementSummary
                        } as Activity;
                    }));
                }).catch((error)=>{
                    reject(error);
                }
                );
            });
        },

        insert: function(el: Activity): Promise<any> {
            return new Promise<any>(function(resolve, reject) {
                ZeroPlugin.post(BASE_API_PATH + "activity/", {type: el.type, subtype: el.subtype, targetID: el.target.id}).then(function(result: any[]) {
                    alert(JSON.stringify(result));
                    if(result["success"] as boolean) {
                        resolve(null);
                    } else {
                        reject("An error has occurred");
                    }
                }).catch(reject);
            });
        }
    };*/

}


