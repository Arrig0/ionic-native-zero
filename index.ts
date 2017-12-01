import { Media, MediaObject } from '@ionic-native/media';
import {isArray} from "rxjs/util/isArray";
import {stringify} from "@angular/core/src/util";

declare var ZeroPlugin: any;
declare var BraintreePlugin;

const BASE_API_PATH: string = "http://192.168.60.113/api/v2/";
//const BASE_API_PATH: string = "https://dev.zero.eu/API/v1/";

export interface ZeroEntity {}

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
}

export class EZEvent {
    private id: number;
    private name: string;
    private isRegular: boolean = false;
    private startDate: Date;
    private endDate: Date;
    private startTime: Date | null;
    private endTime: Date | null;
    private price: EZPrice | null;
    private excerpt: string | null;
    private category: string[];
    private featured_image: EZImage | null;
    private gallery: EZImage[];
    private artists: EZArtist[];
    private venue: EZVenue | null;

    constructor(id: number, name: string, startDate: Date, endDate: Date, startTime: Date | null, endTime: Date | null, isRegular: boolean = false, price: EZPrice | null, excerpt: string, category: string[] = [], featured_image: EZImage | null, gallery: EZImage[] = [], venue: EZVenue | null, artists: EZArtist[] = []) {
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

    static json(jsonEvent: any): EZEvent | null {
        let id = jsonEvent.id;
        let name = jsonEvent.name.plain;
        let isRegular = jsonEvent.is_regular ? jsonEvent.is_regular : false;
        let startDate = jsonEvent.start_date ? new Date(jsonEvent.start_date) : null;
        let endDate = jsonEvent.end_date ? new Date(jsonEvent.end_date) : null;
        let startTime = jsonEvent.start_time ? new Date(jsonEvent.start_time) : null;
        let endTime = jsonEvent.end_time ? new Date(jsonEvent.end_date) : null;
        let price = EZPrice.json(jsonEvent.price);
        let excerpt = jsonEvent.excerpt && jsonEvent.excerpt.hasOwnProperty("plain") ? jsonEvent.excerpt.plain : null;
        let category = isArray(jsonEvent.category) ? jsonEvent.category : [];
        let featured_image = EZImage.json(jsonEvent.featured_image);
        let gallery = EZImage.array(jsonEvent.gallery);
        let artists = EZArtist.array(jsonEvent.artists);
        let venue = EZVenue.json(jsonEvent.venue);

        if( !id || !name || !startDate || !venue ) return null;

        return new EZEvent(id, name, startDate, endDate, startTime, endTime, isRegular, price, excerpt, category, featured_image, gallery, venue, artists);
    }
}

export class EZVenue {
    private id: number;
    private name: string;
    private featured_image: EZImage | null;
    private gallery: EZImage[] = [];
    private phone: string | null;
    private website: string | null
    private rate: number | null;
    private address: string | null;
    private coords: { lat: number, lng: number } | null;
    private category: string[] = [];
    private excerpt: string | null;
    private openingHours: EZDictionary[] | null;
    private priceLevel: number | null;

    constructor(id: number, name: string, featured_image: EZImage | null, gallery: EZImage[] = [], phone: string | null, website: string | null, rate: number | null, address: string | null, coords: { lat: number, lng: number } | null, category: string[] = [], excerpt: string | null, openingHours: EZDictionary[] | null, priceLevel: number | null) {
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

        if( !id || !name ) return null;
    }

    static json(): EZVenue | null {
        //todo:: finire il json!!
        return null;
    }

    //todo:: make function static array();

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
        let thumb = jsonImage.thumbnail;
        let standard = jsonImage.standard;
        let large = jsonImage.large;
        if(thumb || standard || large) {
            return new EZImage(thumb, standard, large);
        }
        return null;
    }

    static array(jsonArray: any[]): EZImage[] {
        let ret = [];
        if(!isArray(jsonArray) || jsonArray.length == 0) return ret;
        for(let i = 0; i < jsonArray.length; i++) {
            let img = EZImage.json(jsonArray[0]);
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
    private id: number;
    private name: string;
    private featured_image: EZImage | null;
    private gallery: EZImage[];
    private preview: EZSoundTrack | null;
    private category: string[];
    private excerpt: string | null;

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
        let name = jsonArtist.name;
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
            let img = EZArtist.json(jsonArray[0]);
            if(img) ret.push(img);
        }
        return ret;
    }

}

