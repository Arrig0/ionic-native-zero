"use strict";
exports.__esModule = true;
var media_1 = require("@ionic-native/media");
var BASE_API_PATH = "http://192.168.60.113/api/v2/";
var Track = (function () {
    function Track(url) {
        this.isPlaying = false;
        this.play = function () {
            var o = this;
            this.media = new media_1.Media().create(this.url);
            return new Promise(function (resolve, reject) {
                o.media.onStatusUpdate.subscribe(function (status) {
                    if (status == 2)
                        resolve();
                });
                o.media.onError.subscribe(function (error) {
                    o.media.release();
                    reject(error);
                });
                o.media.play();
                o.isPlaying = true;
            });
        };
        this.stop = function () {
            var o = this;
            return new Promise(function (resolve, reject) {
                o.media.onStatusUpdate.subscribe(function (status) {
                    if (status == 4) {
                        o.media.release();
                        o.isPlaying = false;
                        resolve();
                    }
                });
                o.media.onError.subscribe(function (error) {
                    reject(error);
                });
                o.media.stop();
                o.isPlaying = false;
            });
        };
        this.toggle = function () {
            if (this.isPlaying) {
                return this.stop();
            }
            else {
                return this.play();
            }
        };
        this.url = url;
    }
    return Track;
}());
exports.Track = Track;
var ZeroClass = (function () {
    function ZeroClass() {
        this.init = function (clientID, clientSecret) {
            return ZeroPlugin.init(clientID, clientSecret);
        };
        this.search = function (q) {
            return new Promise(function (resolve, reject) {
                ZeroPlugin.get(BASE_API_PATH + "search/?q=" + encodeURIComponent(q))
                    .then(function (data) {
                    resolve({
                        events: data["events"].map(function (el, index) {
                            return ZeroClass.parseEvent(el);
                        }),
                        venues: data["venues"].map(function (el, index) {
                            return ZeroClass.parseVenue(el);
                        }),
                        artists: data["artists"].map(function (el, index) {
                            return ZeroClass.parseArtist(el);
                        })
                    });
                })["catch"](reject);
            });
        };
        this.config = {
            onLogout: function (action) {
                this.onLogoutAction = action;
                ZeroPlugin.onLogoutAction = action;
            },
            onLogin: function (action) {
                this.onLoginAction = action;
                ZeroPlugin.onLoginAction = action;
            },
            onFirstAccess: function (action) {
                this.onFirstAccessAction = action;
                ZeroPlugin.onFirstAccessAction = action;
            },
            onError: function (action) {
                this.onErrorAction = action;
                ZeroPlugin.onErrorAction = action;
            }
        };
        this.call = {
            onError: function (code, message) {
                if (this.onErrorAction) {
                    this.onErrorAction(code, message);
                }
                else if (ZeroPlugin.onErrorAction) {
                    ZeroPlugin.onErrorAction(code, message);
                }
            }
        };
        this.user = {
            create: function (first_name, last_name, email) {
                return new Promise(function (resolve, reject) {
                    return ZeroPlugin.signup(first_name, last_name, email).then(resolve)["catch"](reject);
                });
            },
            setPassword: function (key, login, password) {
                return new Promise(function (resolve, reject) {
                    return ZeroPlugin.setPassword(key, login, password).then(resolve)["catch"](reject);
                });
            },
            isLogged: function () {
                return new Promise(function (resolve, reject) {
                    return ZeroPlugin.checkLogin().then(resolve)["catch"](reject);
                });
            },
            info: function () {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.userInfo().then(resolve)["catch"](reject);
                });
            },
            update: function (user) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.updateUser(user).then(resolve)["catch"](reject);
                });
            },
            setProfileImage: function (base64) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.post(BASE_API_PATH + 'users/me/profileImage', { data: base64 }).then(function (res) {
                        resolve(res.file);
                    })["catch"](reject);
                });
            },
            login: function (grant, credential) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.login(grant, credential).then(function (result) {
                        if (result) {
                            resolve(true);
                        }
                        else {
                            reject("Error");
                        }
                    })["catch"](function (error) {
                        reject(error);
                    });
                });
            },
            logout: function () {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.logout().then(function () {
                        resolve();
                    })["catch"](function (error) {
                        reject(error);
                    });
                });
            },
            connectToFacebook: function (token) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.post(BASE_API_PATH + 'users/me/facebook', { token: token }).then(function (data) {
                        resolve();
                    })["catch"](function (error) {
                        reject(error);
                    });
                });
            },
            disconnectFromFacebook: function () {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.post(BASE_API_PATH + 'users/me/facebook?_method=DELETE').then(function (data) {
                        resolve();
                    })["catch"](function (error) {
                        reject(error);
                    });
                });
            }
        };
        this.support = {
            send: function (subject, message) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.post(BASE_API_PATH + "support/", { subject: subject, message: message }).then(resolve)["catch"](reject);
                });
            }
        };
        this.events = {
            all: function (page, city) {
                if (page === void 0) { page = 0; }
                if (city === void 0) { city = "milano"; }
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "events/?city=" + city + "&page=" + page)
                        .then(function (data) {
                        resolve(data);
                    })["catch"](reject);
                });
            },
            byId: function (id) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "events/" + id)
                        .then(function (el) {
                        resolve(ZeroClass.parseEvent(el));
                    })["catch"](reject);
                });
            },
            search: function (q) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "events/search/?q=" + encodeURIComponent(q))
                        .then(function (data) {
                        resolve(data.map(function (el, index) {
                            return ZeroClass.parseEvent(el);
                        }));
                    })["catch"](reject);
                });
            },
            prices: function (e) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "events/" + e.id + "/prices")
                        .then(function (data) {
                        return data.map(function (el, index) {
                            return {
                                id: el["id"],
                                description: el["description"],
                                prices: el["rates"].map(function (p, index) {
                                    return {
                                        id: p["id"],
                                        description: p["description"],
                                        availability: p["availability"],
                                        net: p["price"],
                                        presale: p["presale"],
                                        commission: p["commission"]
                                    };
                                })
                            };
                        });
                    })["catch"](reject);
                });
            },
            purchase: function (e, sector, price, quantity) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "payments/token").then(function (data) {
                        var token = data["token"];
                        if (token != null && token != "") {
                            BraintreePlugin.initialize(token, function () {
                                var options = {
                                    amount: quantity * (price.net + price.presale + price.commission),
                                    primaryDescription: e.title + " @ " + e.venue.name + " - " + e.info.startTime.toDateString
                                };
                                BraintreePlugin.presentDropInPaymentUI(options, function (result) {
                                    if (result.userCancelled) {
                                        reject(new Error("User cancel payment"));
                                    }
                                    else if (result.nonce != null && result.nonce != "") {
                                        ZeroPlugin.post(BASE_API_PATH + "payments/checkout", { event: e.id, sector: sector.id, price: price.id, quantity: quantity, payment_nonce: result.nonce, amount: options.amount })
                                            .then(function (response) {
                                            alert(JSON.stringify(response));
                                            var status = response["isSuccess"];
                                            if (status) {
                                                resolve(response["tickets"].map(function (t, index) {
                                                    return ZeroClass.parseTicket(t);
                                                }));
                                            }
                                            else {
                                                reject(new Error(response["error"]));
                                            }
                                        })["catch"](reject);
                                    }
                                });
                            }, reject);
                        }
                        else {
                            reject(new Error("ERROR: invalid token for payment"));
                        }
                    })["catch"](reject);
                });
            }
        };
        this.venues = {
            all: function (page) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "venues/?page=" + page)
                        .then(function (data) {
                        resolve(data.map(function (el, index) {
                            return ZeroClass.parseVenue(el);
                        }));
                    })["catch"](reject);
                });
            },
            byId: function (id) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "venues/" + id)
                        .then(function (el) {
                        resolve(ZeroClass.parseVenue(el));
                    })["catch"](reject);
                });
            },
            search: function (q) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "venues/?q=" + q)
                        .then(function (data) {
                        resolve(data.map(function (el, index) {
                            return ZeroClass.parseVenue(el);
                        }));
                    })["catch"](reject);
                });
            }
        };
        this.tickets = {
            all: function () {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "tickets/").then(function (data) {
                        resolve(data.map(function (el, index) {
                            return ZeroClass.parseTicket(el);
                        }));
                    })["catch"](reject);
                });
            }
        };
        this.artists = {
            search: function (q) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "artists/?q=" + encodeURIComponent(q)).then(function (data) {
                        resolve(data.map(function (el, index) {
                            return ZeroClass.parseArtist(el);
                        }));
                    })["catch"](reject);
                });
            },
            byId: function (id) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "artists/" + id).then(function (el) {
                        resolve(ZeroClass.parseArtist(el));
                    })["catch"](reject);
                });
            }
        };
        this.activity = {
            all: function () {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.get(BASE_API_PATH + "activity/").then(function (data) {
                        resolve(data.map(function (el, index) {
                            return {
                                type: el["type"],
                                subtype: el["subtype"],
                                target: {
                                    id: el["targetID"],
                                    title: el["targetTitle"],
                                    image: el["targetImage"]
                                }
                            };
                        }));
                    })["catch"](function (error) {
                        reject(error);
                    });
                });
            },
            insert: function (el) {
                return new Promise(function (resolve, reject) {
                    ZeroPlugin.post(BASE_API_PATH + "activity/", { type: el.type, subtype: el.subtype, targetID: el.target.id }).then(function (result) {
                        alert(JSON.stringify(result));
                        if (result["success"]) {
                            resolve(null);
                        }
                        else {
                            reject("An error has occurred");
                        }
                    })["catch"](reject);
                });
            }
        };
    }
    ZeroClass.shared = function () {
        if (ZeroClass.instance == null) {
            ZeroClass.instance = new ZeroClass();
        }
        return ZeroClass.instance;
    };
    ZeroClass.parseEvent = function (el) {
        return {
            id: el["id"],
            title: el["title"],
            image: el["image"],
            venue: ZeroClass.parseVenue(el["venue"]),
            info: {
                startTime: new Date(el["info"]["startDate"]),
                endTime: new Date(el["info"]["endDate"]),
                days: el["info"]["days"]
            },
            isOnSale: el["isOnSale"]
        };
    };
    ZeroClass.parseVenue = function (el) {
        return {
            id: el["id"],
            name: el["name"],
            position: {
                coords: {
                    lat: el["position"]["coords"]["lat"],
                    lng: el["position"]["coords"]["lng"]
                }
            },
            image: el["image"],
            url: el["url"]
        };
    };
    ZeroClass.parseArtist = function (data) {
        return {
            id: data["id"],
            name: data["name"],
            image: data["image"],
            topTrack: new Track(data["topTrack"]) // #ALEWARNING: settare le callback;
        };
    };
    ZeroClass.parseTicket = function (data) {
        // #ALEWARNING: qui ovviamente va mappato il tiket di risposta;
        return {
            title: data["title"],
            price: data["prezzo"]
        };
    };
    ZeroClass.instance = null;
    return ZeroClass;
}());
exports.ZeroClass = ZeroClass;
var Zero = ZeroClass.shared();
exports.Zero = Zero;
//# sourceMappingURL=index.js.map