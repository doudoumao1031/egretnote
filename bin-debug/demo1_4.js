// class Demo1_4{
//     public static launch(big):void{
//         big.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
//     }
//     private touchHandler(evt:egret.TouchEvent){
//         switch(evt.type){
//             case egret.TouchEvent.TOUCH_MOVE:
//         }
//     }
//     private updateBird(stageX:number,stageY:number):void{
//         big.ali.x = stageX;
//         big.ali.y = stageY;
//     }
// }
var Demo1_4;
(function (Demo1_4) {
    function launch() {
        console.log('doudoumao');
    }
    Demo1_4.launch = launch;
    function updateBird(stageX, stageY, obj) {
        /// 小鸟同步手指位置
        obj._bird.x = stageX;
        obj._bird.y = stageY;
    }
    Demo1_4.updateBird = updateBird;
    function touchHandler(evt) {
        switch (evt.type) {
            case egret.TouchEvent.TOUCH_MOVE:
                updateBird(evt.stageX, evt.stageY, this);
                break;
            case egret.TouchEvent.TOUCH_BEGIN:
                console.log(touchHandler, this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, touchHandler, this);
                this.stage.once(egret.TouchEvent.TOUCH_END, touchHandler, this);
                this._shpBeMask.mask = this._bird; // 遮罩核心代码
                updateBird(evt.stageX, evt.stageY, this);
                break;
            case egret.TouchEvent.TOUCH_END:
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, touchHandler, this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, touchHandler, this);
                this._shpBeMask.mask = null;
                this._bird.$maskedObject = null; // 这一句干嘛
                break;
        }
    }
    function getRdmClr() {
        return (Math.floor(Math.random() * 0xff) << 16)
            + (Math.floor(Math.random() * 0xff) << 8)
            + Math.floor(Math.random() * 0xff);
    }
    function imgLoadHandler() {
        // console.log(this);
        /// 用以被遮罩的形状
        this._shpBeMask = new egret.Shape;
        this._shpBeMask.graphics.lineStyle(0x000000);
        this._shpBeMask.graphics.beginFill(getRdmClr());
        this._shpBeMask.graphics.drawEllipse(0, 0, 200, 300);
        this._shpBeMask.graphics.endFill();
        this._shpBeMask.x = (this.stage.stageWidth - 200) / 2;
        this._shpBeMask.y = (this.stage.stageHeight - 300) / 2;
        this.addChild(this._shpBeMask);
        var wHalfBird = this._bird.width / 2;
        var hHalfBird = this._bird.height / 2;
        this._bird.x = wHalfBird + (this.stage.stageWidth - wHalfBird * 2) * Math.random();
        this._bird.y = hHalfBird + (this.stage.stageHeight - hHalfBird * 2) * Math.random();
        this.addChild(this._bird);
        this._txInfo.text =
            "接触屏幕后白鹭小鸟将变为椭圆形状的遮罩区域，可以移动手指（白鹭小鸟）并观察椭圆在遮罩下的显示变化";
        launchMask(this);
    }
    Demo1_4.imgLoadHandler = imgLoadHandler;
    function launchMask(obj) {
        obj.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, touchHandler, obj);
    }
})(Demo1_4 || (Demo1_4 = {}));
//# sourceMappingURL=demo1_4.js.map