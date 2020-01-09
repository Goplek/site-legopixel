import {ui} from "./ui";
import {latte} from "./latte";

export namespace linearicon{

    import IconItem = ui.IconItem;
    import DidSet = latte.DidSet;

    export class LinearIcon extends IconItem{

        //region Static


        /**
         * Creates the icon of the specified class name
         * @param className
         */
        private static makeFrom(className: string): LinearIcon{
            return new LinearIcon(className);

        }

        /**
         * Creates the icon of the specified class name
         * @param className
         */
        private static makeFrom32(className: string): LinearIcon{
            return new LinearIcon(className, 32);

        }

        static get home                (): LinearIcon{ return this.makeFrom("home");                     }
        static get apartment           (): LinearIcon{ return this.makeFrom("apartment");                }
        static get pencil              (): LinearIcon{ return this.makeFrom("pencil");                   }
        static get magicWand           (): LinearIcon{ return this.makeFrom("magic-wand");               }
        static get drop                (): LinearIcon{ return this.makeFrom("drop");                     }
        static get lighter             (): LinearIcon{ return this.makeFrom("lighter");                  }
        static get poop                (): LinearIcon{ return this.makeFrom("poop");                     }
        static get sun                 (): LinearIcon{ return this.makeFrom("sun");                      }
        static get moon                (): LinearIcon{ return this.makeFrom("moon");                     }
        static get cloud               (): LinearIcon{ return this.makeFrom("cloud");                    }
        static get cloudUpload         (): LinearIcon{ return this.makeFrom("cloud-upload");             }
        static get cloudDownload       (): LinearIcon{ return this.makeFrom("cloud-download");           }
        static get cloudSync           (): LinearIcon{ return this.makeFrom("cloud-sync");               }
        static get cloudCheck          (): LinearIcon{ return this.makeFrom("cloud-check");              }
        static get database            (): LinearIcon{ return this.makeFrom("database");                 }
        static get lock                (): LinearIcon{ return this.makeFrom("lock");                     }
        static get cog                 (): LinearIcon{ return this.makeFrom("cog");                      }
        static get trash               (): LinearIcon{ return this.makeFrom("trash");                    }
        static get dice                (): LinearIcon{ return this.makeFrom("dice");                     }
        static get heart               (): LinearIcon{ return this.makeFrom("heart");                    }
        static get star                (): LinearIcon{ return this.makeFrom("star");                     }
        static get starHalf            (): LinearIcon{ return this.makeFrom("star-half");                }
        static get starEmpty           (): LinearIcon{ return this.makeFrom("star-empty");               }
        static get flag                (): LinearIcon{ return this.makeFrom("flag");                     }
        static get envelope            (): LinearIcon{ return this.makeFrom("envelope");                 }
        static get paperclip           (): LinearIcon{ return this.makeFrom("paperclip");                }
        static get inbox               (): LinearIcon{ return this.makeFrom("inbox");                    }
        static get eye                 (): LinearIcon{ return this.makeFrom("eye");                      }
        static get printer             (): LinearIcon{ return this.makeFrom("printer");                  }
        static get fileEmpty           (): LinearIcon{ return this.makeFrom("file-empty");               }
        static get fileAdd             (): LinearIcon{ return this.makeFrom("file-add");                 }
        static get enter               (): LinearIcon{ return this.makeFrom("enter");                    }
        static get exit                (): LinearIcon{ return this.makeFrom("exit");                     }
        static get graduationHat       (): LinearIcon{ return this.makeFrom("graduation-hat");           }
        static get license             (): LinearIcon{ return this.makeFrom("license");                  }
        static get musicNote           (): LinearIcon{ return this.makeFrom("music-note");               }
        static get filmPlay            (): LinearIcon{ return this.makeFrom("film-play");                }
        static get cameraVideo         (): LinearIcon{ return this.makeFrom("camera-video");             }
        static get camera              (): LinearIcon{ return this.makeFrom("camera");                   }
        static get picture             (): LinearIcon{ return this.makeFrom("picture");                  }
        static get book                (): LinearIcon{ return this.makeFrom("book");                     }
        static get bookmark            (): LinearIcon{ return this.makeFrom("bookmark");                 }
        static get user                (): LinearIcon{ return this.makeFrom("user");                     }
        static get users               (): LinearIcon{ return this.makeFrom("users");                    }
        static get shirt               (): LinearIcon{ return this.makeFrom("shirt");                    }
        static get store               (): LinearIcon{ return this.makeFrom("store");                    }
        static get cart                (): LinearIcon{ return this.makeFrom("cart");                     }
        static get tag                 (): LinearIcon{ return this.makeFrom("tag");                      }
        static get phoneHandset        (): LinearIcon{ return this.makeFrom("phone-handset");            }
        static get phone               (): LinearIcon{ return this.makeFrom("phone");                    }
        static get pushpin             (): LinearIcon{ return this.makeFrom("pushpin");                  }
        static get mapMarker           (): LinearIcon{ return this.makeFrom("map-marker");               }
        static get map                 (): LinearIcon{ return this.makeFrom("map");                      }
        static get location            (): LinearIcon{ return this.makeFrom("location");                 }
        static get calendarFull        (): LinearIcon{ return this.makeFrom("calendar-full");            }
        static get keyboard            (): LinearIcon{ return this.makeFrom("keyboard");                 }
        static get spellCheck          (): LinearIcon{ return this.makeFrom("spell-check");              }
        static get screen              (): LinearIcon{ return this.makeFrom("screen");                   }
        static get smartphone          (): LinearIcon{ return this.makeFrom("smartphone");               }
        static get tablet              (): LinearIcon{ return this.makeFrom("tablet");                   }
        static get laptop              (): LinearIcon{ return this.makeFrom("laptop");                   }
        static get laptopPhone         (): LinearIcon{ return this.makeFrom("laptop-phone");             }
        static get powerSwitch         (): LinearIcon{ return this.makeFrom("power-switch");             }
        static get bubble              (): LinearIcon{ return this.makeFrom("bubble");                   }
        static get heartPulse          (): LinearIcon{ return this.makeFrom("heart-pulse");              }
        static get construction        (): LinearIcon{ return this.makeFrom("construction");             }
        static get pieChart            (): LinearIcon{ return this.makeFrom("pie-chart");                }
        static get chartBars           (): LinearIcon{ return this.makeFrom("chart-bars");               }
        static get gift                (): LinearIcon{ return this.makeFrom("gift");                     }
        static get diamond             (): LinearIcon{ return this.makeFrom("diamond");                  }
        static get linearicons         (): LinearIcon{ return this.makeFrom("linearicons");              }
        static get dinner              (): LinearIcon{ return this.makeFrom("dinner");                   }
        static get coffeeCup           (): LinearIcon{ return this.makeFrom("coffee-cup");               }
        static get leaf                (): LinearIcon{ return this.makeFrom("leaf");                     }
        static get paw                 (): LinearIcon{ return this.makeFrom("paw");                      }
        static get rocket              (): LinearIcon{ return this.makeFrom("rocket");                   }
        static get briefcase           (): LinearIcon{ return this.makeFrom("briefcase");                }
        static get bus                 (): LinearIcon{ return this.makeFrom("bus");                      }
        static get car                 (): LinearIcon{ return this.makeFrom("car");                      }
        static get train               (): LinearIcon{ return this.makeFrom("train");                    }
        static get bicycle             (): LinearIcon{ return this.makeFrom("bicycle");                  }
        static get wheelchair          (): LinearIcon{ return this.makeFrom("wheelchair");               }
        static get select              (): LinearIcon{ return this.makeFrom("select");                   }
        static get earth               (): LinearIcon{ return this.makeFrom("earth");                    }
        static get smile               (): LinearIcon{ return this.makeFrom("smile");                    }
        static get sad                 (): LinearIcon{ return this.makeFrom("sad");                      }
        static get neutral             (): LinearIcon{ return this.makeFrom("neutral");                  }
        static get mustache            (): LinearIcon{ return this.makeFrom("mustache");                 }
        static get alarm               (): LinearIcon{ return this.makeFrom("alarm");                    }
        static get bullhorn            (): LinearIcon{ return this.makeFrom("bullhorn");                 }
        static get volumeHigh          (): LinearIcon{ return this.makeFrom("volume-high");              }
        static get volumeMedium        (): LinearIcon{ return this.makeFrom("volume-medium");            }
        static get volumeLow           (): LinearIcon{ return this.makeFrom("volume-low");               }
        static get volume              (): LinearIcon{ return this.makeFrom("volume");                   }
        static get mic                 (): LinearIcon{ return this.makeFrom("mic");                      }
        static get hourglass           (): LinearIcon{ return this.makeFrom("hourglass");                }
        static get undo                (): LinearIcon{ return this.makeFrom("undo");                     }
        static get redo                (): LinearIcon{ return this.makeFrom("redo");                     }
        static get sync                (): LinearIcon{ return this.makeFrom("sync");                     }
        static get history             (): LinearIcon{ return this.makeFrom("history");                  }
        static get clock               (): LinearIcon{ return this.makeFrom("clock");                    }
        static get download            (): LinearIcon{ return this.makeFrom("download");                 }
        static get upload              (): LinearIcon{ return this.makeFrom("upload");                   }
        static get enterDown           (): LinearIcon{ return this.makeFrom("enter-down");               }
        static get exitUp              (): LinearIcon{ return this.makeFrom("exit-up");                  }
        static get bug                 (): LinearIcon{ return this.makeFrom("bug");                      }
        static get code                (): LinearIcon{ return this.makeFrom("code");                     }
        static get link                (): LinearIcon{ return this.makeFrom("link");                     }
        static get unlink              (): LinearIcon{ return this.makeFrom("unlink");                   }
        static get thumbsUp            (): LinearIcon{ return this.makeFrom("thumbs-up");                }
        static get thumbsDown          (): LinearIcon{ return this.makeFrom("thumbs-down");              }
        static get magnifier           (): LinearIcon{ return this.makeFrom("magnifier");                }
        static get cross               (): LinearIcon{ return this.makeFrom("cross");                    }
        static get menu                (): LinearIcon{ return this.makeFrom("menu");                     }
        static get list                (): LinearIcon{ return this.makeFrom("list");                     }
        static get chevronUp           (): LinearIcon{ return this.makeFrom("chevron-up");               }
        static get chevronDown         (): LinearIcon{ return this.makeFrom("chevron-down");             }
        static get chevronLeft         (): LinearIcon{ return this.makeFrom("chevron-left");             }
        static get chevronRight        (): LinearIcon{ return this.makeFrom("chevron-right");            }
        static get arrowUp             (): LinearIcon{ return this.makeFrom("arrow-up");                 }
        static get arrowDown           (): LinearIcon{ return this.makeFrom("arrow-down");               }
        static get arrowLeft           (): LinearIcon{ return this.makeFrom("arrow-left");               }
        static get arrowRight          (): LinearIcon{ return this.makeFrom("arrow-right");              }
        static get move                (): LinearIcon{ return this.makeFrom("move");                     }
        static get warning             (): LinearIcon{ return this.makeFrom("warning");                  }
        static get questionCircle      (): LinearIcon{ return this.makeFrom("question-circle");          }
        static get menuCircle          (): LinearIcon{ return this.makeFrom("menu-circle");              }
        static get checkmarkCircle     (): LinearIcon{ return this.makeFrom("checkmark-circle");         }
        static get crossCircle         (): LinearIcon{ return this.makeFrom("cross-circle");             }
        static get plusCircle          (): LinearIcon{ return this.makeFrom("plus-circle");              }
        static get circleMinus         (): LinearIcon{ return this.makeFrom("circle-minus");             }
        static get arrowUpCircle       (): LinearIcon{ return this.makeFrom("arrow-up-circle");          }
        static get arrowDownCircle     (): LinearIcon{ return this.makeFrom("arrow-down-circle");        }
        static get arrowLeftCircle     (): LinearIcon{ return this.makeFrom("arrow-left-circle");        }
        static get arrowRightCircle    (): LinearIcon{ return this.makeFrom("arrow-right-circle");       }
        static get chevronUpCircle     (): LinearIcon{ return this.makeFrom("chevron-up-circle");        }
        static get chevronDownCircle   (): LinearIcon{ return this.makeFrom("chevron-down-circle");      }
        static get chevronLeftCircle   (): LinearIcon{ return this.makeFrom("chevron-left-circle");      }
        static get chevronRightCircle  (): LinearIcon{ return this.makeFrom("chevron-right-circle");     }
        static get crop                (): LinearIcon{ return this.makeFrom("crop");                     }
        static get frameExpand         (): LinearIcon{ return this.makeFrom("frame-expand");             }
        static get frameContract       (): LinearIcon{ return this.makeFrom("frame-contract");           }
        static get layers              (): LinearIcon{ return this.makeFrom("layers");                   }
        static get funnel              (): LinearIcon{ return this.makeFrom("funnel");                   }
        static get textFormat          (): LinearIcon{ return this.makeFrom("text-format");              }
        static get textFormatRemove    (): LinearIcon{ return this.makeFrom("text-format-remove");       }
        static get textSize            (): LinearIcon{ return this.makeFrom("text-size");                }
        static get bold                (): LinearIcon{ return this.makeFrom("bold");                     }
        static get italic              (): LinearIcon{ return this.makeFrom("italic");                   }
        static get underline           (): LinearIcon{ return this.makeFrom("underline");                }
        static get strikethrough       (): LinearIcon{ return this.makeFrom("strikethrough");            }
        static get highlight           (): LinearIcon{ return this.makeFrom("highlight");                }
        static get textAlignLeft       (): LinearIcon{ return this.makeFrom("text-align-left");          }
        static get textAlignCenter     (): LinearIcon{ return this.makeFrom("text-align-center");        }
        static get textAlignRight      (): LinearIcon{ return this.makeFrom("text-align-right");         }
        static get textAlignJustify    (): LinearIcon{ return this.makeFrom("text-align-justify");       }
        static get lineSpacing         (): LinearIcon{ return this.makeFrom("line-spacing");             }
        static get indentIncrease      (): LinearIcon{ return this.makeFrom("indent-increase");          }
        static get indentDecrease      (): LinearIcon{ return this.makeFrom("indent-decrease");          }
        static get pilcrow             (): LinearIcon{ return this.makeFrom("pilcrow");                  }
        static get directionLtr        (): LinearIcon{ return this.makeFrom("direction-ltr");            }
        static get directionRtl        (): LinearIcon{ return this.makeFrom("direction-rtl");            }
        static get pageBreak           (): LinearIcon{ return this.makeFrom("page-break");               }
        static get sortAlphaAsc        (): LinearIcon{ return this.makeFrom("sort-alpha-asc");           }
        static get sortAmountAsc       (): LinearIcon{ return this.makeFrom("sort-amount-asc");          }
        static get hand                (): LinearIcon{ return this.makeFrom("hand");                     }
        static get pointerUp           (): LinearIcon{ return this.makeFrom("pointer-up");               }
        static get pointerRight        (): LinearIcon{ return this.makeFrom("pointer-right");            }
        static get pointerDown         (): LinearIcon{ return this.makeFrom("pointer-down");             }
        static get pointerLeft         (): LinearIcon{ return this.makeFrom("pointer-left");             }

