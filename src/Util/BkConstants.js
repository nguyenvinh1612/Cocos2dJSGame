/**
 * Created by bs on 29/09/2015.
 */

function BkConstants() {
}

if(typeof VC == "undefined") {
    var VC = {};
    VC.VIP_INFO                                         = 0;
    VC.VIP_INFO_DETAIL                                  = 1;
    VC.VIP_LEVEL_CHANGE                                 = 2;
    VC.VIP_BORROW_INFO                                  = 3;
    VC.VIP_BORROW_MONEY                                 = 4;
    VC.VIP_TRANSFER_INFO                                = 5;
    VC.VIP_TRANSFER_MONEY                               = 6;
    VC.VIP_MONEY_BOX_INFO                               = 7;
    VC.VIP_SEND_MONEY_TO_BOX                            = 8;
    VC.VIP_BOX_SETUP_PASSWORD                           = 9;
    VC.VIP_BOX_UPDATE_PASSWORD                          = 10;
    VC.VIP_BOX_RECOVER_PASSWORD                         = 11;
    VC.VIP_BOX_LOGIN                                    = 12;
    VC.VIP_BOX_GET_MONEY                                = 13;
    VC.VIP_RETURN_BORROWED_MONEY                        = 14;
    VC.VIP_BORROW_NOTIFY                                = 15;
    VC.VIP_BENEFIT                                      = 16;
    VC.VIP_BENEFIT_DETAIL                               = 17;
    VC.VIP_INVITE_FRIEND_MONEY                          = 18;
}

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.background = 0;
    TagOfLayer.Animation = 1;
    TagOfLayer.GameLayer = 2;
    TagOfLayer.Popup = 997;
    TagOfLayer.CountDownTime = 998;
    TagOfLayer.Toast = 999;
    TagOfLayer.AMIN = 1000;
}

