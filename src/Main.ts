//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }
    private createScene() {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    private static STEP_ROPT:number = 3;
    private static STEP_SCALE:number = .03;

    protected startCreateScene(): void {
       
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        let bg:egret.Shape = new egret.Shape;
        bg.graphics.beginFill(0x336699);
        bg.graphics.drawRect(0,0,stageW,stageH);
        bg.graphics.endFill();
        this.addChild(bg);
    
        // 1 显示对象基本
        // 1.1 最基本的显示
        

        this.ali = this.createBitmapByName("ali_png");
        this.addChild(this.ali);
        this.ali.x = stageW/2;
        this.ali.y = stageH/2;
        this.ali.anchorOffsetX = this.ali.width/2;
        this.ali.anchorOffsetY = this.ali.height/2;
        
        // let txInfo = new egret.TextField;// 提示信息
        // this.addChild(txInfo);
        // txInfo.size = 28;
        // txInfo.x = 50;
        // txInfo.y = 50;
        // txInfo.textAlign = egret.HorizontalAlign.LEFT;
        // txInfo.textColor = 0X000000;
        // txInfo.type = egret.TextFieldType.DYNAMIC;//动态文本
        // txInfo.lineSpacing = 6;//行间距
        // txInfo.multiline = true;//多行?
        // txInfo.text = "轻触屏幕调整显示对象位置";

        // this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (evt:egret.TouchEvent) => {
        //     ali.x = evt.localX;
        //     ali.y = evt.localY;
        // }, this);

        // 1.2 锚点及旋转

        // 阿里复用

        this.text = new egret.TextField;
        this.addChild(this.text);
        this.text.size = 28;
        this.text.x = 50;
        this.text.y = 50;
        this.text.textAlign = egret.HorizontalAlign.LEFT;
        this.text.textColor = 0x000000;
        this.text.type = egret.TextFieldType.DYNAMIC;
        this.text.lineSpacing = 6;
        this.text.multiline = true;

        // this.launchAnimations(); //1.2交互方法
        


        // let line = new egret.Shape();
        // line.graphics.lineStyle(2, 0xffffff);
        // line.graphics.moveTo(0, 0);
        // line.graphics.lineTo(0, 117);
        // line.graphics.endFill();
        // line.x = 172;
        // line.y = 61;
        // this.addChild(line);


        // let colorLabel = new egret.TextField();
        // colorLabel.textColor = 0xffffff;
        // colorLabel.width = stageW - 172;
        // colorLabel.textAlign = "center";
        // colorLabel.text = "Hello Egret";
        // colorLabel.size = 24;
        // colorLabel.x = 172;
        // colorLabel.y = 80;
        // this.addChild(colorLabel);

        // let textfield = new egret.TextField();
        // this.addChild(textfield);
        // textfield.alpha = 0;
        // textfield.width = stageW - 172;
        // textfield.textAlign = egret.HorizontalAlign.CENTER;
        // textfield.size = 24;
        // textfield.textColor = 0xffffff;
        // textfield.x = 172;
        // textfield.y = 135;
        // this.textfield = textfield;

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        // RES.getResAsync("description_json", this.startAnimation, this);

        // let button = new eui.Button();
        // button.label = "Click!";
        // button.horizontalCenter = 0;
        // button.verticalCenter = 0;
        // this.addChild(button);
        // button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        // 1.3 碰撞检测
        // 核心检测碰撞只有一个API，就是代码中的`hitTestPoint`
        this._dot = new egret.Shape;
        this._dot.graphics.beginFill(0x00ff00);
        this._dot.graphics.drawCircle(0,0,5);
        this._dot.graphics.endFill();

        this.text.touchEnabled = true; //接上面的类型
        this.text.addEventListener(egret.TouchEvent.TOUCH_TAP,(evt:egret.TouchEvent) => {
            evt.stopImmediatePropagation();
            this._bShapeTest = ! this._bShapeTest;
            this.updateInfo(TouchCollideStatus.NO_TOUCHED);
        },this);

        

    }
    // 1.1 参数
    private ali:egret.Bitmap;
    private text:egret.TextField;
    // 1.2 参数 以及 交互方法
    // private STEP_ROT:number =3;
    // private STEP_SCALE:number = .03;
    // private AniMode:number;
    // private ScaleBase:number;
    // private AniModes = {
    //     ANIM_ROT: 0, 
    //     ANIM_SCALE: 1,
    // };
    // private launchAnimations():void{
    //     this.AniMode = this.AniModes.ANIM_ROT;// 这儿这么引似乎有问题
    //     // this.AniMode = 0;
    //     this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
    //         this.AniMode = (this.AniMode + 1)%3;
    //     },this);
    //     this.ScaleBase = 0;
    //     this.addEventListener(egret.Event.ENTER_FRAME,(evt:egret.Event)=>{//进入新一帧的广播事件
    //         switch(this.AniMode){
    //             case this.AniModes.ANIM_ROT: //旋转
    //             // case 0:
    //                 this.ali.rotation += this.STEP_ROT;
    //                 break;
    //             case this.AniModes.ANIM_SCALE: //缩放
    //             // case 1:
    //                 this.ali.scaleX=this.ali.scaleY=0.5+0.5*Math.abs(Math.sin(this.ScaleBase+=this.STEP_SCALE));
    //                 break;
    //         }
    //         this.text.text = 
    //             "旋转角度：" + this.ali.rotation +
    //             "\n缩放比例：" + this.ali.scaleX.toFixed(2) +
    //             "\n轻触进入" + ["缩放","静止","旋转"][this.AniMode] + "模式";
    //         return false;  /// 友情提示： startTick 中回调返回值表示执行结束是否立即重绘 ???
    //     },this);
    // }

    // 1.3 参数及方法
    private _dot:egret.Shape;
    private _iTouchCollideStatus:number;
    private _bShapeTest:boolean;

    private lauchCollisionTest():void{
        this._iTouchCollideStatus = TouchCollideStatus.NO_TOUCHED;
        this._bShapeTest = false;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.updateInfo(TouchCollideStatus.NO_TOUCHED);
    }

    private checkCollision( stageX:number, stageY:number ):void {
        // 核心代码
        var bResult:boolean = this.ali.hitTestPoint(stageX,stageY,this._bShapeTest);
        this._dot.x=stageX;
        this._dot.y=stageY;
        this.updateInfo(bResult?TouchCollideStatus.COLLIDED:TouchCollideStatus.TOUCHED_NO_COLLIDED);
    }

    private touchHandler(evt:egret.TouchEvent){
        switch(evt.type){
            case egret.TouchEvent.TOUCH_MOVE:
                this.checkCollision(evt.stageX,evt.stageY);
                break;
            case egret.TouchEvent.TOUCH_BEGIN:
                if(!this._text.hitTestPoint(evt.stageX,evt.))
        }
    }

    private updateInfo( iStatus:number ){
        this.text.text = 
            "碰撞检测结果：" + 
            ( ["放上手指！","想摸我？", "别摸我！！！"][iStatus] ) +
            "\n\n碰撞检测模式：" + ( this._bShapeTest ? "非透明像素区域" : "矩形包围盒" ) +
            "\n（轻触文字区切换）";
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }
}