        static get home32                    (): LinearIcon{ return this.makeFrom32("home");                     }
        static get apartment32               (): LinearIcon{ return this.makeFrom32("apartment");                }
        static get pencil32                  (): LinearIcon{ return this.makeFrom32("pencil");                   }
        static get magicWand32               (): LinearIcon{ return this.makeFrom32("magic-wand");               }
        static get drop32                    (): LinearIcon{ return this.makeFrom32("drop");                     }
        static get lighter32                 (): LinearIcon{ return this.makeFrom32("lighter");                  }
        static get poop32                    (): LinearIcon{ return this.makeFrom32("poop");                     }
        static get sun32                     (): LinearIcon{ return this.makeFrom32("sun");                      }
        static get moon32                    (): LinearIcon{ return this.makeFrom32("moon");                     }
        static get cloud32                   (): LinearIcon{ return this.makeFrom32("cloud");                    }
        static get cloudUpload32             (): LinearIcon{ return this.makeFrom32("cloud-upload");             }
        static get cloudDownload32           (): LinearIcon{ return this.makeFrom32("cloud-download");           }
        static get cloudSync32               (): LinearIcon{ return this.makeFrom32("cloud-sync");               }
        static get cloudCheck32              (): LinearIcon{ return this.makeFrom32("cloud-check");              }
        static get database32                (): LinearIcon{ return this.makeFrom32("database");                 }
        static get lock32                    (): LinearIcon{ return this.makeFrom32("lock");                     }
        static get cog32                     (): LinearIcon{ return this.makeFrom32("cog");                      }
        static get trash32                   (): LinearIcon{ return this.makeFrom32("trash");                    }
        static get dice32                    (): LinearIcon{ return this.makeFrom32("dice");                     }
        static get heart32                   (): LinearIcon{ return this.makeFrom32("heart");                    }
        static get star32                    (): LinearIcon{ return this.makeFrom32("star");                     }
        static get starHalf32                (): LinearIcon{ return this.makeFrom32("star-half");                }
        static get starEmpty32               (): LinearIcon{ return this.makeFrom32("star-empty");               }
        static get flag32                    (): LinearIcon{ return this.makeFrom32("flag");                     }
        static get envelope32                (): LinearIcon{ return this.makeFrom32("envelope");                 }
        static get paperclip32               (): LinearIcon{ return this.makeFrom32("paperclip");                }
        static get inbox32                   (): LinearIcon{ return this.makeFrom32("inbox");                    }
        static get eye32                     (): LinearIcon{ return this.makeFrom32("eye");                      }
        static get printer32                 (): LinearIcon{ return this.makeFrom32("printer");                  }
        static get fileEmpty32               (): LinearIcon{ return this.makeFrom32("file-empty");               }
        static get fileAdd32                 (): LinearIcon{ return this.makeFrom32("file-add");                 }
        static get enter32                   (): LinearIcon{ return this.makeFrom32("enter");                    }
        static get exit32                    (): LinearIcon{ return this.makeFrom32("exit");                     }
        static get graduationHat32           (): LinearIcon{ return this.makeFrom32("graduation-hat");           }
        static get license32                 (): LinearIcon{ return this.makeFrom32("license");                  }
        static get musicNote32               (): LinearIcon{ return this.makeFrom32("music-note");               }
        static get filmPlay32                (): LinearIcon{ return this.makeFrom32("film-play");                }
        static get cameraVideo32             (): LinearIcon{ return this.makeFrom32("camera-video");             }
        static get camera32                  (): LinearIcon{ return this.makeFrom32("camera");                   }
        static get picture32                 (): LinearIcon{ return this.makeFrom32("picture");                  }
        static get book32                    (): LinearIcon{ return this.makeFrom32("book");                     }
        static get bookmark32                (): LinearIcon{ return this.makeFrom32("bookmark");                 }
        static get user32                    (): LinearIcon{ return this.makeFrom32("user");                     }
        static get users32                   (): LinearIcon{ return this.makeFrom32("users");                    }
        static get shirt32                   (): LinearIcon{ return this.makeFrom32("shirt");                    }
        static get store32                   (): LinearIcon{ return this.makeFrom32("store");                    }
        static get cart32                    (): LinearIcon{ return this.makeFrom32("cart");                     }
        static get tag32                     (): LinearIcon{ return this.makeFrom32("tag");                      }
        static get phoneHandset32            (): LinearIcon{ return this.makeFrom32("phone-handset");            }
        static get phone32                   (): LinearIcon{ return this.makeFrom32("phone");                    }
        static get pushpin32                 (): LinearIcon{ return this.makeFrom32("pushpin");                  }
        static get mapMarker32               (): LinearIcon{ return this.makeFrom32("map-marker");               }
        static get map32                     (): LinearIcon{ return this.makeFrom32("map");                      }
        static get location32                (): LinearIcon{ return this.makeFrom32("location");                 }
        static get calendarFull32            (): LinearIcon{ return this.makeFrom32("calendar-full");            }
        static get keyboard32                (): LinearIcon{ return this.makeFrom32("keyboard");                 }
        static get spellCheck32              (): LinearIcon{ return this.makeFrom32("spell-check");              }
        static get screen32                  (): LinearIcon{ return this.makeFrom32("screen");                   }
        static get smartphone32              (): LinearIcon{ return this.makeFrom32("smartphone");               }
        static get tablet32                  (): LinearIcon{ return this.makeFrom32("tablet");                   }
        static get laptop32                  (): LinearIcon{ return this.makeFrom32("laptop");                   }
        static get laptopPhone32             (): LinearIcon{ return this.makeFrom32("laptop-phone");             }
        static get powerSwitch32             (): LinearIcon{ return this.makeFrom32("power-switch");             }
        static get bubble32                  (): LinearIcon{ return this.makeFrom32("bubble");                   }
        static get heartPulse32              (): LinearIcon{ return this.makeFrom32("heart-pulse");              }
        static get construction32            (): LinearIcon{ return this.makeFrom32("construction");             }
        static get pieChart32                (): LinearIcon{ return this.makeFrom32("pie-chart");                }
        static get chartBars32               (): LinearIcon{ return this.makeFrom32("chart-bars");               }
        static get gift32                    (): LinearIcon{ return this.makeFrom32("gift");                     }
        static get diamond32                 (): LinearIcon{ return this.makeFrom32("diamond");                  }
        static get linearicons32             (): LinearIcon{ return this.makeFrom32("linearicons");              }
        static get dinner32                  (): LinearIcon{ return this.makeFrom32("dinner");                   }
        static get coffeeCup32               (): LinearIcon{ return this.makeFrom32("coffee-cup");               }
        static get leaf32                    (): LinearIcon{ return this.makeFrom32("leaf");                     }
        static get paw32                     (): LinearIcon{ return this.makeFrom32("paw");                      }
        static get rocket32                  (): LinearIcon{ return this.makeFrom32("rocket");                   }
        static get briefcase32               (): LinearIcon{ return this.makeFrom32("briefcase");                }
        static get bus32                     (): LinearIcon{ return this.makeFrom32("bus");                      }
        static get car32                     (): LinearIcon{ return this.makeFrom32("car");                      }
        static get train32                   (): LinearIcon{ return this.makeFrom32("train");                    }
        static get bicycle32                 (): LinearIcon{ return this.makeFrom32("bicycle");                  }
        static get wheelchair32              (): LinearIcon{ return this.makeFrom32("wheelchair");               }
        static get select32                  (): LinearIcon{ return this.makeFrom32("select");                   }
        static get earth32                   (): LinearIcon{ return this.makeFrom32("earth");                    }
        static get smile32                   (): LinearIcon{ return this.makeFrom32("smile");                    }
        static get sad32                     (): LinearIcon{ return this.makeFrom32("sad");                      }
        static get neutral32                 (): LinearIcon{ return this.makeFrom32("neutral");                  }
        static get mustache32                (): LinearIcon{ return this.makeFrom32("mustache");                 }
        static get alarm32                   (): LinearIcon{ return this.makeFrom32("alarm");                    }
        static get bullhorn32                (): LinearIcon{ return this.makeFrom32("bullhorn");                 }
        static get volumeHigh32              (): LinearIcon{ return this.makeFrom32("volume-high");              }
        static get volumeMedium32            (): LinearIcon{ return this.makeFrom32("volume-medium");            }
        static get volumeLow32               (): LinearIcon{ return this.makeFrom32("volume-low");               }
        static get volume32                  (): LinearIcon{ return this.makeFrom32("volume");                   }
        static get mic32                     (): LinearIcon{ return this.makeFrom32("mic");                      }
        static get hourglass32               (): LinearIcon{ return this.makeFrom32("hourglass");                }
        static get undo32                    (): LinearIcon{ return this.makeFrom32("undo");                     }
        static get redo32                    (): LinearIcon{ return this.makeFrom32("redo");                     }
        static get sync32                    (): LinearIcon{ return this.makeFrom32("sync");                     }
        static get history32                 (): LinearIcon{ return this.makeFrom32("history");                  }
        static get clock32                   (): LinearIcon{ return this.makeFrom32("clock");                    }
        static get download32                (): LinearIcon{ return this.makeFrom32("download");                 }
        static get upload32                  (): LinearIcon{ return this.makeFrom32("upload");                   }
        static get enterDown32               (): LinearIcon{ return this.makeFrom32("enter-down");               }
        static get exitUp32                  (): LinearIcon{ return this.makeFrom32("exit-up");                  }
        static get bug32                     (): LinearIcon{ return this.makeFrom32("bug");                      }
        static get code32                    (): LinearIcon{ return this.makeFrom32("code");                     }
        static get link32                    (): LinearIcon{ return this.makeFrom32("link");                     }
        static get unlink32                  (): LinearIcon{ return this.makeFrom32("unlink");                   }
        static get thumbsUp32                (): LinearIcon{ return this.makeFrom32("thumbs-up");                }
        static get thumbsDown32              (): LinearIcon{ return this.makeFrom32("thumbs-down");              }
        static get magnifier32               (): LinearIcon{ return this.makeFrom32("magnifier");                }
        static get cross32                   (): LinearIcon{ return this.makeFrom32("cross");                    }
        static get menu32                    (): LinearIcon{ return this.makeFrom32("menu");                     }
        static get list32                    (): LinearIcon{ return this.makeFrom32("list");                     }
        static get chevronUp32               (): LinearIcon{ return this.makeFrom32("chevron-up");               }
        static get chevronDown32             (): LinearIcon{ return this.makeFrom32("chevron-down");             }
        static get chevronLeft32             (): LinearIcon{ return this.makeFrom32("chevron-left");             }
        static get chevronRight32            (): LinearIcon{ return this.makeFrom32("chevron-right");            }
        static get arrowUp32                 (): LinearIcon{ return this.makeFrom32("arrow-up");                 }
        static get arrowDown32               (): LinearIcon{ return this.makeFrom32("arrow-down");               }
        static get arrowLeft32               (): LinearIcon{ return this.makeFrom32("arrow-left");               }
        static get arrowRight32              (): LinearIcon{ return this.makeFrom32("arrow-right");              }
        static get move32                    (): LinearIcon{ return this.makeFrom32("move");                     }
        static get warning32                 (): LinearIcon{ return this.makeFrom32("warning");                  }
        static get questionCircle32          (): LinearIcon{ return this.makeFrom32("question-circle");          }
        static get menuCircle32              (): LinearIcon{ return this.makeFrom32("menu-circle");              }
        static get checkmarkCircle32         (): LinearIcon{ return this.makeFrom32("checkmark-circle");         }
        static get crossCircle32             (): LinearIcon{ return this.makeFrom32("cross-circle");             }
        static get plusCircle32              (): LinearIcon{ return this.makeFrom32("plus-circle");              }
        static get arrowUpCircle32           (): LinearIcon{ return this.makeFrom32("arrow-up-circle");          }
        static get circleMinus32             (): LinearIcon{ return this.makeFrom32("circle-minus");             }
        static get arrowDownCircle32         (): LinearIcon{ return this.makeFrom32("arrow-down-circle");        }
        static get arrowLeftCircle32         (): LinearIcon{ return this.makeFrom32("arrow-left-circle");        }
        static get arrowRightCircle32        (): LinearIcon{ return this.makeFrom32("arrow-right-circle");       }
        static get chevronUpCircle32         (): LinearIcon{ return this.makeFrom32("chevron-up-circle");        }
        static get chevronDownCircle32       (): LinearIcon{ return this.makeFrom32("chevron-down-circle");      }
        static get chevronLeftCircle32       (): LinearIcon{ return this.makeFrom32("chevron-left-circle");      }
        static get chevronRightCircle32      (): LinearIcon{ return this.makeFrom32("chevron-right-circle");     }
        static get crop32                    (): LinearIcon{ return this.makeFrom32("crop");                     }
        static get frameExpand32             (): LinearIcon{ return this.makeFrom32("frame-expand");             }
        static get frameContract32           (): LinearIcon{ return this.makeFrom32("frame-contract");           }
        static get layers32                  (): LinearIcon{ return this.makeFrom32("layers");                   }
        static get funnel32                  (): LinearIcon{ return this.makeFrom32("funnel");                   }
        static get textFormat32              (): LinearIcon{ return this.makeFrom32("text-format");              }
        static get textFormatRemove32        (): LinearIcon{ return this.makeFrom32("text-format-remove");       }
        static get textSize32                (): LinearIcon{ return this.makeFrom32("text-size");                }
        static get bold32                    (): LinearIcon{ return this.makeFrom32("bold");                     }
        static get italic32                  (): LinearIcon{ return this.makeFrom32("italic");                   }
        static get underline32               (): LinearIcon{ return this.makeFrom32("underline");                }
        static get strikethrough32           (): LinearIcon{ return this.makeFrom32("strikethrough");            }
        static get highlight32               (): LinearIcon{ return this.makeFrom32("highlight");                }
        static get textAlignLeft32           (): LinearIcon{ return this.makeFrom32("text-align-left");          }
        static get textAlignCenter32         (): LinearIcon{ return this.makeFrom32("text-align-center");        }
        static get textAlignRight32          (): LinearIcon{ return this.makeFrom32("text-align-right");         }
        static get textAlignJustify32        (): LinearIcon{ return this.makeFrom32("text-align-justify");       }
        static get lineSpacing32             (): LinearIcon{ return this.makeFrom32("line-spacing");             }
        static get indentIncrease32          (): LinearIcon{ return this.makeFrom32("indent-increase");          }
        static get indentDecrease32          (): LinearIcon{ return this.makeFrom32("indent-decrease");          }
        static get pilcrow32                 (): LinearIcon{ return this.makeFrom32("pilcrow");                  }
        static get directionLtr32            (): LinearIcon{ return this.makeFrom32("direction-ltr");            }
        static get directionRtl32            (): LinearIcon{ return this.makeFrom32("direction-rtl");            }
        static get pageBreak32               (): LinearIcon{ return this.makeFrom32("page-break");               }
        static get sortAlphaAsc32            (): LinearIcon{ return this.makeFrom32("sort-alpha-asc");           }
        static get sortAmountAsc32           (): LinearIcon{ return this.makeFrom32("sort-amount-asc");          }
        static get hand32                    (): LinearIcon{ return this.makeFrom32("hand");                     }
        static get pointerUp32               (): LinearIcon{ return this.makeFrom32("pointer-up");               }
        static get pointerRight32            (): LinearIcon{ return this.makeFrom32("pointer-right");            }
        static get pointerDown32             (): LinearIcon{ return this.makeFrom32("pointer-down");             }
        static get pointerLeft32             (): LinearIcon{ return this.makeFrom32("pointer-left");             }


        //endregion

        /**
         * Creates the item
         * @param className
         */
        constructor(className: string, size: number = 16){
            super(size);

            this.addClass("lnr");
            this.addClass("lnr-" + className);
        }

        //region Methods

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'size'){
                this.raw.style.fontSize = this.size.px;
            }

        }

        //endregion

        //region Properties

        /**
         * Gets or sets the class name of the icon
         */
        get className(): string {
            return this.getPropertyValue('className', String, '');
        }

        /**
         * Gets or sets the class name of the icon
         *
         * @param {string} value
         */
        set className(value: string) {
            this.setPropertyValue('className', value, String);
        }


        //endregion

    }


}