// Network
if(typeof c == "undefined") {
    var c = {};
    c.ANY                                                   = 0;
    c.CONNECT                                               = 1; //ok
    c.CONNECT_FAILED                                        = 2; //ok
    c.NETWORK_LOG_IN                                        = 3;// ok
    c.NETWORK_LOG_OUT                                       = 4;
    c.NETWORK_LOG_IN_SUCCESS                                = 5;
    c.NETWORK_LOG_IN_FAILURE                                = 6;
    c.NETWORK_TABLE_JOIN                                    = 7;
    c.NETWORK_TABLE_LEAVE                                   = 8;
    c.NETWORK_TABLE_JOIN_SUCCESS                            = 9;
    c.NETWORK_TABLE_JOIN_FAILURE                            = 10;
    c.NETWORK_START									        =11;
    c.NETWORK_STOP									        =12;
    c.NETWORK_SESSION_MESSAGE							    =13;
    c.NETWORK_NETWORK_MESSAGE							    =14;
    c.NETWORK_CHANGE_ATTRIBUTE						        =15;
    c.NETWORK_DISCONNECT								    =16;
    c.NETWORK_EXCEPTION								        =17;
    c.NETWORK_RECONNECT								        =18;
    c.NETWORK_RECONNECT_FAILURE						        =19;
    c.NETWORK_SESSION_TERMINATED						    =20;
    c.NETWORK_TABLE_LEAVE_SUCCESS						    =21;
    c.NETWORK_ROOM_TABLES_UPDATE                            =22;
    c.NETWORK_TABLE_CHAT								    =23;
    c.NETWORK_TABLE_CHAT_RETURN						        =24;
    c.NETWORK_DEAL_CARD								        =25;
    //c.NETWORK_VERIFY_TRANSACTION_RECEIPT_WINPHONE		    =25;
    c.NETWORK_DEAL_CARD_RETURN						        =26;
    c.NETWORK_FRIEND_SEARCH_BY_USERNAME				        =26;
    c.NETWORK_TABLE_INFO_RETURN                             =27;
    c.NETWORK_REQUEST_BONUS_FOR_NEWAPP				        =27;
    c.NETWORK_DISCARD									    =28;
    c.NETWORK_MOVE_PIECE								    =28;
    c.NETWORK_MOVE_PIECE_RETURN						        =28;
    c.NETWORK_DISCARD_PUSH							        =29;
    c.NETWORK_INFOR_RETURN							        =29;
    c.NETWORK_PICK_CARD								        =30;
    c.NETWORK_REAL_TYPE_RETURN						        =30;
    c.NETWORK_PICK_CARD_RETURN						        =31;
    c.NETWORK_TAKE_CARD								        =32;
    c.NETWORK_TAKE_CARD_PUSH							    =33;
    c.NETWORK_SHOW_PHOM								        =34;
    c.NETWORK_XET_BAI									    =34;
    c.NETWORK_TLMN_SLASH                                    =34;
    c.GET_TOP_RICHEST_CHAN_PLAYER					        = 34; // OK
    c.NETWORK_SHOW_PHOM_RETURN						        =35;
    c.NETWORK_XET_BAI_RETURN							    =35;
    c.NETWORK_FINISH_GAME_RETURN						    =36;
    c.NETWORK_SEND_CARD								        =37;
    c.NETWORK_XET_TAT									    =37;
    c.NETWORK_CHANGE_GA_GOP							        = 37;
    c.NETWORK_CHANGE_GA_GOP_PUSH						    = 37;
    c.NETWORK_SEND_CARD_RETURN						        =38;
    c.NETWORK_AUTO_WIN_RETURN							    =38;
    c.NETWORK_TABLE_LEAVE_PUSH						        =39;
    c.NETWORK_SHOW_U									    =40;
    c.NETWORK_SETUP_CO_TABLE							    =40;
    c.NETWORK_SETUP_RULE_RETURN						        =40;
    c.NETWORK_SHOW_U_PUSH								    =41;
    c.NETWORK_SHOW_U_PUSH_RETURN						    =41;
    c.NETWORK_ROOM_JOIN                                     =42;
    c.NETWORK_PLAYER_STATUS							        =43;
    c.NETWORK_PLAYER_STATUS_RETURN					        =44;
    c.NETWORK_ROOM_LEAVE								    =45;
    c.NETWORK_TABLE_SIZE_UPDATE_PUSH					    =46;
    c.NETWORK_SETUP_TABLE								    =47;
    c.NETWORK_TABLE_SETTINGS_UPDATE_PUSH				    =48;
    c.NETWORK_AUTO_SHOW_PHOM_PUSH						    =49;
    c.NETWORK_PICK_CARD_PUSH							    =50;
    c.NETWORK_TABLE_SYN_RETURN                              =51;
    c.NETWORK_RECONNECT_SUCCESS						        =52;
    c.NETWORK_SYNC									        =53;
    c.NETWORK_KICK_PLAYER								    =54;
    c.NETWORK_KICK_PLAYER_PUSH						        =55;
    c.NETWORK_AUTO_FIND_TABLE                               =56;
    c.NETWORK_AUTO_FIND_TABLE_NOT_FOUND_RETURN              =57;
    c.NETWORK_MAKE_NEW_CONNECTION						    =58;
    c.NETWORK_GET_GAME_TABLE_INFO                           =59;
    c.NETWORK_ROOM_LEAVE_SUCCESS						    =60;
    c.NETWORK_ROOM_JOIN_SUCCESS                             =62;
    c.NETWORK_GET_TABLES                                    =63;
    c.NETWORK_GET_WAITING_PLAYERS						    =64;
    c.NETWORK_GET_PLAYERS_IN_ROOM						    =64;
    c.NETWORK_WAITING_PLAYERS_RETURN					    =65;
    c.NETWORK_INVITE_PLAYER							        =66;
    c.NETWORK_RECEIVE_INVITATION                            =67;
    c.NETWORK_QUICK_TABLE_JOIN						        =68;
    c.NETWORK_GAME_JOIN                                     =69;
    c.NETWORK_GAME_JOIN_SUCCESS                             =70;
    c.NETWORK_GAME_LEAVE								    =71;
    c.NETWORK_GAME_LEAVE_SUCCESS						    =72;
    c.NETWORK_GET_OFFER_RANDOM_TABLE					    =73;
    c.NETWORK_TIME_OUT_LEAVE							    =74;
    c.NETWORK_GET_LOTTE_RESULT						        =75;
    c.NETWORK_LOTTE_RESULT_RETURN						    =76;
    c.NETWORK_TLMN_AUTO_WIN_PUSH						    =77;
    c.NETWORK_MAUBINH_AUTO_WIN_PUSH					        =77;
    c.NETWORK_TLMN_THOI_PUSH							    =78;
    c.NETWORK_BET_LO_TICKET							        =79;
    c.NETWORK_BET_DE_TICKET							        =80;
    c.NETWORK_BET_BACAY								        =81;
    c.NETWORK_CHIU									        =81;
    c.NETWORK_CHIU_RETURN								    =81;
    c.NETWORK_CHESS_OFFER								    =81;
    c.NETWORK_CHESS_OFFER_RETURN						    =81;
    c.UPDATE_PLAYER_NAME 					                =82;
    c.NETWORK_BET_BACAY_RETURN						        =82;
    c.NETWORK_TRA_CUA									    =82;
    c.NETWORK_TRA_CUA_RETURN							    =82;
    c.NETWORK_FACE_BOOK_LIKE							    =83;
    c.NETWORK_FACE_BOOK_ALLOW_POST_ON_WALL			        =84;
    c.NETWORK_DISCARD_SUCCESS							    =85;
    c.NETWORK_REGISTER_USER							        =86;
    c.NETWORK_REGISTER_FAILURE                              =87;
    c.NETWORK_REGISTER_USER_WINPHONE					    =87;
    c.NETWORK_FRIEND_REQUEST						        =88;
    c.NETWORK_GET_FRIENDS                                   =89;
    c.NETWORK_GET_FRIENDS_RETURN						    =90;
    c.NETWORK_FRIEND_REQUEST_ACCEPT					        =91;
    c.NETWORK_FRIEND_REQUEST_REJECT					        =92;
    c.NETWORK_GET_FRIENDS_TO_INVITE					        =93;
    c.NETWORK_GET_FRIENDS_TO_INVITE_RETURN				    =94;
    c.NETWORK_UPDATE_PROFILE						        =95;
    c.NETWORK_UPDATE_PROFILE_SUCCESS					    =96;
    c.NETWORK_START_FRUIT_MACHINE						    =97;
    c.NETWORK_FRUIT_RESULT_RETURN						    =98;
    c.NETWORK_GET_PROFILE                                   =99;
    c.NETWORK_PROFILE_RETURN						        =100;
    c.NETWORK_JOIN_FRIEND_TABLE						        =101;
    c.NETWORK_FORGOT_PASSWORD						        =102;
    c.NETWORK_GET_INBOX_MAILS						        =103;
    c.NETWORK_INBOX_MAILS_RETURN						    =104;
    c.NETWORK_GET_OUTBOX_MAILS						        =105;
    c.NETWORK_OUTBOX_MAILS_RETURN						    =106;
    c.NETWORK_SEND_MAIL							            =107;
    c.NETWORK_SEND_MAIL_SUCCESS						        =108;
    c.NETWORK_PLAYER_NOT_EXIST						        =109;
    c.NETWORK_GET_MAIL							            =110;
    c.NETWORK_MAIL_RETURN							        =111;
    c.NETWORK_DELETE_MAIL							        =112;
    c.NETWORK_GET_TOP_PLAYER						        =113;
    c.NETWORK_TOP_U_TO_RETURN                               =113;
    c.NETWORK_GET_TOP_PLAYER_RETURN					        =114;
    c.NETWORK_GET_TOP_RICHEST_PLAYER					    =115;
    c.NETWORK_GET_TOP_RICHEST_PLAYER_RETURN				    =116;
    c.NETWORK_FORFEIT							            =117;
    c.NETWORK_CALL							                =118;
    c.NETWORK_UPDATE_PHONE_NUMBER						    =118;
    c.NETWORK_FORFEIT_RETURN						        =119;
    c.NETWORK_CALL_RETURN							        =120;
    c.NETWORK_ERROR_RETURN						            =120;
    c.NETWORK_RAISE							                =121;
    c.NETWORK_SEND_TOKEN_TO_PHONE                           =121;
    c.NETWORK_VALID_PLAYER_BY_PHONE_CHECK_AND_SEND_TOKEN    =122;
    c.NETWORK_RAISE_RETURN						            =122;
    c.NETWORK_XUONG_CUOC							        =122;
    c.NETWORK_XUONG_CUOC_RETURN						        =122;
    c.NETWORK_GET_PLAYER_ACHIEVEMENT					    =123;
    c.NETWORK_GET_PLAYER_ACHIEVEMENT_RETURN				    =124;
    c.NETWORK_GET_PLAYER_ITEMS						        =125;
    c.NETWORK_PLAYER_ITEMS_RETURN						    =126;
    c.NETWORK_BUY_ITEM							            =127;
    c.NETWORK_BUY_ITEM_SUCCESS						        =-1;
    c.NETWORK_LEAVE_DURING_GAME						        =-2;
    c.NETWORK_PLAYER_NEW_LEVEL						        =-3;
    c.NETWORK_BUY_ITEM_FAILURE						        =-4;
    c.NETWORK_SELECT_AVATAR						            =-5;
    c.NETWORK_SELECT_AVATAR_SUCCESS					        =-6;
    c.NETWORK_ADD_MONEY_RETURN						        =-7;
    c.NETWORK_TRANSFER_MONEY						        =-8;
    c.NETWORK_TRANSFER_MONEY_SUCCESS					    =-9;
    c.NETWORK_TRANSFER_MONEY_FAILURE					    =-10;
    c.NETWORK_PLAYER_HAS_BONUS						        =-11;
    c.NETWORK_CHAT							                =-12;
    c.NETWORK_CHAT_PUSH							            =-13;
    c.NETWORK_JOIN_ROOM_LIST						        =-14;
    c.NETWORK_GET_GAME_ROOMS_RETURN					        =-15;
    c.NETWORK_UNABLE_TO_KICK						        =-16;
    c.NETWORK_PROTECTED_FROM_UNKICKABLE_WAND				=-17;
    c.NETWORK_GET_OVERVIEW_OTHER_PROFILE					=-18;
    c.NETWORK_OVERVIEW_OTHER_PROFILE_RETURN				    =-19;
    c.NETWORK_PUSH_TRANSFER_MONEY						    =-20;
    c.NETWORK_GET_CHAMPION_LIST						        =-21;
    c.NETWORK_GET_CHAMPION_LIST_RETURN					    =-22;
    c.NETWORK_REMOVE_FRIEND						            =-23;
    c.NETWORK_GET_GAME_ROOMS_BY_ROOM_TYPE					=-24;
    c.NETWORK_GET_GAME_ROOMS_BY_ROOM_TYPE_RETURN			=-25;
    c.NETWORK_LUCKY_BOX_REQUEST								=-26;
    c.NETWORK_BET_MONEY_OPTIONS						        =-26;
    c.NETWORK_LUCKY_BOX_REQUEST_RETURN					    =-27;
    c.NETWORK_INVITE_MULTI_PLAYER						    =-27;
    c.NETWORK_IS_FACE_BOOK_LIKE_AND_ALLOW_POST_ON_WALL		=-28;
    c.NETWORK_JOIN_FRIEND_TABLE_FAILURE					    =-29;
    c.NETWORK_IS_FACE_BOOK_CONNECT_LIKE_AND_ALLOW_POST_ON_WALL_RETURN	=-30;
    c.NETWORK_FACE_BOOK_CONNECT						        =-31;
    c.NETWORK_PLAYER_MONEY_CHANGE_PUSH					    =-33;
    c.NETWORK_RATE_APP							            =-34;
    c.NETWORK_RATE_APP_SUCCESS						        =-35;
    c.NETWORK_REMOVE_FRIEND_SUCCESS					        =-36;
    c.NETWORK_ACCEPT_FRIEND_SUCCESS					        =-37;
    c.NETWORK_BAO_XAM							            =-38;
    c.NETWORK_JOIN_CHAN_GAME							    =-39;
    c.NETWORK_BAO_XAM_RETURN						        =-39;
    c.NETWORK_WRITER_IDLE_TIMEOUT						    =-40;
    c.NETWORK_TABLE_LEAVE_FAILURE						    =-41;
    c.NETWORK_TABLE_STATUS_CHANGE						    =-42;
    c.NETWORK_START_SYNCH							        =-43;
    c.NETWORK_JOIN_ROOM_LIST_RETURN					        =-44;
    c.NETWORK_GET_MAIN_PROFILE						        =-45;
    c.NETWORK_MAIN_PROFILE_RETURN						    =-46;
    c.NETWORK_ON_HAS_ALLOW_KICK_WAND					    =-47;
    c.NETWORK_SETUP_TABLE_FAILED						    =-48;
    c.NETWORK_REQUEST_FRIEND_SUCCESS					    =-49;
    c.NETWORK_ASSIGN_AS_TABLE_OWNER					        =-50;
    c.NETWORK_BET_MONEY_UPDATE						        =-51;
    c.NETWORK_GET_CONTENT_PROVIDER_INFO					    =-52;
    c.NETWORK_CONTENT_PROVIDER_INFO_RETURN				    =-53;
    c.NETWORK_NAP_THE_CAO							        =-54;
    c.NETWORK_NAP_THE_CAO_SUCCESS						    =-55;
    c.NETWORK_NAP_THE_CAO_FAILED						    =-56;
    c.NETWORK_SERVICE_NAP_THE_BUSY					        =-57;
    c.NETWORK_TABLE_JOIN_PUSH						        =-58;
    c.NETWORK_MAKE_NEW_CONNECTION_SUCCESS					=-59;
    c.NETWORK_MAKE_NEW_CONNECTION_FAILED					=-60;
    c.NETWORK_GET_LATEST_LOTTE_RESULT					    =-61;
    c.NETWORK_GET_UPDATE_URL						        =-63;
    c.NETWORK_UPDATE_URL_RETURN						        =-63;
    c.NETWORK_KDL								            =-64;
    c.NETWORK_CONTINUE_GAME						            =-65;
    c.NETWORK_CONTINUE_GAME_RETURN					        =-66;
    c.NETWORK_PREPARE_NEW_GAME						        =-67;
    c.NETWORK_RATE_APP_FAILURE						        =-68;
    c.NETWORK_GET_INSTALLED_XENG_BONUS					    =-69;
    c.NETWORK_INSTALLED_XENG_BONUS_RETURN					=-70;
    c.NETWORK_INFORM_PLAYERS						        =-71;
    c.NETWORK_NAP_THE_CAO_BANNED						    =-72;
    c.NETWORK_KILL_SESSIONS						            =-73;
    c.NETWORK_UPDATE_PASSWORD						        =-74;
    c.NETWORK_UPDATE_PASSWORD_FAILED					    =-75;
    c.NETWORK_UPDATE_PASSWORD_SUCCESS					    =-76;
    c.NETWORK_GET_INSTALLED_NEW_GAME_BONUS				    =-77;
    c.NETWORK_INSTALLED_NEW_GAME_BONUS_RETURN				=-78;
    c.NETWORK_ADMIN_CHANGED_MONEY_RETURN					=-79;
    c.NETWORK_FORGOT_PASSWORD_RETURN					    =-81;
    c.NETWORK_WRONG_USERNAME_OR_CLIENT_ID					=-82;
    c.NETWORK_GET_EVENT_HTML						        =-83;
    c.NETWORK_EVENT_HTML_RETURN						        =-84;
    c.NETWORK_NOTIFY_NEW_EVENT_HTML						    =-85;
    c.NETWORK_MARK_AS_READ_EVENT_HTML						=-86;
    c.NETWORK_RECOMMENDATION_FRIEND						    =-87;
    c.NETWORK_PING_MESSAGE							        =-88;
    c.NETWORK_LOCKED_CLIENT							        =-89;
    c.NETWORK_JOIN_RANDOM_TABLE							    =-90;
    c.NETWORK_REGISTER_EXCEED_MAX							=-91;
    c.NETWORK_SEND_MESSAGE_TO_CLIENT						=-92;
    c.NETWORK_GET_ITEM_INFO							        =-93;
    c.NETWORK_DROP_WORD								        =-94;
    c.NETWORK_DROP_WORD_IN_HAND							    =-95;
    c.NETWORK_GET_PLAYER_ACHIEVEMENT_NEW				    =-96;
    c.NETWORK_LATEST_DROP_WORD							    =-97;
    c.NETWORK_VERIFY_TRANSACTION_RECEIPE					=-98;
    c.NETWORK_SETUP_CHAN_TABLE							    =-99;
    c.NETWORK_LOG_IN_FACEBOOK							    =110;
    c.NETWORK_SETUP_FACEBOOK_ACCOUNT					    =-99;
    c.NETWORK_JOIN_WEB_GAME_ROOM                            =-100;
    c.NETWORK_GET_GOLD_BOX_REMAIN_TIME						=-100;
    c.NETWORK_GET_GOLD_BOX_REMAIN_TIME_RETURN				=-100;
    c.NETWORK_GET_GOLD_BOX_REWARD							=-101;
    c.NETWORK_GET_GOLD_BOX_REWARD_RETURN					=-101;
    c.NETWORK_LOG_IN_WINPHONE							    =-101;
    c.NETWORK_FACEBOOK_BONUS_ALREADY_RECEIVED				=-102;
    c.NETWORK_FACEBOOK_INVITE_FRIENDS						=-103;
    c.NETWORK_GET_FACEBOOK_INVITE_FRIENDS					=-104;
    c.NETWORK_UPDATE_PRIVATE_KEY							=-105;
    c.NETWORK_GPLUS_ONE								        =-106;
    c.NETWORK_GET_GPLUS_ONE							        =-107;
    c.NETWORK_UPDATE_OBSERVER_STATUS						=-108;
    c.NETWORK_SERVER_REQUEST                                =-109;
    c.NETWORK_BOC_CAI									    = -109;

    c.NETWORK_GET_DAILY_TASK_LIST							=40;
    c.NETWORK_GET_DAILY_TASK_LIST_RETURN					=40;
    c.NETWORK_REQUEST_DAILY_TASK_BONUS						=41;
    c.NETWORK_REQUEST_DAILY_TASK_BONUS_RETURN				=41;

    c.NETWORK_QUAY_NOTIFY           					    = 42;
    c.UPDATE_PLAYER_MODEL 							        = 75;

    // truongbs++: add lo de packet
    c.NETWORK_BET_LOTTE_TICKET						        =79;
    c.NETWORK_BET_TICKET				                    =80;
    c.NETWORK_BET_FOOTBALL                                  = 24;
    c.NETWORK_BET_FOOTBALL_RETURN                           = 24;
    
    
    //vinhnq
    c.NETWORK_CLIENT_SETTING                                 = -110;
    c.NETWORK_VERIFY_TRANSACTION_GOOGLEIAP                           = -111;
    c.NETWORK_CHECK_GOOGLE_IAP                                       = -112;
    c.NETWORK_GOOGLE_IAP_BONUS_NEW_USER 							 = -113;
    c.NETWORK_UPDATE_STATUS         								 = -114;
    
    //
    c.NETWORK_VIP_FUNCTION                                  = -115;
    c.NETWORK_NOTIFY_ADD_MONEY         						= -116;
    c.NETWORK_NOTIFY_PAYMENT_BONUS       					= -117;
   

    // truongbs++: add winsize
    c.WINDOW_WIDTH                                          =960;
    c.WINDOW_HEIGHT                                         =625;
    c.TAX_RATE                                              = 0.05;

    c.MIN_BET_MONEY_NHA_TRANH 	                            = 200;
    c.MIN_BET_MONEY_DINH_THU_QUAN                           = 2000;
    c.MIN_BET_MONEY_DAU_TAY_DOI 	                        = 500;

    c.MAX_BET_MONEY_NHA_TRANH 	                            = 40000;
    c.MAX_BET_MONEY_DINH_THU_QUAN                           = 400000;
    c.MAX_BET_MONEY_DAU_TAY_DOI 	                        = 100000;

    c.NETWORK_VERSION                                       = 3;
    c.WEBJS_VERSION                                         = "wss";
    c.WEB_CLIENT_ID                                         = "clientIdV2";
    c.SCALE_BUTTON_BASE                                     = 0.6;
    c.CPID_WEB                                              = "866";
}

