/**
 * Created by vinhnq on 12/22/2016.
 */
BkGiaiDauItem = cc.Class.extend({
    name: null,
    id: null,
    url: null,
    ctor: function (name, id, url)
    {
        this.name = name;
        this.id = id;
        this.url = url;
    }
});