export class EZSoundTrack {

    private url: string;
    private isPlaying: boolean = false;

    constructor(url: string) {
        if(!url) return null;
        this.url = url;
    }
    // todo:: play and stop;
}

export class EZPrice {
    private display: string;

    constructor(display: string) {
        this.display = display;
    }

    static json(jsonPrice: any): EZPrice | null {
        let display = "";
        if(typeof jsonPrice == "string") {
            display = jsonPrice;
        } else if(jsonPrice.hasOwnProperty("price")) {
            display = jsonPrice.price;
        } else {
            return null;
        }
        return new EZPrice(display);
    }
}

export interface EZDictionary {
    name: string;
    value: any;
}

export class EventManager {
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

    next(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let dates = this.date.getFullYear().toString()+"-"+this.date.getMonth().toString()+"-"+this.date.getDay().toString();
            let categories = this.category && this.category.length > 0 ? "&category=" + this.category.join("|") : "";
            let coords = this.coords ? "&coords[lat]="+this.coords.lat+"&coords[lng]="+this.coords.lng : "";
            this.page ++;
            ZeroPlugin.get(BASE_API_PATH + "events/tree?context=view&page="+this.page+"&per_page="+this.perPage+"&start_date="+dates+"&metro_area="+this.city+"&order=asc"+coords+categories)
            .then((data)=>{
                resolve(data);
            }).catch(reject);
        });
    }

    reset() {
        this.page = 0;
    }
}


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


export class ZeroClass {

    private static instance: ZeroClass = null;

    private onLogoutAction;

    private onFirstAccessAction;

    private onLoginAction;

    private onErrorAction;

    static shared() {
        if(ZeroClass.instance == null) {
            ZeroClass.instance = new ZeroClass();
        }
        return ZeroClass.instance;
    }

    init = function(clientID: string, clientSecret: string): Promise<boolean> {
        return ZeroPlugin.init(clientID, clientSecret);
    }

    search = function(q: string): Promise<SearchResult> {
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
    }

    config = {
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
    }

    user = {

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
    }

    support = {
        send: function(subject, message) {
            return new Promise<void>((resolve, reject) => {
                ZeroPlugin.post(BASE_API_PATH + "support/", { subject: subject, message: message }).then(resolve).catch(reject);
            });
        }
    }
    
    events = {

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
        
    }

    venues = {
        
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


    }


    tickets = {
        all: function(): Promise<Ticket[]> {
            return new Promise<Ticket[]>((resolve, reject) => {
                ZeroPlugin.get(BASE_API_PATH + "tickets/").then((data) => {
                    resolve(data.map((el, index) => {
                        return ZeroClass.parseTicket(el);
                    }) as Ticket[]);
                }).catch(reject);
            });
        }
    }

    artists = {
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
    }


    activity = {
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
    };

    static parseEvent(el): EventInterface{
        return {
            id: el["id"],
            title: el["title"],
            image: el["image"],
            venue: ZeroClass.parseVenue(el["venue"]),
            info: {
                startTime: new Date(el["info"]["startDate"]),
                endTime: new Date(el["info"]["endDate"]),
                days: el["info"]["days"],
            } as EventInfo,
            isOnSale: el["isOnSale"]
        } as EventInterface;
    }

    static parseVenue(el): Venue{
        return {
            id: el["id"],
            name: el["name"],
            position: {
                coords: {
                    lat: el["position"]["coords"]["lat"],
                    lng: el["position"]["coords"]["lng"]
                }
            } as Geoposition,
            image: el["image"],
            url: el["url"]
        } as Venue;
    }

    static parseArtist(data): Artist{
        return {
            id: data["id"],
            name: data["name"],
            image: data["image"],
            topTrack: new Track(data["topTrack"]) // #ALEWARNING: settare le callback;
        };
    }

    static parseTicket(data): Ticket {
        // #ALEWARNING: qui ovviamente va mappato il tiket di risposta;
        return {
            title: data["title"],
            price: data["prezzo"]
        };
    }

}

let Zero = ZeroClass.shared();
export { Zero };