if(typeof LDNS == "undefined") {
    var LDNS = {};

    LDNS.PLACE_BET_LOTTE = 2;
    LDNS.GET_MAX_BET_MONEY = 1;
    LDNS.PAY_BET_FOOTBALL_WIN_MONEY = 1;


    LDNS.MYBET_INDEX = 0;
    LDNS.LASTEST_INDEX = 1;
    LDNS.TOP_INDEX = 2;

    LDNS.LO = 0;
    LDNS.XIEN2 = 1;
    LDNS.XIEN3 = 2;
    LDNS.XIEN4 = 3;
    LDNS.LO3CANG = 4;
    LDNS.DE = 5;
    LDNS.DEDAU = 6;
    LDNS.DECUOI = 7;
    LDNS.DE3CANG = 8;
    LDNS.THONGKELODE = 100;

    LDNS.MAX_NUMBER_CAN_BET = 10;
    LDNS.MIN_BET_MONEY = 500;

    LDNS.NUMBER_LODE_CODE = 6;
    LDNS.LODE_ERR_CODE = ["Đặt số không hợp lệ", "Vé cược có số bị trùng nhau", "Đặt cược sai format"
        , "Bạn không đủ tiền", "Đã hết thời gian cược. Vui lòng quay lại sau!", "Đặt tiền cược quá giới hạn"];

    LDNS.LODE_TEXT = ["Lô", "Xiên 2", "Xiên 3", "Xiên 4", "Lô 3 càng", "Đề", "Đề đầu", "Đề cuối", "Đề 3 càng"];
    LDNS.TYLE_TEXT = ["(1 ăn 3.4)", "(1 ăn 10.0)", "(1 ăn 40.0)", "(1 ăn 100.0)", "(1 ăn 30.0)", "(1 ăn 70.0)"
                        , "(1 ăn 7.0)", "(1 ăn 7.0)", "(1 ăn 450.0)"];
}

