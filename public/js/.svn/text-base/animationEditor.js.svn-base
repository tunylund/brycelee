var animationEditor = {

    editorEl: null,
    templates: {
        row: '<div id="frameEditorRow_{count}" class="frameEditor_row">' +
                    
                    '<label for="frames[{count}].name">name:</label> ' +
                    '<input type="text" name="frames[{count}].name" value="{name}" /> ' +
                    
                    '<label for="frames[{count}].indexes">indexes:</label> ' +
                    '<input type="text" name="frames[{count}].indexes" value="{indexes}" /> ' +
                    
                    '<label for="frames[{count}].speed">speed:</label> ' +
                    '<input type="number" name="frames[{count}].speed" value="{speed}" step="0.5" /> ' +
                    
                    '<input type="button" name="removeRow" value="remove" />' +
                    
                    '<div class="animationPreview" style="background-image:url({sheetUrl});width:{width};height:{height};' +
                    '-moz-background-size:auto {height}px;-webkit-background-size:auto {height}px;background-size:auto {height}px;"></div>' +
             '</div>',
        frameCount: '<input type="hidden" name="frameCount" value="{count}" />'
    },
    count: 0,

    initialize: function() {
        
        var self = this;
        this.container = $("#animationEditorContainer");
        this.addBtn = this.container.find("[name='addFrameButton']");
        var form = this.container.closest("form");
        $(form).submit($.proxy(this.onSubmit, this));
        
        this.addBtn.click($.proxy(this.onAddClick, this));
        $("input[name$='.indexes']").live('change', $.proxy(this.onAnimationIndexesChange, this));
        $("input[name$='.speed']").live('change', $.proxy(this.onAnimationIndexesChange, this));
        $("input[name='removeRow']").live('click', $.proxy(this.onRemoveClick, this));

    },
    
    onAddClick: function() {
        this.add();
    },

    add: function(name, indexes, speed) {
        var row = $(this.templates.row
                .replace(/{sheetUrl}/g, frameEditor.sheetUrl)
                .replace(/{count}/g, this.count)
                .replace(/{width}/g, frameEditor.tileSize)
                .replace(/{height}/g, frameEditor.tileSize)
                .replace(/{name}/g, name || "")
                .replace(/{indexes}/g, indexes || "")
                .replace(/{speed}/g, speed));
                
        this.addBtn.before(row);
        row.data("preview", new AnimationPreview(row.find(".animationPreview"), indexes, 1/2, Number(speed)));

        this.count++;
    },
    
    onAnimationIndexesChange: function(e) {
        var row = $(e.target).parent(),
            indexesEl = row.find("input[name$='.indexes']"),
            speedEl = row.find("input[name$='.speed']"),
            prev = row.data("preview");
        prev.destroy();
        row.data("preview", new AnimationPreview(row.find(".animationPreview"), indexesEl.val(), 1/2, speedEl.val()));
    },

    onRemoveClick: function(e) {
        animationEditor.remove(e.target.parentNode);
    },

    remove: function(el) {
        $(el).css("display", "none")
        $(el).find("input")[1].value = "";
    },

    onSubmit: function() {
       this.container.append(this.templates.frameCount.replace(/{count}/, this.count));
    }
    
};

var AnimationPreview = function(el, indexes, scale, speed) {
    this.el = el;
    this.frame = 0;
    this.scale = scale;
    this.setSpeed(speed);
    this.setIndexes(indexes);
    
    if(this.frameEls.length > 0 && this.speed > 0)
        this.timeout = setTimeout($.proxy(this.next, this), this.speed);
};
AnimationPreview.prototype = {

    frameSpeed: 1000/25,
    
    next: function() {
        var frameEl = this.frameEls[this.frame],
            pos = frameEl.css("background-position").split(" "),
            left = parseInt(pos[0], 10)*this.scale,
            top = parseInt(pos[1], 10)*this.scale;
        this.el.css("background-position", left + "px" + " " + top + "px");
        this.frame = (this.frame+1) % (this.indexes.length);
        this.timeout = setTimeout($.proxy(this.next, this), this.speed);
    },
    
    setSpeed: function(speed) {
        this.speed = this.frameSpeed*speed;
    },
    
    setIndexes: function(indexes) {
        this.el.css("visibility", "hidden");
        this.frameEls = [];
        
        if(indexes && indexes.length > 0) {
            
            this.indexes = indexes.split(",");
            
            var els = $(".frameEditor_frame");
            for(var i=0; i<this.indexes.length; i++) {
                var ix = Number(this.indexes[i]);
                if(ix < els.length)
                    this.frameEls.push(els.eq(ix));
            }
            
        }
        
        if(this.frameEls.length > 0)
            this.el.css("visibility", "visible");
    },
    
    destroy: function() {
        clearTimeout(this.timeout);
        delete this;
    }
}
