var frameEditor = {

    editorEl: null,
    
    templates: {
        
        editor: '<div class="frameEditor" style="width:{width}px;"></div>',
        
        frame: '<div class="frameEditor_frame" style="background-image:url({sheetUrl});width:{width};height:{height};' +
               '-moz-background-size:auto {height}px;-webkit-background-size:auto {height}px;background-size:auto {height}px;' +
               'background-position: {position}px 0;">' +
                    '<span>frame: {count}</span><br />' +
                    '<div class="frameEditor_values">' +
                        'x: <input type="text" name="characterType.collisionRectangles[{count}].x" value="0" /><br />'+
                        'y: <input type="text" name="characterType.collisionRectangles[{count}].y" value="0" /><br />'+
                        'w: <input type="text" name="characterType.collisionRectangles[{count}].width" value="0" /><br />'+
                        'h: <input type="text" name="characterType.collisionRectangles[{count}].height" value="0" />'+
                    '</div>' +
               '</div>',
           
        copy: '<div class="frameEditor_copyFrame">&gt</div>',

        input: '<input type="hidden" name="characterType.frames[\'{name}\'].name" value="{value}" />'
        
    },

    imgAreaInstances: [],

    initialize: function(container, sheetUrl, sheetWidth, sheetHeight) {
        
        var self = this;
        this.container = container;
        this.sheetUrl = sheetUrl;
        this.sheetHeight = sheetHeight;
        this.sheetWidth = sheetWidth;
        this.tileSize = sheetHeight;
        
        this.container.append(this.templates.editor
                            .replace(/{width}/g, sheetHeight*2*5)
                            .replace(/{height}/g, Math.ceil(sheetWidth/sheetHeight/5)*sheetHeight*2));
        this.editorEl = $(container.children("div")[0]);
        
        for(var i=0, j=0; i<sheetWidth; i=i+this.tileSize, j++) {
            this.editorEl.append(this.templates.frame
                        .replace(/{sheetUrl}/g, sheetUrl)
                        .replace(/{position}/g, -i*2)
                        .replace(/{width}/g, this.tileSize*2)
                        .replace(/{height}/g, this.tileSize*2)
                        .replace(/{count}/g, j));
            if(i+this.tileSize<sheetWidth)
                this.editorEl.append(this.templates.copy);
        }
        
        $('.frameEditor_frame').each(function(i, el) {
            $(el).find('input').click(function() { self.onCollisionValueChange.apply(self, arguments)} );
            self.imgAreaInstances.push($(el).imgAreaSelect({
                handles: true,
                instance: true,
                onSelectChange: function(el, obj) {
                    self.onCollisionRectangleChange.apply(self, arguments);
                },
                onSelectEnd: function(el, obj) {
                    self.onCollisionRectangleEnd.apply(self, arguments);
                }
            }));
        });

        $(".frameEditor_copyFrame").bind('click', $.proxy(this.onFrameCopyClick, this));

    },

    setCollisionRectangle: function(index, rect) {
        var rect = {
            x1: parseInt(rect.x)*2 || 0,
            y1: parseInt(rect.y)*2 || 0,
            x2: parseInt(rect.x)*2 + parseInt(rect.width)*2 || 0,
            y2: parseInt(rect.y)*2 + parseInt(rect.height)*2 || 0,
            width: parseInt(rect.width)*2 || 0,
            height: parseInt(rect.height)*2 || 0
        };
        this.imgAreaInstances[index].setSelection(rect.x1, rect.y1, rect.x2, rect.y2);
        this.imgAreaInstances[index].setOptions({show:true});
        this.imgAreaInstances[index].update();
        this.onCollisionRectangleChange(this.container.find(".frameEditor_frame")[index], rect);
    },

    onCollisionRectangleChange: function(el, rect) {
        $(el).find("input[name$='.x']").val(Math.ceil(rect.x1/2));
        $(el).find("input[name$='.y']").val(Math.ceil(rect.y1/2));
        $(el).find("input[name$='.width']").val(Math.ceil(rect.width/2));
        $(el).find("input[name$='.height']").val(Math.ceil(rect.height/2));
    },

    onCollisionRectangleEnd: function(el, rect) {
    },

    onCollisionValueChange: function(e) {
        console.log("onCollisionValueChange");
        var p = $(e.target.parentNode), index = e.target.name.match(/\d+/)[0];
        var rect = this.getRect(p);
        this.imgAreaInstances[index].setSelection(rect.x1, rect.y1, rect.x2, rect.y2);
        this.imgAreaInstances[index].setOptions({show:true});
        this.imgAreaInstances[index].update();
    },
    
    onFrameCopyClick: function(e) {
        var c = $(e.target),
            prev = c.prev(),
            ix = $(".frameEditor_frame").index(c.next()),
            rect = this.getRect(prev);
        this.setCollisionRectangle(ix, rect);
    },
    
    getRect: function(el) {
        return {
            x: el.find("input[name$='.x']").val(),
            y: el.find("input[name$='.y']").val(),
            width: el.find("input[name$='.width']").val(),
            height: el.find("input[name$='.height']").val()
        };    
    }
    
};
