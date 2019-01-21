/**
 * Created by hoangthao on 09/11/2015.
 */
TITLED_STAR_SIZE = 12;
TITLED_STAR_MAX_NUM = 5;

BkTiledSprite = BkSprite.extend({
    ctor: function (starIndex) {
        var img = res.ranks_strip;
        this._super(img, cc.rect(TITLED_STAR_SIZE * starIndex, 0, TITLED_STAR_SIZE, 11));
    }
});