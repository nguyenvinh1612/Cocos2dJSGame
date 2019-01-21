/**
 * Created by VanChinh on 10/20/2015.
 */

VvShoppingItemsData = cc.Class.extend({
    listItems: null,
    ctor: function () {
        this.initItems();
    },
    initItems: function () {
        if (this.listItems == null) {
            this.listItems = [];
            // Special Items
            // 0x7FFFFFFF: max - Int32
            var item = new BkItemInfo(0,0,"TopAddedMoney","Đại Phú Hộ","Phần thưởng dành cho người nạp nhiều \nquan nhất", 0x7FFFFFFF, 7, true, true);
            this.listItems.push(item);

            item = new BkItemInfo(0, 1, "TopWinningMoney","Thần Chắn","Phần thưởng dành cho người thắng nhiều \nquan nhất", 0x7FFFFFFF, 7, true, true);
            this.listItems.push(item);

            // Free Avatars
            item = new BkItemInfo(0, 2, "tadien", "Tá điền", "", 0, 0x7FFFFFFF, false, true);
            this.listItems.push(item);

            item = new BkItemInfo(0, 3, "cotuyet", "Cô Tuyết", "", 0, 0x7FFFFFFF, false, true);
            this.listItems.push(item);

            item = new BkItemInfo(0, 4, "thino", "Thị Nở", "", 0, 0x7FFFFFFF, false, true);
            this.listItems.push(item);

            item = new BkItemInfo(0, 5, "chipheo", "Chí Phèo", "", 0, 0x7FFFFFFF, false, true);
            this.listItems.push(item);

            // Priced Avatars
            item = new BkItemInfo(0, 6, "thonnu", "Thôn nữ", "", 5000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 7, "ongbut", "Ông bụt", "", 10000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 8, "thieugia", "Thiếu gia", "", 5000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 9, "nhanho", "Nhà nho", "", 50000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 10, "huyenhinh", "Huyện Hinh", "", 10000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 11, "quanhuyen", "Quan huyện", "", 5000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 12, "linhtrang", "Lính tráng", "", 5000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 13, "thieunuquanho", "Thiếu nữ quan họ", "", 5000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 14, "bahuyen", "Bà huyện", "", 50000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 15, "banghi", "Bà nghị", "", 5000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(0, 16, "bonhi", "Bồ nhí", "", 10000, 10);
            this.listItems.push(item);

            // Tai San
            item = new BkItemInfo(1, 17, "xehoi", "Xe hơi", "", 1000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(1, 18, "xedap", "Xe đạp", "", 200, 10);
            this.listItems.push(item);

            item = new BkItemInfo(1, 19, "longchim", "Lồng chim", "", 1500, 10);
            this.listItems.push(item);

            item = new BkItemInfo(1, 20, "holo", "Hồ lô", "", 10000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(1, 21, "depgo", "Dép gỗ", "", 5000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(1, 22, "dieubat", "Điếu bát", "", 1200, 10);
            this.listItems.push(item);

            item = new BkItemInfo(1, 23, "dendau", "Đèn dầu", "", 2500, 10);
            this.listItems.push(item);

            //Bao Boi
            item = new BkItemInfo(2, 24, "vipcard", "Thẻ VIP", "Được vào phòng VIP", 0, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 25, "unkickable", "Không bị đuổi", "Giúp bạn không bị người khác đuổi khỏi bàn", 20000, 7);
            this.listItems.push(item);

            item = new BkItemInfo(2, 26, "allowkick", "Cho phép đuổi", "Giúp bạn có thể đuổi người khác ra khỏi \nbàn cho dù bạn không phải là chủ bàn", 50000, 5);
            this.listItems.push(item);

            item = new BkItemInfo(2, 27, "exp_x2", "Nhân đôi kinh nghiệm", "Bạn sẽ được nhân đôi điểm kinh nghiệm\nso với bình thường", 10000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 28, "exp_x5", "Nhân năm kinh nghiệm", "Bạn sẽ được nhân năm điểm kinh nghiệm\nso với bình thường", 20000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 29, "exp_x10", "Nhân mười kinh nghiệm", "Bạn sẽ được nhân mười điểm kinh nghiệm\nso với bình thường", 50000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 30, "level_plus2", "Tăng 2 level", "Level của bạn sẽ được tăng lên 2 bậc", 10000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 31, "level_plus5", "Tăng 5 level", "Level của bạn sẽ được tăng lên 5 bậc", 15000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 32, "level_plus10", "Tăng 10 level", "Level của bạn sẽ được tăng lên 10 bậc", 30000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 33, "bet_x2", "Cược gấp 2 lần giới hạn bàn", "Bạn được đặt cược gấp 2 lần số xu giới hạn\ncủa bàn chơi khi là chủ bàn", 10000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 34, "bet_x5", "Cược gấp 5 lần giới hạn bàn", "Bạn được đặt cược gấp 5 lần số xu giới hạn\ncủa bàn chơi khi là chủ bàn", 15000, 10);
            this.listItems.push(item);

            item = new BkItemInfo(2, 35, "bet_x10", "Cược gấp 10 lần giới hạn bàn", "Bạn được đặt cược gấp 10 lần số xu giới hạn\ncủa bàn chơi khi là chủ bàn", 30000, 10);
            this.listItems.push(item);
        }
    },

    getItem: function (itemId) {
        if (this.listItems)
        {
            if(itemId > 24 ) // because of removing VIP item
            {
                //return this.listItems[itemId - 1];
            }
            return this.listItems[itemId];
        }
    }
});