// Game State
if(typeof GS == "undefined") {
    var GS = {};

    GS.CHOOSE_GAME = 0;
    GS.CHOOSE_ZONE = 1;
    GS.CHOOSE_TABLE = 2;
    GS.INGAME_GAME = 3;
    GS.WAITTING_JOIN_ROOM_FROM_INGAME = 4;
    GS.PREPARE_GAME = 99;
    GS.CLIENT_LOCK = -1;
    GS.SESSION_TERMINATED = -2;
}

// Color define
if(typeof BkColor == "undefined"){
    var BkColor = {};
    BkColor.DEFAULT_TEXT_COLOR = cc.color(255, 255, 255);
    BkColor.WINDOW_CONTENT_TEXT_COLOR = cc.color(207, 180, 90);
    BkColor.COLOR_HEADER_TEXT = cc.color(156, 134, 67);
    BkColor.COLOR_TEXT_FORMAT_TAB = cc.color(69, 60, 30);
    BkColor.GRID_ITEM_COLOR = cc.color(9, 94, 150);
    BkColor.GRID_ITEM_COLOR_VV = cc.color(9, 94, 150,100);
    BkColor.COLOR_CONTENT_TEXT = cc.color(0xcf,0xb4,0x5a);
    BkColor.GRID_ITEM_HOVER_COLOR = cc.color(24, 111, 168);
    BkColor.GRID_ITEM_HOVER_COLOR_VV = cc.color(0x80, 0x80, 0x80,122);
    BkColor.GRID_ROW_BORDER_COLOR = cc.color(2, 70, 150);//cc.color(2, 63, 120);
    BkColor.GRID_ROW_BORDER_COLOR_VV = cc.color(196, 154, 108);
    BkColor.GRID_ITEM_TEXT_COLOR = BkColor.DEFAULT_TEXT_COLOR;
    BkColor.GRID_ITEM_TEXT_COLOR_VV = cc.color(0xfb, 0xb0, 0x40);
    BkColor.GRID_ITEM_TEXT_HEADER = cc.color(18, 222, 246);
    BkColor.GRID_ITEM_TEXT_HEADER_VV = cc.color(0xcf, 0xb4, 0x5a);
    BkColor.BG_BODY_COLOR = cc.color(23,51,111, 255);
    BkColor.BG_BODY_BORDER_COLOR = BkColor.BG_BODY_COLOR;
    BkColor.BG_PANEL_COLOR = cc.color(7, 105, 178, 255);  //#085680
    BkColor.BG_PANEL_BORDER_COLOR = cc.color(7, 130, 223, 255); //#3c91b9
    BkColor.MAIL_ITEM_HEADER_COLOR = cc.color(109,185,225);
    BkColor.MAIL_EDITOR_BORDER_COLOR = cc.color(76, 45, 27);
    BkColor.HEADER_CONTENT_COLOR = BkColor.GRID_ITEM_TEXT_HEADER;
    BkColor.TEXT_INPUT_COLOR = cc.color(0, 0, 0);
    BkColor.TEXT_INPUT_PLACEHOLDER_COLOR = cc.color(13,70,128);
    BkColor.TEXT_INPUT_PLACEHOLDER_NOBG_COLOR = cc.color(204,215,224);
    BkColor.TEXT_INPUT_PLACEHOLDER_LOGIN = cc.color(231,229,187);
    BkColor.CONTENT_BORDER_COLOR = cc.color(19,96,137);
    BkColor.BG_LB_PANEL = cc.color(81, 167, 225, 40);
    BkColor.BG_LB_PANEL_BORDER = cc.color(1, 127, 154, 255);
    BkColor.BG_LB_PANEL_INNER_BORDER = cc.color(0, 0, 0, 153);
    BkColor.BG_LB_PANEL_HOVER = cc.color(81, 167, 225, 80);
    BkColor.BTN_YELLOW_TEXT_SHADOW = cc.color(3,2,0,150);
    BkColor.TEXT_MONEY_COLOR = cc.color(255,255,0);
    BkColor.TEXT_MAUBINH_SUITE = cc.color(0,255,132);
    BkColor.TEXT_MAUBINH_SUITE_MAU_BINH = cc.color(255,162,0);
    BkColor.VV_WINDOW_TITLE_COLOR = cc.color(252, 237, 99);
    BkColor.VV_REGISTER_PHONE_WD_TEXT_COLOR = cc.color(207, 180, 90);
    BkColor.VV_MONEY_TEXT_COLOR = cc.color(251, 176, 64);
    BkColor.VV_BUTTON_TITLE_COLOR = cc.color(132, 86, 5);
    BkColor.VV_SMS_TEXT_COLOR = cc.color(41, 15, 0);
    BkColor.VV_SMS_TEXT_NOTE_COLOR = cc.color(186, 180, 124);
    BkColor.VV_TY_GIA_COLOR = cc.color(155, 75, 22);
    BkColor.VV_QUAN_GOC_OLD_COLOR = cc.color(117, 117, 117);
    BkColor.VV_QUAN_GOC_NEW_COLOR = cc.color(252, 226, 123);
    BkColor.VV_PAYMENT_SMS_NORMAL_TEXT = cc.color(155, 75, 22);
    BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR = cc.color(252, 229, 120);
    BkColor.VV_VIP_TAB_DESELECTED_BUTTON_COLOR = cc.color(160, 100, 40);

}


// GameID
if(typeof GID == "undefined") {
    var GID = {};
    GID.PHOM = 0;
    GID.BA_CAY = 1;
    GID.XITO = 2;
    GID.POKER = 3;
    GID.TLMN = 4;
    GID.XAM = 5;
    GID.LIENG = 6;
    GID.XENG = 7;
    GID.LOTTERESULT = 8;
    GID.LOALANG = 9;
    GID.TOPPLAYER = 10;
    GID.SHOP = 11;
    GID.MXH = 12;
    GID.BANGHOI = 13;
    GID.XI_DZACH = 14;
    GID.MAU_BINH = 24;
    GID.BAU_CUA = 16;
    GID.CHAN = 17;
    GID.EVENT = 18;
    GID.CO_TUONG = 19;
    GID.CO_UP = 20;
    GID.TLMN_DEM_LA = 23;
    GID.MAU_BINH_OLD = 15;
    GID.SOCCER = 21;
    GID.LODE = 22;
}

// BadgeCategory
if(typeof BadgeCategory == "undefined"){
    var BadgeCategory = {};
    BadgeCategory.Win = 0;
    BadgeCategory.FirstSpecial = 1;
    BadgeCategory.SecondSpecial = 2;
}

if (typeof BkJoinTableError ==  "undefined"){
    var BkJoinTableError = {};
    BkJoinTableError.SUCCESS                            = 0;
    BkJoinTableError.FAILED_TABLE_FULL                  = 1;
    BkJoinTableError.FAILED_NOT_ENOUGH_MONEY            = 2;
    BkJoinTableError.FAILED_USER_ALREADY_IN_TABLE       = 3;
    BkJoinTableError.FAILED_PASSWORD_INCORRECT                           = 4;
    BkJoinTableError.FAILED_NOT_ENOUGH_MONEY_TO_JOIN_DAI_GIA_ROOM        = 5;
    BkJoinTableError.FAILED_NOT_ENOUGH_MONEY_TO_JOIN_VIP_ROOM            = 6;
    BkJoinTableError.FAILED_DO_NOT_HAVE_CARD_TO_JOIN_VIP_ROOM            = 7;
}

BkConstants.FRIEND_COST = 200;
BkConstants.MIN_BET_MONEY_BINH_DAN = 50;
BkConstants.BONUS_REGISTER_PHONE = 15000;
BkConstants.FACEBOOK_BONUS_AMOUNT = 10000;
BkConstants.PROMO_ASKING_INTERVAL = 30000;
BkConstants.PROMO_MAX_SUGGEST_TIMES = 2;
BkConstants.MAX_OBSERVER_PLAYER = 20;

CHESS_DRAW_REQUEST = 0;
CHESS_DRAW_ACCEPT = 1;
CHESS_DRAW_REFUSE = 2;
CHESS_SURRENDER = 3;

CO_UP_KHONG_LAT = 0;
CO_UP_CO_LAT = 1;

MAX_DISCONNECT_TIME			= 5;
TAX_RATE 				= 0.05;
MIN_MONEY_START_GAME 		= 5;
MIN_MONEY_SALE 				= 30000;
FACEBOOK_BONUS_AMOUNT = 5000;
//player state
PLAYER_STATE_TABLE_OWNER = 0;
PLAYER_STATE_READY = 1; // ready but not yet playing
PLAYER_STATE_NOT_READY = 2;
PLAYER_STATE_FINISH_GAME = 3;
WINDOW_WIDTH = 960;
WINDOW_HEIGHT = 625;
// Bonus code
WIN_1_GAME_WITH_A_DAY_BONUS = 0;
WIN_3_DIFFERENT_GAME_IN_DAY_BONUS = 1;
WIN_ALL_GAME_IN_DAY_BONUS = 2;
PLAY_1RST_GAME_IN_DAY_BONUS = 3;
PLAY_10TH_GAME_IN_DAY_BONUS = 4;
PLAY_100TH_GAME_IN_DAY_BONUS = 5;
PLAYER_NEW_LEVEL = 6;


MN_WIN_FIRST_MATCH_IN_DAY_BONUS = 50;
MN_WIN_3_DIFFERENT_MATCH_IN_DAY_BONUS = 100;
MN_WIN_ALL_DIFFERENT_MATCH_IN_DAY_BONUS = 300;
MN_PLAY_1RST_GAME_IN_DAY_BONUS = 30;
MN_PLAY_10TH_GAME_IN_DAY_BONUS = 100;
MN_PLAY_100TH_GAME_IN_DAY_BONUS = 1000;
MN_NEW_LEVEL_BONUS_BASE = 10;
//game State
GAME_STATE_READY	= 1;
GAME_STATE_FINISH = 100;
GAME_STATE_PLAYING = 2;
GAME_STATE_NOT_READY	= 0;

GAME_STATE_WAIT_BAO_XAM        = 2;
GAME_STATE_WAIT_OTHER_BAO_XAM = 3;
GAME_STATE_WAIT_XAM_DISCARD = 4;

GAME_STATE_PHOM_WAIT_TAKE_OR_PICK_CARD = 2;
GAME_STATE_PHOM_WAIT_DISCARD = 3;
GAME_STATE_DEAL_COMPLETE = 4;
GAME_STATE_WAIT_SHOW_PHOM   = 5;

GAME_STATE_WAIT_OPEN_1_CARD = 2;

// state for chan van van
STATE_NOTREADY						= 0;
STATE_READY							= 1;
STATE_WAIT_TAKE_CARD 				= 3;
STATE_WAIT_PICK_CARD				= 2;
STATE_WAIT_DISCARD					= 4;
STATE_CHAN_WAIT_CHIU 				= 5;
STATE_CHAN_WAIT_TRA_CUA 			= 6;
STATE_WAIT_XUONG					= 7;
STATE_WAIT_BOC_CAI					= 9;
STATE_FINISH 						= 100;

//public const int READY = 1;
//public const int FINISH_GAME = 100;
//public const int NOT_ACTION = 9999;
//
//public const int PHOM_WAIT_TAKE_OR_PICK_CARD = 2;
//public const int PHOM_WAIT_DISCARD = 3;
//public const int DEAL_COMPLETE = 4;
//public const int WAIT_SHOW_PHOM = 5;
//
//public const int CHAN_WAIT_PICK_CARD = 2;
//public const int CHAN_WAIT_TAKE_CARD = 3;
//public const int CHAN_WAIT_DISCARD = 4;
//public const int CHAN_WAIT_CHIU = 5;
//public const int CHAN_WAIT_TRA_CUA = 6;
//public const int CHAN_WAIT_XUONG = 7;
//public const int CHAN_WAIT_U = 8;
//
//public const int PLAYING = 2;
//public const int WAIT_3CAY_DISCARD = 3;
//
//public const int WAIT_OPEN_1_CARD = 2;
//public const int WAIT_BET = 3;
//public const int WAIT_PICKCARD = 4;
//
//public const int WAIT_BAO_XAM = 2;
//public const int WAIT_OTHER_BAO_XAM = 3;
//public const int WAIT_XAM_DISCARD = 4;


// kick
PLAYER_LEAVE_GAME		    =0;
OWNER_KICK					=1;
RUN_OUT_OF_CASH_KICK 		=2;
TIME_OUT_KICK 				=3;
UNREADY_TIMEOUT 			=4;
LOW_CASH                    =5;

TIME_AUTO_READY 			= 20 - 1;
TIME_AUTO_START_GAME 		= 120 - 1;

// avartar type
if(typeof AT == "undefined") {
    var AT = {};
    AT.TYPE_AVATAR = 0;
    AT.TYPE_VATPHAM = 1;
    AT.TYPE_BAOBOI = 2;
}
DEAL_CARD_FINISH = "DEAL_CARD_FINISH";
CARD_SELECTION_FINISH = "CARD_SELECTION_FINISH";


// avartar type
if(typeof RT == "undefined") {
    var RT = {};
    RT.ROOM_TYPE_BINH_DAN = 0;
    RT.ROOM_TYPE_DAI_GIA = 1;
    RT.ROOM_TYPE_VIP = 2;
    RT.ROOM_TYPE_SOLO = 3;
    RT.ROOM_TYPE_RANDOM = 4;
    RT.ROOM_TYPE_NHA_TRANH = 0;
    RT.ROOM_TYPE_DINH_THU_QUAN = 1;
    RT.ROOM_TYPE_DAU_TAY_DOI = 3;
}

if(typeof CONECTION_STATE == "undefined") {
    var CONECTION_STATE = {};
    CONECTION_STATE.CONNECTION_NORMAL           = 0;
    CONECTION_STATE.RECONNECTING                = 1;
    CONECTION_STATE.LOST_CONNECTION             = 2;
    CONECTION_STATE.MAKING_NEW_CONNECTION       = 3;
    CONECTION_STATE.RELOGIN                     = 4;
    CONECTION_STATE.CLOSED_CONNECTION           = 5;
}

if(typeof AM == "undefined") {
    var AM = {};
    AM.TYPE_ADMIN_ADD = 1;
    AM.TYPE_SMS_ADD = 2;
    AM.TYPE_NAP_THE = 3;
    AM.TYPE_PAY_BET_FOOTBALL_WIN_MONEY = 4;
}

CHAT_SMILE_TEXT = ["8-|", "|-)", ":^o", "=P~", ":O)", ":)", ":-h", ":x", ":))", "=p~", "=))", ":D", ":-a", ":((", "o-)", "~X(", ":-S", ":-B", "=;", "/:)", ":-c", ":)]", ":-t", "8->", "I-)", ":-y", ":-u", ":-i", ":-p", ":-g", ":-f", ":-s", ":-w", ":-q", ":-r", ":-c", ":-x", ":-m", ":-n", ":-z"];
// CHAT_SMILE_TEXT = [":-y", "|-)", ":^o", "=P~", ":O)", ":)", ":-h", ":x", ":))", "=p~", "=))", ":D", ":-a", ":((", "o-)", "~X(", ":-S", ":-B", "=;", "/:)", ":-c", ":)]", ":-t", "8->", "I-)", "8-|", ":-u", ":-i", ":-p", ":-g", ":-f", ":-s", ":-w", ":-q", ":-r", ":-c", ":-x", ":-m", ":-n", ":-z"];


if(typeof fb == "undefined") {
    var fb = {};
    fb.SUBEVENT_LOGIN = 0;
    fb.SUBEVENT_REGISTER_PLAYER = 1;
    fb.SUBEVENT_LINK_PLAYER = 2;
    fb.SUBEVENT_CHECK_ACCOUNT_SETUP = 3;
    fb.SUBEVENT_INPUT_USER = 4;
    fb.SUBEVENT_RENAME = 5;
    fb.SUBEVENT_AUTH_FB = 6;

    fb.SUCCESS = 1;
    fb.ERR_AUTH_FACEBOOK = 2; //Tài khoản facebook của bạn không hợp lệ. Vui lòng thử lại sau

    fb.ERR_LINK_FACEBOOK_LINKED = 3; // Facebook của bạn đã liên kết với tên đăng nhập khác rồi. Bạn không thể liên kết nữa
    fb.ERR_LINK_PLAYER_LINKED = 4; //Tài khoản đã được liên kết tới một tài khoản Facebook khác!
    fb.ERR_LINK_PLAYER_FACEBOOK = 5; // Tên đăng nhập "{0}" được đăng ký qua Facebook. Bạn không thể liên kết được với tên đăng nhập này
    fb.ERR_LINK_INCORRECT_USERPASS = 6; // Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng nhập lại!

    fb.ERR_RENAME_NULL_OR_EMPTY = 7;	//Bạn chưa nhập tên đăng nhập
    fb.ERR_RENAME_UNAVAILABLE = 8;//Bạn không thể đổi tên được nữa vì đã đổi tên rồi!
    fb.ERR_RENAME_PROHIBITED = 9; //Tên đăng nhập không được chứa ký tự đặc biệt. Chỉ được chứa chữ, số hoặc dấu _
    fb.ERR_RENAME_EXISTING = 10; //Tên của bạn đã có người đăng ký. Hãy chọn một tên khác.

}
if(typeof BT == "undefined") {
    var BT = {};
    BT.ZERO_PERCENT = 0;
    BT.THIRTY_PERCENT = 1;
    BT.FIFTY_PERCENT = 2;
    BT.HUNDRERD_PERCENT = 3;
    BT.HUNDRERD_FIFTY_PERCENT = 4;
    BT.TWO_HUNDRERD_PERCENT = 5;
    BT.THREE_HUNDRERD_PERCENT = 6;
    BT.FOUR_HUNDRERD_PERCENT = 7;
    BT.FIVE_HUNDRERD_PERCENT = 8;
    BT.SIX_HUNDRERD_PERCENT = 9;
    BT.SEVENT_HUNDRERD_PERCENT = 10;
    BT.EIGHT_HUNDRERD_PERCENT = 11;
}
if(typeof REG_FAIL == "undefined") {
    var REG_FAIL = {};
    REG_FAIL.FAILURE_PWD = 3;
    REG_FAIL.SUGGEST_NAME_ERR = 2;
    REG_FAIL.SUGGEST_NEW_NAME = 1;
    REG_FAIL.FAILURE_OTHER = 0;
}
if(typeof BET_FOOTBALL == "undefined") {
    var BET_FOOTBALL = {};
    BET_FOOTBALL.GET_ALL_GIAI_DAUS_EVENT = 0;
    BET_FOOTBALL.GET_ALL_TRAN_DAUS_EVENT = 1;
    BET_FOOTBALL.GET_ALL_KEOS_EVENT = 2;
    BET_FOOTBALL.GET_ALL_PLAYER_CUOCS_EVENT = 3;
    BET_FOOTBALL.GET_CUOC_EVENT = 4;
    BET_FOOTBALL.PLACE_CUOC_EVENT = 5;
    BET_FOOTBALL.GET_LATEST_CUOCS_EVENT = 6;
    BET_FOOTBALL.GET_TOP_WINNING_CUOCS_EVENT = 7;
    BET_FOOTBALL.NOT_SUPPORTED_EVENT = 8;
    BET_FOOTBALL.ALLOWED_MINUTES_BEFORE_MATCH_START = 10;
    BET_FOOTBALL.PLACE_BET_SUCCESS = 1;
    BET_FOOTBALL.PLACE_BET_WRONG = 0;
    BET_FOOTBALL.OPEN_STATUS = -1;
    BET_FOOTBALL.DELAY_STATUS = -2;
    BET_FOOTBALL.PROCESSED_STATUS = 0;
    BET_FOOTBALL.VISIBLE_STATUS = 1;
    BET_FOOTBALL.INVISIBLE_STATUS = 0;
    BET_FOOTBALL.DEFAULT_GIAI_DAU_PRIORITY = 100;
}
if(typeof SERVER_REQUEST == "undefined") {
    var SERVER_REQUEST = {};
    SERVER_REQUEST.SERVER_REQUEST_RECOMMEND_CASH_BONUS = 8;
    SERVER_REQUEST.SERVER_REQUEST_UPDATE_CASH_BONUS = 9;
    SERVER_REQUEST.SERVER_REQUEST_GET_PAYMENT_INFO = 16;
}
if(typeof PAYMENT_TYPE == "undefined")
{
    var PAYMENT_TYPE = {};
    PAYMENT_TYPE.ADD_MONEY_TYPE_CARD  = 4;
    PAYMENT_TYPE.ADD_MONEY_TYPE_SMS  = 0;
    PAYMENT_TYPE.ADD_MONEY_TYPE_IAP  = 5;
}
if(typeof WD_TAG == "undefined")
{
    var WD_TAG = {};
    WD_TAG.HOT_NEWS  = 1;
}
EVENT_SWITCH_SCREEN = "switchscreen";
KEY_SCREEN_NAME = "screenName";
EVENT_BUTTON_PRESS = "buttonpress";
KEY_BUTTON_NAME = "buttonName";
EVENT_LOGIN = "login";
KEY_CPID = "cpid";
GROUP_NAME = ["Kết quả Hiệp 1", "Kết quả Hiệp 1", "Kết quả Hiệp 1", "Kết quả cả trận", "Kết quả cả trận", "Kết quả cả trận",
    "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng", "Tổng số bóng",
    "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng",
    "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng",
    "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng",
    "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng", "Tỉ số bóng",
    "Tỉ số bóng",
    "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng",
    "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng",
    "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng", "Chấp bóng"];
KEO_NAME = ["1 Thắng", "Hòa", "2 Thắng", "1 Thắng", "Hòa", "2 Thắng", "Trên 0.5",
    "Trên 1.5",
    "Trên 2.5",
    "Trên 3.5",
    "Trên 4.5",
    "Trên 5.5",
    "Trên 6.5",
    "Dưới 0.5",
    "Dưới 1.5",
    "Dưới 2.5",
    "Dưới 3.5",
    "Dưới 4.5",
    "Dưới 5.5",
    "Dưới 6.5",
    "1-0",
    "2-0",
    "2-1",
    "3-0",
    "3-1",
    "3-2",
    "4-0",
    "4-1",
    "4-2",
    "4-3",
    "5-0",
    "5-1",
    "5-2",
    "5-3",
    "5-4",
    "6-0",
    "6-1",
    "6-2",
    "0-0",
    "1-1",
    "2-2",
    "3-3",
    "4-4",
    "0-1",
    "0-2",
    "1-2",
    "0-3",
    "1-3",
    "2-3",
    "0-4",
    "1-4",
    "2-4",
    "3-4",
    "0-5",
    "1-5",
    "2-5",
    "3-5",
    "4-5",
    "0-6",
    "1-6",
    "2-6",
    "1(-3.5)",
    "1(-3)",
    "1(-2.5)",
    "1(-2)",
    "1(-1.5)",
    "1(-1)",
    "1(-0.5)",
    "1(0)",
    "1(+0.5)",
    "1(+1)",
    "1(+1.5)",
    "1(+2)",
    "1(+2.5)",
    "1(+3)",
    "1(+3.5)",
    "2(-3.5)",
    "2(-3)",
    "2(-2.5)",
    "2(-2)",
    "2(-1.5)",
    "2(-1)",
    "2(-0.5)",
    "2(0)",
    "2(+0.5)",
    "2(+1)",
    "2(+1.5)",
    "2(+2)",
    "2(+2.5)",
    "2(+3)",
    "2(+3.5)"];
//Vinh added 06/03/2018
if(typeof InAppBilling == "undefined")
{
	var InAppBilling = {};
	InAppBilling.IAB1 = "com.gameviet.chanvanvan.1usd";
	InAppBilling.IAB5 = "com.gameviet.chanvanvan.5usd";
	InAppBilling.IAB20 = "com.gameviet.chanvanvan.20usd";
	InAppBilling.RECEIPT_DATA_IAB = "receiptDataIab";
	InAppBilling.SIGNALTURE_DATA_IAB = "signaltureIab";
}
if(typeof VersionCompareResult == "undefined")
{
	var VersionCompareResult = {};
	VersionCompareResult.Same = 0;
	VersionCompareResult.MinorUpdate = 1;
	VersionCompareResult.MajorUpdate = 2;
}
APP_VERSION = "0.6.70";
PACKET_NAME = "com.gameviet.chanvanvan";
PUBLIC_KEY_BASE64 = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2EdDZfXt2ZVO5dzUFLNJ8pbwpsAizyaul7fG5KfA85QeRKC2xR4i0gpKK8rLCLhPcS5D3g+EIJ2nBWQxuLqy1/0wKo0PXLnX6IkN3OlN9T93Jz2aZqQa9lMyWDXttl/8WuJlzyLae9C0Bkfw7HXfbSJWd7qK9qHH4p/EcsTvYFITEKrtBztgBbE5Be7EhfKiek24gTg8URdHTL5sELQbnPV+iUK/jrWWZYKL11fbB7L4HwQK57qW+XTjrzqGII6A83jK03Hkc0mzZkz5jhe6uN6eG/q+5JrRqGrg2+Qnl4aW246HIqIAnMFcLS75SA4uhuOibOxsQrwLMYIqxzOvawIDAQAB";
